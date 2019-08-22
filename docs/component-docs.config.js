// import path from "path";

module.exports = {
  port: 1234,
  pages: [
    {
      type: "md",
      file: "../readme.md"
    },
    { type: "separator" },

    { type: "component", file: "../src/VideoPlayer.js" },
    { type: "component", file: "../src/PlayPause.js" },
    // { type: "component", file: "../src/Menu.js" },
    {
      type: "component",
      file: "../../react-native-reanimated-slider/src/Ballon.js",
      group: "SeekBar"
    },
    {
      type: "component",
      file: "../../react-native-reanimated-slider/src/Slider.js",
      group: "SeekBar"
    }
  ],
  output: "./src"
};