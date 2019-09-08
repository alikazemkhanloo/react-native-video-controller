import React from "react";
import LottieView from "lottie-react-native";

export default ({ progress }) => {
  return (
    <LottieView
      style={{ width: 100, height: 100 }}
      loop={false}
      progress={progress}
      source={require("./assets/play-pause-white.json")}
    />
  );
};
