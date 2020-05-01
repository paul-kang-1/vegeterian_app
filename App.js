import React, { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";
import LoadingScreen from "./pages/LoadingScreen";
import HomeScreen from "./pages/HomeScreen";
import SearchScreen from "./pages/SearchScreen";
import SettingScreen from "./pages/SettingScreen";
import RestaurantScreen from "./pages/RestaurantScreen";
import ReviewScreen from "./pages/ReviewScreen";
import ImageBrowserScreen from "./pages/ImageBrowserScreen";
import SignupScreen from "./pages/SignupScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen"
import Terms from "./pages/Terms"
import { NavigationNativeContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeIcon from "./assets/icons/menutab_home.png";
import SearchIcon from "./assets/icons/menutab_search.png";
import SettingsIcon from "./assets/icons/menutab_settings.png";
import firebase from "firebase";
import * as Font from "expo-font";

import "./firebase";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const LoadingStack = createStackNavigator();
const RestaurantStack = createStackNavigator();

const App = () => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFonts();
    // Listens to any changes in authentication state.
    firebase.auth().onAuthStateChanged(user => {
      // console.log(user);
      checkIfLoggedIn();
    });
  }, []);
  const loadFonts = async () => {
    await Font.loadAsync({
      "OpenSans-SemiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
      "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
      "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
      "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
      "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
      "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
      "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf")
    });
    setTimeout(()=>setLoading(false), 1500)
  };
  const checkIfLoggedIn = () => {
    if (firebase.auth().currentUser == null) {
      console.log(null)
    } else {
      console.log("good to go");
      setLogin(true);
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image source={require('./assets/images/splashscreen_example.png')}/>
      </View>
    );
  }
  return (
    <NavigationNativeContainer>
      <Stack.Navigator headerMode="none">
        {!login ? <Stack.Screen name="Loading" component={LoadingNavigator} />:(
        <Stack.Screen name="Home" component={HomeTabNavigator, RestaurantNavigator} />
        )}
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          var icon;
          if (route.name == "Home") {
            icon = HomeIcon;
          } else if (route.name == "Search") {
            icon = SearchIcon;
          } else if (route.name == "Settings") {
            icon = SettingsIcon;
          }
          return (
            <Image
              source={icon}
              style={{
                tintColor: color,
                height: 24,
                width: 18.9
              }}
            />
          );
        }
      })}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: "#FF4D12",
        inactiveTintColor: "#FFE2D9"
      }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

const LoadingNavigator = () => {
  return (
    <LoadingStack.Navigator headerMode="none">
      <LoadingStack.Screen name="Loading" component={LoadingScreen} />
      <LoadingStack.Screen name="Signup" component={SignupScreen} />
      <LoadingStack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <LoadingStack.Screen name="Terms" component={Terms}/>
    </LoadingStack.Navigator>
  );
};

const RestaurantNavigator = () => {
  return (
    <RestaurantStack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={HomeTabNavigator} />
      <Stack.Screen name="Restaurant" component={RestaurantScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="ImageBrowser" component={ImageBrowserScreen} />
    </RestaurantStack.Navigator>
  );
};
export default App;
