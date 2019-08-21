import React from "react";
import LottieView from "lottie-react-native";

export default () => (
  <LottieView
    style={{ width: 100, height: 100 }}
    // ref={animation => {
    //   this.animation = animation;
    // }}
    autoPlay
    loop
    speed={1}
    source={require("./assets/loading.json")}
  />
);
