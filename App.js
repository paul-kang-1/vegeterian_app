import React, { useState, useEffect } from 'react';
import LoadingScreen from "./pages/LoadingScreen";
import HomeScreen from "./pages/HomeScreen";
import * as Font from 'expo-font';
import { createAnimatedSwitchNavigator } from "react-navigation-animated-switch";

const MySwitch = createAnimatedSwitchNavigator({
  Home: {screen: HomeScreen},
  Loading: {screen: LoadingScreen}
});

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const loadFonts = async () => {
    await Font.loadAsync({
      "AlegreyaSans-Regular": require("./assets/fonts/AlegreyaSans-Regular.ttf"),
      "OpenSans-SemiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
      "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
      "El-Messiri-SemiBold": require("./assets/fonts/ElMessiri-SemiBold.ttf")
    });
    setLoading(false)
  }
  useEffect(() => {
    loadFonts()
  }, [])
  return <LoadingScreen showLogin = {!isLoading} />
}

export default App;