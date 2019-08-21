import React from "react";
import LottieView from "lottie-react-native";

export default ({ state }) => {
  const progress = state.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });
  return (
    <LottieView
      style={{ width: 100, height: 100 }}
      loop={false}
      progress={state}
      source={require("./assets/play-pause-white.json")}
    />
  );
};
