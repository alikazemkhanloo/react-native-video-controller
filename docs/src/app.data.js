module.exports = [
  {"filepath":"..\\readme.md","title":"readme","description":"","link":"readme","data":"## react-native-video-controller","type":"md","dependencies":[]},{"type":"separator"},{"filepath":"..\\src\\VideoPlayer.js","title":"VideoPlayer","description":"The main component to play video with default configs.\r\n\r\n## Usage\r\n```js\r\nimport VideoPlayer from \"react-native-video-controller\";\r\nrender(){\r\n  return(\r\n   <VideoPlayer\r\n     source={{ uri: source }} // Can be a URL or a local file.\r\n     ref={ref => {\r\n       this.player = ref;\r\n     }} // Store reference\r\n     style={[styles.videoContainerStyle, { overflow: \"hidden\" }]}\r\n     videoStyle={styles.videoStyle}\r\n     // style={styles.backgroundVideo}\r\n     resizeMode=\"contain\"\r\n     // controls={fullScreen}\r\n     bottom={this.bottom} />\r\n  )\r\n}\r\n\r\n```\r\n\r\n*Note:* the prop `bottom` and `renderTop*` should be a function that\r\ngets the state of the component as argument and returns a react component\r\n\r\n\r\n```jsx\r\ntype State = {\r\nsource: { uri: string },\r\ncontrols_hidden: boolean,\r\ncurrentTime: number,\r\nseekableDuration: number,\r\nshow_video: boolean,\r\nplayState: PLAYING | PAUSED | LOADING | ERROR,\r\nresolutions: Array<number>,\r\npaused: boolean,\r\nfullscreen: boolean,\r\nsubtitles: Array<any>,\r\ncurrentSub: string,\r\nselectedVideoTrackHeight: number\r\n};\r\n```\r\nwhere playing state is a constant string that can be imported like:\r\n\r\n```js\r\nimport { PlayState } from \"react-native-video-controller\";\r\n...\r\nif( this.state.playState === PlayState.PAUSED){\r\n console.log('the video is paused! ')\r\n}\r\n\r\n```","link":"video-player","data":{"description":"The main component to play video with default configs.\r\n\r\n## Usage\r\n```js\r\nimport VideoPlayer from \"react-native-video-controller\";\r\nrender(){\r\n  return(\r\n   <VideoPlayer\r\n     source={{ uri: source }} // Can be a URL or a local file.\r\n     ref={ref => {\r\n       this.player = ref;\r\n     }} // Store reference\r\n     style={[styles.videoContainerStyle, { overflow: \"hidden\" }]}\r\n     videoStyle={styles.videoStyle}\r\n     // style={styles.backgroundVideo}\r\n     resizeMode=\"contain\"\r\n     // controls={fullScreen}\r\n     bottom={this.bottom} />\r\n  )\r\n}\r\n\r\n```\r\n\r\n*Note:* the prop `bottom` and `renderTop*` should be a function that\r\ngets the state of the component as argument and returns a react component\r\n\r\n\r\n```jsx\r\ntype State = {\r\nsource: { uri: string },\r\ncontrols_hidden: boolean,\r\ncurrentTime: number,\r\nseekableDuration: number,\r\nshow_video: boolean,\r\nplayState: PLAYING | PAUSED | LOADING | ERROR,\r\nresolutions: Array<number>,\r\npaused: boolean,\r\nfullscreen: boolean,\r\nsubtitles: Array<any>,\r\ncurrentSub: string,\r\nselectedVideoTrackHeight: number\r\n};\r\n```\r\nwhere playing state is a constant string that can be imported like:\r\n\r\n```js\r\nimport { PlayState } from \"react-native-video-controller\";\r\n...\r\nif( this.state.playState === PlayState.PAUSED){\r\n console.log('the video is paused! ')\r\n}\r\n\r\n```","displayName":"VideoPlayer","methods":[{"name":"secondToTime","docblock":"converts second to human readable format as hh:mm:ss\r\n@param seconds number of second to convert\r\n@returns a human readable format of the time","modifiers":["static"],"params":[{"name":"seconds","description":"number of second to convert","type":{"name":"number"},"optional":false}],"returns":{"description":"a human readable format of the time","type":{"name":"string"}},"description":"converts second to human readable format as hh:mm:ss"},{"name":"_orientationDidChange","docblock":null,"modifiers":[],"params":[{"name":"orientation","type":null}],"returns":null},{"name":"_renderTopRight","docblock":null,"modifiers":[],"params":[{"name":"{ subtitles }","type":null}],"returns":null},{"name":"_renderTopLeft","docblock":null,"modifiers":[],"params":[{"name":"{ resolutions }","type":null}],"returns":null},{"name":"_renderError","docblock":null,"modifiers":[],"params":[],"returns":null},{"name":"_slidingComplete","docblock":null,"modifiers":[],"params":[{"name":"value","type":null}],"returns":null},{"name":"_slidingStart","docblock":null,"modifiers":[],"params":[],"returns":null},{"name":"setResolution","docblock":"changes the current resolution of the video","modifiers":[],"params":[{"name":"height","type":{"name":"number"}}],"returns":null,"description":"changes the current resolution of the video"},{"name":"setSub","docblock":"changes the current subtitle","modifiers":[],"params":[{"name":"subtitle"}],"returns":null,"description":"changes the current subtitle"},{"name":"_handleOnLoad","docblock":null,"modifiers":[],"params":[{"name":"payload","type":null}],"returns":null},{"name":"_handleLoadStart","docblock":null,"modifiers":[],"params":[],"returns":null},{"name":"_handleError","docblock":null,"modifiers":[],"params":[],"returns":null},{"name":"play","docblock":"play the video","modifiers":[],"params":[],"returns":null,"description":"play the video"},{"name":"pause","docblock":"pause the video","modifiers":[],"params":[],"returns":null,"description":"pause the video"},{"name":"togglePlayback","docblock":"toggle palyback state","modifiers":[],"params":[],"returns":null,"description":"toggle palyback state"},{"name":"_setFullScreen","docblock":null,"modifiers":[],"params":[{"name":"value","type":null}],"returns":null},{"name":"reload","docblock":"reload the video (for example in case of an error) this will actually rerender\r\nthe component.","modifiers":[],"params":[],"returns":null,"description":"reload the video (for example in case of an error) this will actually rerender\r\nthe component."},{"name":"toggleFullScreen","docblock":"toggles fullscreen mode.\r\nin full screen mode the `bottom` prop will be rendered over the player,\r\nand the player will positioned absolutely.","modifiers":[],"params":[],"returns":null,"description":"toggles fullscreen mode.\r\nin full screen mode the `bottom` prop will be rendered over the player,\r\nand the player will positioned absolutely."},{"name":"toggleControls","docblock":"toggle controls on the screen","modifiers":[],"params":[],"returns":null,"description":"toggle controls on the screen"},{"name":"hide_controls_with_timeout","docblock":"hide controls after 5s delay","modifiers":[],"params":[],"returns":null,"description":"hide controls after 5s delay"},{"name":"_onEnd","docblock":null,"modifiers":[],"params":[],"returns":null}],"statics":[],"props":{"source":{"required":true,"flowType":{"name":"any"},"description":"video source to play, will be passed to react-native-video"},"renderPlayPause":{"required":false,"flowType":{"name":"signature","type":"function","raw":"(typeof Animated.Value) => React.Node","signature":{"arguments":[{"name":"","type":{"name":"Animated.Value"}}],"return":{"name":"ReactNode","raw":"React.Node"}}},"description":"render a custom play/pause component","defaultValue":{"value":"(state: typeof Animated.Value) => (\r\n  <PlayPause state={state} />\r\n)","computed":false}},"renderTopRight":{"required":true,"flowType":{"name":"signature","type":"function","raw":"State => React.Node","signature":{"arguments":[{"name":"","type":{"name":"signature","type":"object","raw":"{\r\n  source: { uri: string },\r\n  controls_hidden: boolean,\r\n  currentTime: number,\r\n  seekableDuration: number,\r\n  show_video: boolean,\r\n  playState: PLAYING | PAUSED | LOADING | ERROR,\r\n  resolutions: Array<number>,\r\n  paused: boolean,\r\n  fullscreen: boolean,\r\n  subtitles: Array<any>,\r\n  currentSub: string,\r\n  selectedVideoTrackHeight: number\r\n}","signature":{"properties":[{"key":"source","value":{"name":"signature","type":"object","raw":"{ uri: string }","signature":{"properties":[{"key":"uri","value":{"name":"string","required":true}}]},"required":true}},{"key":"controls_hidden","value":{"name":"boolean","required":true}},{"key":"currentTime","value":{"name":"number","required":true}},{"key":"seekableDuration","value":{"name":"number","required":true}},{"key":"show_video","value":{"name":"boolean","required":true}},{"key":"playState","value":{"name":"union","raw":"PLAYING | PAUSED | LOADING | ERROR","elements":[{"name":"PLAYING"},{"name":"PAUSED"},{"name":"LOADING"},{"name":"ERROR"}],"required":true}},{"key":"resolutions","value":{"name":"Array","elements":[{"name":"number"}],"raw":"Array<number>","required":true}},{"key":"paused","value":{"name":"boolean","required":true}},{"key":"fullscreen","value":{"name":"boolean","required":true}},{"key":"subtitles","value":{"name":"Array","elements":[{"name":"any"}],"raw":"Array<any>","required":true}},{"key":"currentSub","value":{"name":"string","required":true}},{"key":"selectedVideoTrackHeight","value":{"name":"number","required":true}}]}}}],"return":{"name":"ReactNode","raw":"React.Node"}}},"description":"render component for the top right"},"renderTopLeft":{"required":true,"flowType":{"name":"signature","type":"function","raw":"State => React.Node","signature":{"arguments":[{"name":"","type":{"name":"signature","type":"object","raw":"{\r\n  source: { uri: string },\r\n  controls_hidden: boolean,\r\n  currentTime: number,\r\n  seekableDuration: number,\r\n  show_video: boolean,\r\n  playState: PLAYING | PAUSED | LOADING | ERROR,\r\n  resolutions: Array<number>,\r\n  paused: boolean,\r\n  fullscreen: boolean,\r\n  subtitles: Array<any>,\r\n  currentSub: string,\r\n  selectedVideoTrackHeight: number\r\n}","signature":{"properties":[{"key":"source","value":{"name":"signature","type":"object","raw":"{ uri: string }","signature":{"properties":[{"key":"uri","value":{"name":"string","required":true}}]},"required":true}},{"key":"controls_hidden","value":{"name":"boolean","required":true}},{"key":"currentTime","value":{"name":"number","required":true}},{"key":"seekableDuration","value":{"name":"number","required":true}},{"key":"show_video","value":{"name":"boolean","required":true}},{"key":"playState","value":{"name":"union","raw":"PLAYING | PAUSED | LOADING | ERROR","elements":[{"name":"PLAYING"},{"name":"PAUSED"},{"name":"LOADING"},{"name":"ERROR"}],"required":true}},{"key":"resolutions","value":{"name":"Array","elements":[{"name":"number"}],"raw":"Array<number>","required":true}},{"key":"paused","value":{"name":"boolean","required":true}},{"key":"fullscreen","value":{"name":"boolean","required":true}},{"key":"subtitles","value":{"name":"Array","elements":[{"name":"any"}],"raw":"Array<any>","required":true}},{"key":"currentSub","value":{"name":"string","required":true}},{"key":"selectedVideoTrackHeight","value":{"name":"number","required":true}}]}}}],"return":{"name":"ReactNode","raw":"React.Node"}}},"description":"render component for the top left"},"renderLoading":{"required":false,"flowType":{"name":"signature","type":"function","raw":"() => React.Node","signature":{"arguments":[],"return":{"name":"ReactNode","raw":"React.Node"}}},"description":"render component for loading","defaultValue":{"value":"() => <Loading />","computed":false}},"renderError":{"required":true,"flowType":{"name":"signature","type":"function","raw":"() => React.Node","signature":{"arguments":[],"return":{"name":"ReactNode","raw":"React.Node"}}},"description":"render component for error"},"bottom":{"required":true,"flowType":{"name":"signature","type":"function","raw":"State => React.Node","signature":{"arguments":[{"name":"","type":{"name":"signature","type":"object","raw":"{\r\n  source: { uri: string },\r\n  controls_hidden: boolean,\r\n  currentTime: number,\r\n  seekableDuration: number,\r\n  show_video: boolean,\r\n  playState: PLAYING | PAUSED | LOADING | ERROR,\r\n  resolutions: Array<number>,\r\n  paused: boolean,\r\n  fullscreen: boolean,\r\n  subtitles: Array<any>,\r\n  currentSub: string,\r\n  selectedVideoTrackHeight: number\r\n}","signature":{"properties":[{"key":"source","value":{"name":"signature","type":"object","raw":"{ uri: string }","signature":{"properties":[{"key":"uri","value":{"name":"string","required":true}}]},"required":true}},{"key":"controls_hidden","value":{"name":"boolean","required":true}},{"key":"currentTime","value":{"name":"number","required":true}},{"key":"seekableDuration","value":{"name":"number","required":true}},{"key":"show_video","value":{"name":"boolean","required":true}},{"key":"playState","value":{"name":"union","raw":"PLAYING | PAUSED | LOADING | ERROR","elements":[{"name":"PLAYING"},{"name":"PAUSED"},{"name":"LOADING"},{"name":"ERROR"}],"required":true}},{"key":"resolutions","value":{"name":"Array","elements":[{"name":"number"}],"raw":"Array<number>","required":true}},{"key":"paused","value":{"name":"boolean","required":true}},{"key":"fullscreen","value":{"name":"boolean","required":true}},{"key":"subtitles","value":{"name":"Array","elements":[{"name":"any"}],"raw":"Array<any>","required":true}},{"key":"currentSub","value":{"name":"string","required":true}},{"key":"selectedVideoTrackHeight","value":{"name":"number","required":true}}]}}}],"return":{"name":"ReactNode","raw":"React.Node"}}},"description":""}}},"type":"component","dependencies":["../src/VideoPlayer.js"]},{"filepath":"..\\src\\PlayPause.js","title":"PlayPause","description":"","link":"play-pause","data":{"description":"","methods":[],"statics":[]},"type":"component","dependencies":["../src/PlayPause.js"]},{"filepath":"..\\..\\react-native-reanimated-slider\\src\\Ballon.js","title":"Ballon","description":"","link":"ballon","data":{"description":"","displayName":"Ballon","methods":[{"name":"setText","docblock":null,"modifiers":[],"params":[{"name":"text","type":null}],"returns":null}],"statics":[],"props":{"color":{"required":false,"flowType":{"name":"string"},"description":"","defaultValue":{"value":"\"#f3f\"","computed":false}},"text":{"required":true,"flowType":{"name":"string"},"description":""}}},"type":"component","dependencies":["../../react-native-reanimated-slider/src/Ballon.js"],"group":"SeekBar"},{"filepath":"..\\..\\react-native-reanimated-slider\\src\\Slider.js","title":"Slider","description":"","link":"slider","data":{"description":"","displayName":"Slider","methods":[{"name":"onLayout","docblock":null,"modifiers":[],"params":[{"name":"{ nativeEvent }","type":null}],"returns":null},{"name":"renderBallon","docblock":null,"modifiers":[],"params":[{"name":"{ text }","type":null}],"returns":null}],"statics":[],"props":{"renderBallon":{"required":true,"flowType":{"name":"signature","type":"function","raw":"() => any","signature":{"arguments":[],"return":{"name":"any"}}},"description":"renders the ballon"},"minimumTrackTintColor":{"required":false,"flowType":{"name":"string"},"description":"","defaultValue":{"value":"\"#f3f\"","computed":false}},"maximumTrackTintColor":{"required":false,"flowType":{"name":"string"},"description":"","defaultValue":{"value":"\"transparent\"","computed":false}},"cacheTrackTintColor":{"required":false,"flowType":{"name":"string"},"description":"","defaultValue":{"value":"\"#777\"","computed":false}},"borderColor":{"defaultValue":{"value":"'#fff'","computed":false},"required":false}}},"type":"component","dependencies":["../../react-native-reanimated-slider/src/Slider.js"],"group":"SeekBar"}
]