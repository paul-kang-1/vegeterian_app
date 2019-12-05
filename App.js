import React, { useState, useEffect } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import HomeScreen from "./pages/HomeScreen";
import { createAppContainer } from "react-navigation";
import createAnimatedSwitchNavigator from "react-navigation-animated-switch";

const MySwitch = createAnimatedSwitchNavigator(
  {
    Loading: { screen: LoadingScreen },
    Home: { screen: HomeScreen }
  },
  { initialRouteName: "Loading" }
);

export default createAppContainer(MySwitch);
