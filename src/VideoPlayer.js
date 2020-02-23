/**
 * @flow
 */

import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  I18nManager,
  TouchableWithoutFeedback,
  Animated,
  BackHandler,
  Dimensions,
  ImageBackground
} from "react-native";
import Video from "react-native-video";
// import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Orientation from "react-native-orientation-locker";
import Reanimated, { Easing } from "react-native-reanimated";
import {
  TapGestureHandler,
  State as GState
} from "react-native-gesture-handler";
import Slider from "react-native-reanimated-slider";
import { PAUSED, PLAYING, LOADING, ERROR } from "./PlayState";
import PlayPause from "./PlayPause";
import Menu from "./Menu";
import Loading from "./Loading";

const {
  Value,
  set,
  cond,
  block,
  startClock,
  and,
  timing,
  clockRunning,
  event,
  interpolate,
  Clock,
  eq,
  stopClock,
  debug
} = Reanimated;

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

function getSmallAxis() {
  const { width, height } = Dimensions.get("screen");
  const s = width < height ? width : height;
  return s;
}

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 300,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest)
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]
    ),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug("stop clock", stopClock(clock))),
    // we made the block return the updated position
    state.position
  ]);
}

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
  /**
   * video source to play, will be passed to react-native-video
   */
  source: any,

  /**
   * render a custom play/pause component. the argument is an AnimatedValue that will be animated from 0 to 0.5 when translating
   * from PAUSE to PLAY, and from 0.5 to 1 when translating from PLAY to PAUSE. this way is useful if you want to
   * animate different parts of a lottie animation for play/pause. also you can interpolate the value to get a monotonic value from
   * PLAY to PAUSE.
   */
  renderPlayPause?: (typeof Animated.Value) => React.Node,

  /**
   * render component for the top right
   */
  renderTopRight: State => React.Node,

  /**
   * render component for the top left
   */
  renderTopLeft: State => React.Node,

  /**
   * render component for loading
   */
  renderLoading?: () => React.Node,

  /**
   * render component for error
   */
  renderError: () => React.Node,

  /**
   * function called when the internal Video component's
   * onProgress is called
   */
  onProgress: ({
    currentTime: number,
    playableDuration: number,
    seekableDuration: number
  }) => void,

  bottom: State => React.Node
};
/**
 * The main component to play video with default configs.
 *
 * ## Usage
 * ```js
 * import VideoPlayer from "react-native-video-controller";
 * render(){
 *   return(
 *    <VideoPlayer
 *      source={{ uri: source }} // Can be a URL or a local file.
 *      ref={ref => {
 *        this.videoplayer= ref;
 *      }} // Store reference
 *      style={[styles.videoContainerStyle, { overflow: "hidden" }]}
 *      videoStyle={styles.videoStyle}
 *      // style={styles.backgroundVideo}
 *      resizeMode="contain"
 *      // controls={fullScreen}
 *      bottom={this.bottom} />
 *   )
 * }
 *
 * ```
 *
 * *Note:* the prop `bottom` and `renderTop*` should be a function that
 * gets the state of the component as argument and returns a react component
 *
 *
 * ```jsx
 * type State = {
 * source: { uri: string },
 * controls_hidden: boolean,
 * currentTime: number,
 * seekableDuration: number,
 * show_video: boolean,
 * playState: PLAYING | PAUSED | LOADING | ERROR,
 * resolutions: Array<number>,
 * paused: boolean,
 * fullscreen: boolean,
 * subtitles: Array<any>,
 * currentSub: string,
 * selectedVideoTrackHeight: number
 * };
 * ```
 * where playing state is a constant string that can be imported like:
 *
 * ```js
 * import { PlayState } from "react-native-video-controller";
 * ...
 * if( this.state.playState === PlayState.PAUSED){
 *  console.log('the video is paused! ')
 * }
 *
 * ```
 *
 *
 * To access the underlying player's methods use `player` attribute, ie:
 * ```
 * this.videoplayer.player.seek(12)
 * ```
 *
 *
 *
 *
 *
 */
class VideoPlayer extends React.Component<Props, State> {
  _menu = {};

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.source !== state.source) {
      return {
        source: props.source
      };
    }
  }

  static defaultProps = {
    renderPlayPause: (progress: typeof Animated.Value) => (
      <PlayPause progress={progress} />
    ),
    renderLoading: () => <Loading />
  };

  /**
   * converts second to human readable format as hh:mm:ss
   * @param seconds number of second to convert
   * @returns a human readable format of the time
   */
  static secondToTime(seconds: number): string {
    const hour = Math.floor(seconds / 3600);
    const residual_from_hour = seconds % 3600;

    let minute = Math.floor(residual_from_hour / 60);
    let second = Math.floor(residual_from_hour % 60);

    minute = `${minute}`.padStart(2, "0");
    second = `${second}`.padStart(2, "0");

    let output = `${minute}:${second}`;
    hour && (output = `${hour}:${output}`);
    return output;
  }

  show_controls_progress = new Value(1);
  clock = new Clock();

  constructor(props) {
    super(props);
    // firebase.admob().openDebugMenu();
    const initialOrientation = Orientation.getInitialOrientation();
    this._doubleTapRightRef = React.createRef();
    this._doubleTapLeftRef = React.createRef();
    this.playpause = new Animated.Value(0.5);
    this.currentTime = new Reanimated.Value(0);
    this.playableDuration = new Reanimated.Value(0);
    this.seekableDuration = new Reanimated.Value(0);

    this.topbar_translate = interpolate(this.show_controls_progress, {
      inputRange: [0, 1],
      outputRange: [-50, 0]
    });
    this.seekbar_translate = interpolate(this.show_controls_progress, {
      inputRange: [0, 1],
      outputRange: [50, 0]
    });
    this.translate_play = interpolate(this.show_controls_progress, {
      inputRange: [0, 0.000001, 1],
      outputRange: [-99999999, 0, 0]
    });
    this.isControllVisible = new Value(1);
    // this.hideControlsAnimation = Animated.timing(this.show_controls_progress, {
    //   useNativeDriver: true,
    //   toValue: 0
    // });

    // this.showControlsAnimation = Animated.timing(this.show_controls_progress, {
    //   useNativeDriver: true,
    //   toValue: 1
    // });

    this.state = {
      source: props.source,
      controls_hidden: false,
      currentTime: 0,
      seekableDuration: 0,
      show_video: true,
      playState: LOADING,
      resolutions: [],
      paused: false,
      ratio: 9 / 16,
      fullscreen: initialOrientation === "LANDSCAPE",
      subtitles: [],
      currentSub: "خاموش",
      selectedVideoTrackHeight: 0
    };
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this._backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this._handleBackPress
    );
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
    Orientation.lockToPortrait();
    Orientation.unlockAllOrientations();
    this._backHandler.remove();
  }

  _handleBackPress = () => {
    const { fullscreen } = this.state;
    if (fullscreen) {
      this.toggleFullScreen();
      return true;
    }
    return false;
  };

  _orientationDidChange = orientation => {
    this._setFullScreen(
      ["LANDSCAPE-LEFT", "LANDSCAPE-RIGHT"].includes(orientation)
    );
  };

  _renderTopRight = ({ subtitles }) => {
    const filtered = subtitles.filter(i => !!i.language);
    const items = [{ title: "خاموش" }, ...filtered];
    return <Menu title="زیرنویس" onItemPress={this.setSub} items={items} />;
  };

  _renderTopLeft = ({ resolutions }) => {
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

  _renderError = () => (
    <TouchableWithoutFeedback onPress={this.reload}>
      <Text style={{ color: "#fff" }}>خطا، تلاش مجدد</Text>
    </TouchableWithoutFeedback>
  );

  _slidingComplete = value => {
    const { playState } = this.state;
    this.player.seek(value);
    if (playState === PLAYING) {
      this.hide_controls_with_timeout();
    }
  };

  _slidingStart = () => {
    clearTimeout(this.timeout);
  };

  /**
   * changes the current resolution of the video
   */
  setResolution = (height: number) => {
    this.setState({ selectedVideoTrackHeight: height });
  };

  /**
   * changes the current subtitle
   *
   */
  setSub = subtitle => {
    this.setState({ currentSub: subtitle.title });
  };

  _handleOnLoad = payload => {
    const { textTracks, videoTracks } = payload;
    const resolutions = videoTracks.map(i => i.height);
    // resolutions.unshift(0);

    this.setState({ resolutions, subtitles: textTracks, playState: PLAYING });
    this.hide_controls_with_timeout();
  };

  _handleLoadStart = () => {
    clearTimeout(this.timeout);
    // this.showControlsAnimation.start();
    this.setState({ playState: LOADING });
  };

  _handleError = () => {
    clearTimeout(this.timeout);
    // this.showControlsAnimation.start();
    this.setState({ playState: ERROR });
  };

  /**
   * play the video
   */
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

  /**
   * pause the video
   */
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

  /**
   * toggle palyback state
   */
  togglePlayback = () => {
    const { playState } = this.state;
    if (playState === PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  };

  _setFullScreen = value => {
    this.setState({
      fullscreen: value
    });
  };

  /**
   * reload the video (for example in case of an error) this will actually rerender
   * the component.
   */
  reload = () => {
    this.setState({ show_video: false }, () => {
      setTimeout(() => {
        this.setState({ show_video: true });
      }, 16);
    });
  };

  /**
   * toggles fullscreen mode.
   * in full screen mode the `bottom` prop will be rendered over the player,
   * and the player will positioned absolutely.
   *
   */
  toggleFullScreen = () => {
    const { fullscreen } = this.state;
    if (fullscreen) {
      Orientation.lockToPortrait();
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToLandscape();
    }
  };

  /**
   * toggle controls on the screen
   */
  toggleControls = () => {
    const { controls_hidden, playState } = this.state;
    if (controls_hidden) {
      // this.hideControlsAnimation.stop();
      // this.showControlsAnimation.start();
      playState === PLAYING && this.hide_controls_with_timeout();
    } else if (playState === PLAYING) {
      // this.showControlsAnimation.stop();
      // this.hideControlsAnimation.start();
      clearTimeout(this.timeout);
    }
    this.setState({ controls_hidden: !controls_hidden });
  };

  /**
   * hide controls after 5s delay
   */
  hide_controls_with_timeout = () => {
    // const { playState } = this.state;
    this.timeout = setTimeout(() => {
      this.setState({ controls_hidden: true });
      // this.hideControlsAnimation.start();
    }, 5000);
  };

  _onEnd = () => {
    this.player.seek(0);
    // this.showControlsAnimation.start();
    this.setState({ playState: PAUSED });
  };

  // _onSingleTap = ({

  // })

  // _onSingleTap = ({ nativeEvent }) => {
  //   console.log("n", nativeEvent);
  // };
  _onSingleTap = ({ nativeEvent }) => {
    console.log("asdf", nativeEvent);
    return block([
      debug("start", this.isControllVisible),
      cond(
        eq(nativeEvent.state, GState.ACTIVE),
        cond(
          eq(this.isControllVisible, 1),
          [
            set(this.isControllVisible, 0),
            set(
              this.show_controls_progress,
              runTiming(this.clock, this.show_controls_progress, 0)
            )
          ],
          [
            set(this.isControllVisible, 1),
            set(
              this.show_controls_progress,
              runTiming(this.clock, this.show_controls_progress, 1)
            )
          ]
        )
      )
    ]);
  };

  _onDoubleTapRight = event => {
    if (event.nativeEvent.state === GState.ACTIVE) {
      const { currentTime } = this.state;
      this.player.seek(currentTime + 10);
    }
  };

  _onDoubleTapLeft = event => {
    if (event.nativeEvent.state === GState.ACTIVE) {
      const { currentTime } = this.state;
      this.player.seek(currentTime - 10);
    }
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
      onProgress,
      ...rest
    } = this.props;
    const {
      fullscreen,
      selectedVideoTrackHeight,
      currentTime,
      seekableDuration,
      source,
      playState,
      show_video,
      ratio,
      currentSub
    } = this.state;
    const playerHeight = getSmallAxis() * ratio;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            { backgroundColor: "#000" },
            fullscreen
              ? StyleSheet.absoluteFillObject
              : [{ height: playerHeight }, style]
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
              style={
                fullscreen
                  ? StyleSheet.absoluteFillObject
                  : [{ height: playerHeight }, videoStyle]
              }
              selectedVideoTrack={{
                type: selectedVideoTrackHeight ? "resolution" : "auto",
                value: selectedVideoTrackHeight
              }}
              selectedTextTrack={{
                type: currentSub ? "title" : "disabled",
                value: currentSub
              }}
              onLoad={this._handleOnLoad}
              onLoadStart={this._handleLoadStart}
              paused={playState !== PLAYING}
              fullscreen={fullscreen}
              onEnd={this._onEnd}
              onError={this._handleError}
            />
          )}
          {/* <TouchableWithoutFeedback
            style={StyleSheet.absoluteFill}
            onPress={() => this.toggleControls()}
          > */}
          <View style={StyleSheet.absoluteFill}>
            <TapGestureHandler
              onHandlerStateChange={this._onSingleTap.bind(this)}
              waitFor={[this._doubleTapRightRef, this._doubleTapLeftRef]}
            >
              <Reanimated.View style={{ flex: 1, flexDirection: "row" }}>
                {/* <Reanimated.View stlye={{ flex: 1 }}> */}
                <TapGestureHandler
                  onHandlerStateChange={this._onDoubleTapRight}
                  ref={this._doubleTapRightRef}
                  numberOfTaps={2}
                >
                  <View style={{ height: "100%", flex: 1 }} />
                </TapGestureHandler>
                <View style={{ flex: 1 }} />
                <TapGestureHandler
                  onHandlerStateChange={this._onDoubleTapLeft}
                  ref={this._doubleTapLeftRef}
                  numberOfTaps={2}
                >
                  <View style={{ height: "100%", flex: 1 }} />
                </TapGestureHandler>
                {/* </Reanimated.View> */}
              </Reanimated.View>
            </TapGestureHandler>
          </View>
          {/* </TouchableWithoutFeedback> */}

          <View style={StyleSheet.absoluteFillObject}>
            <View
              style={{
                flex: 1,
                justifyContent: "space-between"
              }}
            >
              <Reanimated.View
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
                      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      justifyContent: "space-between"
                    },
                    {}
                  ]}
                >
                  <View style={styles.topCorner}>
                    {renderTopLeft
                      ? renderTopLeft(this.state)
                      : this._renderTopLeft(this.state)}
                  </View>
                  <View style={styles.topCorner}>
                    {renderTopRight
                      ? renderTopRight(this.state)
                      : this._renderTopRight(this.state)}
                  </View>
                </ImageBackground>
              </Reanimated.View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly"
                }}
              >
                <View>
                  <Reanimated.View
                    style={{
                      opacity: this.show_controls_progress,
                      transform: [{ translateY: this.translate_play }]
                    }}
                  >
                    {playState === LOADING ? (
                      renderLoading()
                    ) : playState === PLAYING || playState === PAUSED ? (
                      <TouchableWithoutFeedback onPress={this.togglePlayback}>
                        <View>{renderPlayPause(this.playpause)}</View>
                      </TouchableWithoutFeedback>
                    ) : playState === ERROR && renderError ? (
                      renderError()
                    ) : (
                      this._renderError()
                    )}
                  </Reanimated.View>
                </View>
              </View>
              <Reanimated.View
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
                    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.time}>
                    {VideoPlayer.secondToTime(currentTime)}
                  </Text>
                  <Slider
                    style={{ flex: 1, marginHorizontal: 5 }}
                    minimumTrackTintColor="#fff"
                    thumbTintColor="#fff"
                    ballon={value => {
                      return VideoPlayer.secondToTime(value);
                    }}
                    progress={this.currentTime}
                    min={new Reanimated.Value(0)}
                    cache={this.playableDuration}
                    max={this.seekableDuration}
                    onSlidingStart={this._slidingStart}
                    onSlidingComplete={this._slidingComplete}
                  />
                  <Text style={styles.time}>
                    {VideoPlayer.secondToTime(seekableDuration)}
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
              </Reanimated.View>
            </View>
          </View>
        </View>

        {bottom && bottom(this.state, this.currentTime)}
      </View>
    );
  }
}

export default VideoPlayer;
