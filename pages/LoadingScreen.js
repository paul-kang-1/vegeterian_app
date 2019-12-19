import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import firebase, { googleProvider } from "../firebase";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import * as Font from "expo-font";

const LoadingScreen = ({ navigation }) => {
  const [showLogin, setLogin] = useState(false);
  const [toHomeScreen, setHomescreen] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      "AlegreyaSans-Regular": require("../assets/fonts/AlegreyaSans-Regular.ttf"),
      "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
      "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
      "El-Messiri-SemiBold": require("../assets/fonts/ElMessiri-SemiBold.ttf")
    });
    setLogin(true);
  };
  const signInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync("430112311029982");
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync("430112311029982", {
        permissions: ["public_profile", "email"]
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`
        );
        const responseJSON = JSON.stringify(await response.json());
        var obj = JSON.parse(responseJSON);
        console.log(obj);
        //setHomescreen(true);
        navigation.navigate("Home", { photoUrl: obj.picture.data.url });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      console.log(`Facebook 1 Error: ${message}`);
      alert(`first ${message}`);
    }
  };

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId === googleProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = googleUser => {
    //console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          const credential = googleProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function() {
              //setHomescreen(true);
              navigation.navigate("Home", {
                photoUrl: googleUser.user.photoUrl
              });
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      });
  };

  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "386677764344-4f2lfkvaupm96uih0rg1afr5qh4o1fb0.apps.googleusercontent.com",
        iosClientId:
          "386677764344-oeoovf93253f509banm2rgl32l54fkj0.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        onSignIn(result);
        //console.log(result.user.photoUrl)
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    loadFonts();
    console.disableYellowBox = true;
  }, []);

  const checkIfLoggedIn = () => {
    if (firebase.auth().currentUser != null) {
      //setHomescreen(true);
      console.log("The object is", firebase.auth().currentUser);
      navigation.navigate("Home");
    } else {
      setHomescreen(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image
          style={styles.backgroundImage}
          source={require("../assets/images/loading_bg.png")}
        />
      </View>
      <View style={styles.backgroundContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/images/app_title.png")}
        />
      </View>
      {showLogin ? (
        <React.Fragment>
          <View style={{ flex: 1 }} />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.loginText}>Start With:</Text>
            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={() => signInWithFacebook()}
            >
              <Image
                style={styles.LoginButton}
                resizeMode={"contain"}
                source={require("../assets/images/facebook_login.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={() => signInWithGoogleAsync()}
            >
              <Image
                style={styles.LoginButton}
                source={require("../assets/images/google_login.png")}
              />
            </TouchableOpacity>
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        </React.Fragment>
      )}
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  backgroundImage: {
    width: "100%",
    height: "100%"
  },
  logo: {
    alignSelf: "center",
    flex: 1,
    aspectRatio: 1 / 4,
    resizeMode: "contain"
  },
  LoginButton: {
    maxWidth: "100%",
    maxHeight: "auto",
    resizeMode: "contain"
  },
  loginText: {
    color: "white",
    //alignSelf: "center",
    marginTop: 30,
    marginBottom: 15,
    fontSize: 18,
    fontFamily: "AlegreyaSans-Regular"
  },
  loginButtonContainer: {
    maxWidth: "75%",
    maxHeight: "15%",
    justifyContent: "center",
    marginBottom: 15
  }
});
