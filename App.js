import React, { useState, useEffect } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import HomeScreen from "./pages/HomeScreen";
import { createAppContainer } from "react-navigation";
import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
import { Transition } from "react-native-reanimated";

const MySwitch = createAnimatedSwitchNavigator(
  {
    Loading: { screen: LoadingScreen },
    Home: { screen: HomeScreen }
  },
  {
    // The previous screen will slide to the bottom while the next screen will fade in
    transition: (
      <Transition.Together>
        <Transition.Out
          type= "slide-left"
          durationMs={200}
          interpolation= "easeOut"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    )
  },
  { initialRouteName: "Loading" }
);

export default createAppContainer(MySwitch);
