import React, {useRef} from "react";
import { Image } from "react-native";
import LoadingScreen from "./pages/LoadingScreen";
import HomeScreen from "./pages/HomeScreen";
import SearchScreen from "./pages/SearchScreen";
import SettingScreen from "./pages/SettingScreen";
import RestaurantScreen from "./pages/RestaurantScreen";
import ReviewScreen from "./pages/ReviewScreen";
import SignupScreen from "./pages/SignupScreen";
import { NavigationNativeContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeIcon from "./assets/icons/menutab_home.png";
import SearchIcon from "./assets/icons/menutab_search.png";
import SettingsIcon from "./assets/icons/menutab_settings.png";
import firebase from "firebase";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const LoadingStack = createStackNavigator();
const RestaurantStack = createStackNavigator();

const App = () => {
  console.log(firebase.auth().currentUser)
  return (
    <NavigationNativeContainer>
      <Stack.Navigator initialRouteName="Loading" headerMode="none">
        <Stack.Screen name="Loading" component={LoadingNavigator} />
        <Stack.Screen name="Home" component={HomeTabNavigator} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} />
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
    </LoadingStack.Navigator>
  );
};

const RestaurantNavigator = () => {

}
export default App;
