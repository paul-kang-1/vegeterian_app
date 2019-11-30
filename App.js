import React, { useState, useEffect } from 'react';
import LoadingScreen from "./pages/LoadingScreen";
import * as Font from 'expo-font';

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