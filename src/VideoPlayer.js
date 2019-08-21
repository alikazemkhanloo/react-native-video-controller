/**
 * @flow
 */

import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  ImageBackground
} from "react-native";
import Video from "react-native-video";
// import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Orientation from "react-native-orientation";
import Reanimated from "react-native-reanimated";
import Slider from "react-native-reanimated-slider";
import { PAUSED, PLAYING, LOADING, ERROR } from "./PlayState";
import PlayPause from "./PlayPause";
import Menu from "./Menu";
import Loading from "./Loading";

const styles = StyleSheet.create({
  topCorner: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  time: {
    color: "#fff",
    padding: 3
  }
});

export type State = {
  source: { uri: string },
  controls_hidden: boolean,
  currentTime: number,
  seekableDuration: number,
  show_video: boolean,
  playState: PLAYING | PAUSED | LOADING | ERROR,
  resolutions: Array<number>,
  paused: boolean,
  fullscreen: boolean,
  subtitles: Array<any>,
  currentSub: string,
  selectedVideoTrackHeight: number
};

type Props = {
  source: { uri: string },
  renderPlayPause?: (state: typeof Animated.Value) => React.Node,
  renderTopRight: ({
    subtitles: Array<any>,
    resolutions: Array<any>
  }) => React.Node,
  renderTopLeft: ({
    subtitles: Array<any>,
    resolutions: Array<any>
  }) => React.Node,
  renderLoading?: () => React.Node,
  renderError: () => React.Node
};
class VideoPlayer extends React.Component<Props, State> {
  _menu = {};

  static getDerivedStateFromProps(props, state) {
    if (props.source !== state.source) {
      return {
        source: props.source
      };
    }
  }

  static defaultProps = {
    renderPlayPause: (state: typeof Animated.Value) => (
      <PlayPause state={state} />
    ),
    renderLoading: () => <Loading />
  };

  constructor(props) {
    super(props);
    // firebase.admob().openDebugMenu();
    const initialOrientation = Orientation.getInitialOrientation();
    this.playpause = new Animated.Value(0.5);
    this.currentTime = new Reanimated.Value(0);
    this.playableDuration = new Reanimated.Value(0);
    this.seekableDuration = new Reanimated.Value(0);

    this.show_controls_progress = new Animated.Value(1);
    this.topbar_translate = this.show_controls_progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 0]
    });
    this.seekbar_translate = this.show_controls_progress.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0]
    });
    this.translate_play = this.show_controls_progress.interpolate({
      inputRange: [0, 0.000001, 1],
      outputRange: [-99999999, 0, 0]
    });
    this.hideControlsAnimation = Animated.timing(this.show_controls_progress, {
      useNativeDriver: true,
      toValue: 0
    });

    this.showControlsAnimation = Animated.timing(this.show_controls_progress, {
      useNativeDriver: true,
      toValue: 1
    });

    this.state = {
      source: props.source,
      controls_hidden: false,
      currentTime: 0,
      seekableDuration: 0,
      show_video: true,
      playState: LOADING,
      resolutions: [],
      paused: false,
      fullscreen: initialOrientation === "LANDSCAPE",
      subtitles: [],
      currentSub: "خاموش",
      selectedVideoTrackHeight: 0
    };
  }

  componentDidMount = () => {
    Orientation.addOrientationListener(this._orientationDidChange);
  };

  componentWillUnmount = () => {
    Orientation.removeOrientationListener(this._orientationDidChange);
  };

  _orientationDidChange = orientation => {
    this.setFullScreen(orientation === "LANDSCAPE");
  };

  renderTopRight = ({ subtitles }) => {
    const filtered = subtitles.filter(i => !!i.language);
    const items = [{ title: "خاموش" }, ...filtered];
    return <Menu title="زیرنویس" onItemPress={this.setSub} items={items} />;
  };

  renderTopLeft = ({ resolutions }) => {
    const items = resolutions.map(i => ({
      title: String(i),
      value: i
    }));
    items.unshift({ title: "خودکار", value: 0 });
    return (
      <Menu
        title="کیفیت"
        onItemPress={({ value }) => this.setResolution(value)}
        items={items}
      />
    );
  };

  renderError = () => (
    <TouchableWithoutFeedback onPress={this.reload}>
      <Text style={{ color: "#fff" }}>خطا، تلاش مجدد</Text>
    </TouchableWithoutFeedback>
  );

  /**
   * converts second to human readable format as hh:mm:ss
   */
  secondToTime = (allseconds: number) => {
    const hour = Math.floor(allseconds / 3600);
    const residual_from_hour = allseconds % 3600;

    let minute = Math.floor(residual_from_hour / 60);
    let second = Math.floor(residual_from_hour % 60);

    minute = `${minute}`.padStart(2, "0");
    second = `${second}`.padStart(2, "0");

    let output = `${minute}:${second}`;
    hour && (output = `${hour}${output}`);
    return output;
  };

  slidingComplete = value => {
    const { playState } = this.state;
    this.player.seek(value);
    if (playState === PLAYING) {
      this.hide_controls_with_timeout();
    }
  };

  slidingStart = () => {
    clearTimeout(this.timeout);
  };

  setMenuRef = (name, ref) => {
    this._menu[name] = ref;
  };

  hideMenu = name => {
    this._menu[name].hide();
  };

  showMenu = name => {
    this._menu[name].show();
  };

  setResolution = value => {
    this.setState({ selectedVideoTrackHeight: value });
  };

  setSub = item => {
    this.setState({ currentSub: item.title });
  };

  cleanName = name => {
    if (!name) {
      return "";
    }
    const name_splitted = name.split(/:(.+)/, 2);
    const out = name_splitted[name_splitted.length - 1];
    return out;
  };

  handleOnLoad = payload => {
    const { textTracks, videoTracks } = payload;
    const resolutions = videoTracks.map(i => i.height);
    // resolutions.unshift(0);

    this.setState({ resolutions, subtitles: textTracks, playState: PLAYING });
    this.hide_controls_with_timeout();
  };

  handleLoadStart = () => {
    clearTimeout(this.timeout);
    this.showControlsAnimation.start();
    this.setState({ playState: LOADING });
  };

  handleError = () => {
    clearTimeout(this.timeout);
    this.showControlsAnimation.start();
    this.setState({ playState: ERROR });
  };

  play = () => {
    this.hide_controls_with_timeout();
    // this.animation.play(0, 33);
    this.playpause.setValue(0);
    Animated.timing(this.playpause, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true
    }).start();
    this.setState({ playState: PLAYING });
  };

  pause = () => {
    clearTimeout(this.timeout);
    this.playpause.setValue(0.5);
    Animated.timing(this.playpause, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    this.setState({ playState: PAUSED });
  };

  changePlaybackState = () => {
    const { playState } = this.state;
    if (playState === PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  };

  setFullScreen = value => {
    this.setState({
      fullscreen: value
    });
  };

  reload = () => {
    this.setState({ show_video: false }, () => {
      setTimeout(() => {
        this.setState({ show_video: true });
      }, 16);
    });
  };

  toggleFullScreen = () => {
    const { fullscreen } = this.state;
    if (fullscreen) {
      Orientation.lockToPortrait();
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToLandscape();
    }
  };

  toggleControls = () => {
    const { controls_hidden, playState } = this.state;
    if (controls_hidden) {
      this.hideControlsAnimation.stop();
      this.showControlsAnimation.start();
      playState === PLAYING && this.hide_controls_with_timeout();
    } else if (playState === PLAYING) {
      this.showControlsAnimation.stop();
      this.hideControlsAnimation.start();
      clearTimeout(this.timeout);
    }
    this.setState({ controls_hidden: !controls_hidden });
  };

  hide_controls_with_timeout = () => {
    // const { playState } = this.state;
    this.timeout = setTimeout(() => {
      this.setState({ controls_hidden: true });
      this.hideControlsAnimation.start();
    }, 5000);
  };

  onEnd = () => {
    this.player.seek(0);
    this.showControlsAnimation.start();
    this.setState({ playState: PAUSED });
  };

  render() {
    const {
      style,
      videoStyle,
      bottom,
      renderPlayPause,
      renderTopRight,
      renderTopLeft,
      renderLoading,
      renderError,
      ...rest
    } = this.props;
    const {
      fullscreen,
      selectedVideoTrackHeight,
      currentTime,
      seekableDuration,
      onProgress,
      source,
      playState,
      show_video,
      currentSub
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            { backgroundColor: "#000" },
            fullscreen ? StyleSheet.absoluteFillObject : style
          ]}
        >
          {show_video && (
            <Video
              ref={ref => {
                this.player = ref;
              }}
              onProgress={({
                currentTime: currenttime,
                playableDuration,
                seekableDuration: seekableduration
              }) => {
                onProgress &&
                  onProgress({
                    currentTime: currenttime,
                    playableDuration,
                    seekableDuration: seekableduration
                  });
                this.setState({
                  currentTime: currenttime,
                  seekableDuration: seekableduration
                });
                this.currentTime.setValue(currenttime);
                this.playableDuration.setValue(playableDuration);
                this.seekableDuration.setValue(seekableduration);
              }}
              {...rest}
              source={source}
              style={fullscreen ? StyleSheet.absoluteFillObject : videoStyle}
              selectedVideoTrack={{
                type: selectedVideoTrackHeight ? "resolution" : "auto",
                value: selectedVideoTrackHeight
              }}
              selectedTextTrack={{
                type: currentSub ? "title" : "disabled",
                value: currentSub
              }}
              onLoad={this.handleOnLoad}
              onLoadStart={this.handleLoadStart}
              paused={playState !== PLAYING}
              fullscreen={fullscreen}
              onEnd={this.onEnd}
              onError={this.handleError}
            />
          )}
          <TouchableWithoutFeedback
            style={StyleSheet.absoluteFill}
            onPress={() => this.toggleControls()}
          >
            <View style={[StyleSheet.absoluteFillObject]} />
          </TouchableWithoutFeedback>
          <View style={StyleSheet.absoluteFillObject}>
            <View
              style={{
                flex: 1,
                justifyContent: "space-between"
              }}
            >
              <Animated.View
                key="top"
                style={{
                  opacity: this.show_controls_progress,
                  transform: [{ translateY: this.topbar_translate }],
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <ImageBackground
                  source={require("./assets/top-vignette.png")}
                  resizeMode="stretch"
                  style={[
                    {
                      opacity: 1,
                      height: 50,
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between"
                    },
                    {}
                  ]}
                >
                  <View style={styles.topCorner}>
                    {renderTopRight
                      ? renderTopRight(this.state)
                      : this.renderTopRight(this.state)}
                  </View>
                  <View style={styles.topCorner}>
                    {renderTopLeft
                      ? renderTopLeft(this.state)
                      : this.renderTopLeft(this.state)}
                  </View>
                </ImageBackground>
              </Animated.View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly"
                }}
              >
                <View>
                  <Animated.View
                    style={{
                      opacity: this.show_controls_progress,
                      transform: [{ translateY: this.translate_play }]
                    }}
                  >
                    {playState === LOADING ? (
                      renderLoading()
                    ) : playState === PLAYING || playState === PAUSED ? (
                      <TouchableWithoutFeedback
                        onPress={this.changePlaybackState}
                      >
                        <View>{renderPlayPause(this.playpause)}</View>
                      </TouchableWithoutFeedback>
                    ) : playState === ERROR && renderError ? (
                      renderError()
                    ) : (
                      this.renderError()
                    )}
                  </Animated.View>
                </View>
              </View>
              <Animated.View
                style={{
                  opacity: this.show_controls_progress,
                  transform: [{ translateY: this.seekbar_translate }]
                }}
              >
                <ImageBackground
                  source={require("./assets/bottom-vignette.png")}
                  resizeMode="stretch"
                  style={{
                    opacity: 1,
                    height: 50,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.time}>
                    {this.secondToTime(currentTime)}
                  </Text>
                  <Slider
                    style={{ flex: 1 }}
                    minimumTrackTintColor="#fff"
                    thumbTintColor="#fff"
                    ballon={value => {
                      return this.secondToTime(value);
                    }}
                    progress={this.currentTime}
                    min={new Reanimated.Value(0)}
                    cache={this.playableDuration}
                    max={this.seekableDuration}
                    onSlidingStart={this.slidingStart}
                    onSlidingComplete={this.slidingComplete}
                  />
                  <Text style={styles.time}>
                    {this.secondToTime(seekableDuration)}
                  </Text>
                  <TouchableWithoutFeedback onPress={this.toggleFullScreen}>
                    <Icon
                      style={{ padding: 5 }}
                      name={fullscreen ? "fullscreen-exit" : "fullscreen"}
                      size={20}
                      color="#fff"
                    />
                  </TouchableWithoutFeedback>
                </ImageBackground>
              </Animated.View>
            </View>
          </View>
        </View>

        {bottom && bottom(this.state, this.currentTime)}
      </View>
    );
  }
}

export default VideoPlayer;
