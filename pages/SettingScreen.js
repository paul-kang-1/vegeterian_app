import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
  ToastAndroid,
} from "react-native";
import firebase from "firebase";
import Constants from "expo-constants";

const SettingScreen = ({ route, navigation }) => {
  const [backClickCount, setBackClickCount] = useState(0);
  const userDoc = firebase.firestore().collection("users").get();
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
      setTimeout(function () {
        setBackClickCount(0);
      }, 1000);
    } else {
      // console.log("go Back");
      navigation.pop();
    }
  };

  const handleBackButton = () => {
    // console.log(`backclick: ${backClickCount}`);
    backClickCount == 1 ? BackHandler.exitApp() : backButtonEffect();
    return true;
  };

  const signOutPress = () => {
    firebase
      .auth()
      .signOut()
      .then(() => navigation.navigate("Loading"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        {photoUrl === null ? (
          <View style={styles.thumbnail}></View>
        ) : (
          <Image style={styles.thumbnail} source={{ uri: photoUrl }} />
        )}
        <Text style={styles.userName} numberOfLines={1}>
          {name}
        </Text>
        <TouchableWithoutFeedback>
          <Image
            source={require("../assets/icons/button_edit.png")}
            style={styles.editIcon}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.divider} />
      <TouchableWithoutFeedback>
        <View
          style={{
            marginLeft: 25,
            flexDirection: "row",
            width: "95%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontFamily: "Roboto-Regular", fontSize: 18 }}>
            My Favourites
          </Text>
          <Image
            source={require("../assets/icons/button_favorite_toggled.png")}
            style={{ width: 25, height: 25, marginRight: 30 }}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.divider} />
      <TouchableWithoutFeedback>
        <View
          style={{
            marginLeft: 25,
            flexDirection: "row",
            width: "95%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontFamily: "Roboto-Regular", fontSize: 18 }}>
            My Reviews
          </Text>
          <Image
            source={require("../assets/icons/icon_comment.png")}
            style={{ width: 25, height: 25, marginRight: 30 }}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.divider} />
      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "90%",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ADADAD",
          paddingVertical: 15,
        }}
      >
        <TouchableWithoutFeedback onPress={() => signOutPress()}>
          <Text style={{ fontFamily: "Roboto-Regular", fontSize: 18 }}>
            Sign out
          </Text>
        </TouchableWithoutFeedback>
      </View>
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
    marginTop: Constants.statusBarHeight,
  },
  thumbnail: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderColor: "#FF4D12",
    borderWidth: 2,
  },
  topContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 30,
    paddingHorizontal: 20,
    width: "100%",
  },
  userName: {
    alignSelf: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 20,
    marginLeft: 10,
  },
  divider: {
    width: "90%",
    backgroundColor: "#ADADAD",
    height: 1,
    marginVertical: 20,
  },
  editIcon: {
    width: 50,
    height: 30,
    alignSelf: "center",
    marginLeft: "auto",
  },
});
