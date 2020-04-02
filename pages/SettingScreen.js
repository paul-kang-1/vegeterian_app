import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
  ToastAndroid
} from "react-native";
import firebase from "firebase";
import Constants from "expo-constants";

const SettingScreen = ({ route, navigation }) => {
  const [backClickCount, setBackClickCount] = useState(0);

  const user = firebase.auth().currentUser;
  const photoUrl = user.photoURL;
  const name = user.displayName;

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [backClickCount]);

  backButtonEffect = () => {
    if (navigation.isFocused()) {
      ToastAndroid.show("Press Back again to Exit", ToastAndroid.SHORT);
      setBackClickCount(1);
      console.log(backClickCount);
      setTimeout(function() {
        setBackClickCount(0);
      }, 1000);
    } else {
      console.log("go Back");
      navigation.pop();
    }
  };

  const handleBackButton = () => {
    console.log(`backclick: ${backClickCount}`);
    backClickCount == 1 ? BackHandler.exitApp() : backButtonEffect();
    return true;
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => console.log(navigation.isFocused())}
      >
        <Image
          source={require("../assets/icons/button_edit.png")}
          style={styles.editIcon}
          resizeMode="contain"
        />
      </TouchableWithoutFeedback>
      <View style={styles.topContainer}>
        <Image style={styles.thumbnail} source={{ uri: photoUrl }} />
        <Text style={styles.userName} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};
export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
    marginTop: Constants.statusBarHeight
  },
  thumbnail: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderColor: "#FF4D12",
    borderWidth: 2
  },
  topContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 30,
    paddingHorizontal: 30,
    width: "100%"
  },
  userName: {
    alignSelf: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 20,
    marginLeft: 10
  },
  divider: {
    width: "90%",
    backgroundColor: "#ADADAD",
    height: 1.5,
    marginVertical: 20
  },
  editIcon: {
    width: 50,
    height: 30,
    position: "absolute",
    top: 20,
    right: 25
  }
});
