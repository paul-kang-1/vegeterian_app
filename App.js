import React, { useState, useEffect } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import SelectionScreen from "./pages/SelectionScreen";
import * as Font from "expo-font";
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from "./pages/HomeScreen";

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const loadFonts = async () => {
    await Font.loadAsync({
      "AlegreyaSans-Regular": require("./assets/fonts/AlegreyaSans-Regular.ttf"),
      "OpenSans-SemiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
      "El-Messiri-SemiBold": require("./assets/fonts/ElMessiri-SemiBold.ttf")
    });
    setLoading(false);
  };
  useEffect(() => {
    loadFonts();
  }, []);
  //return <LoadingScreen showLogin = {!isLoading} />
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};

export default App;