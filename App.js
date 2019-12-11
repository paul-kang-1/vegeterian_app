import React, { useState, useEffect } from "react";
import LoadingScreen from "./pages/LoadingScreen";
import HomeScreen from "./pages/HomeScreen";
import { NavigationNativeContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        headerMode="none"
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};
export default App;
