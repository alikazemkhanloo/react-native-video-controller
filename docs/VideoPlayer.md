`VideoPlayer` (component)
=========================

The main component to play video with default configs.

## Usage
```js
import VideoPlayer from "react-native-video-controller";
render(){
  return(
   <VideoPlayer
     source={{ uri: source }} // Can be a URL or a local file.
     ref={ref => {
       this.videoplayer= ref;
     }} // Store reference
     style={[styles.videoContainerStyle, { overflow: "hidden" }]}
     videoStyle={styles.videoStyle}
     // style={styles.backgroundVideo}
     resizeMode="contain"
     // controls={fullScreen}
     bottom={this.bottom} />
  )
}

```

*Note:* the prop `bottom` and `renderTop*` should be a function that
gets the state of the component as argument and returns a react component


```jsx
type State = {
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
```
where playing state is a constant string that can be imported like:

```js
import { PlayState } from "react-native-video-controller";
...
if( this.state.playState === PlayState.PAUSED){
 console.log('the video is paused! ')
}

```


To access the underlying player's methods use `player` attribute, ie:
```
this.videoplayer.player.seek(100)
```

Props
-----

### `bottom` (required)



### `forwardRippleComponent` (required)

component inside the forward ripple



### `onProgress` (required)

function called when the internal Video component's
onProgress is called



### `onSwipeLeftHalf` (required)

on swipe in left side of the screen



### `onSwipeRightHalf` (required)

on swipe in right side of the screen



### `renderError` (required)

render component for error



### `renderLoading`

render component for loading

defaultValue: `() => <Loading />`


### `renderPlayPause`

render a custom play/pause component. the argument is an AnimatedValue that will be animated from 0 to 0.5 when translating
from PAUSE to PLAY, and from 0.5 to 1 when translating from PLAY to PAUSE. this way is useful if you want to
animate different parts of a lottie animation for play/pause. also you can interpolate the value to get a monotonic value from
PLAY to PAUSE.

defaultValue: `(progress: typeof Animated.Value) => (
  <PlayPause progress={progress} />
)`


### `renderTopLeft` (required)

render component for the top left



### `renderTopRight` (required)

render component for the top right



### `rewindRippleComponent` (required)

component inside the rewind ripple



### `rippleColor` (required)

color of the ripple when double tapped on either side
of the video, default  '#5555'



### `source` (required)

video source to play, will be passed to react-native-video


