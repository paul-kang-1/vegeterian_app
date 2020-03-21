import React, { useState, useEffect, Fragment } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from "react-native";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import * as Font from "expo-font";
import "../firebase";
/**
 * Component for displaying the splashscreen / loginscreen
 * @component
 * @param {Object} navigation prop passed from navigator
 */
const LoadingScreen = ({ navigation }) => {
  /**
   * React hooks state variables to show/hide login UI
   * @type {[Boolean, Function]} Loading
   */
  const [showLogin, setLogin] = useState(false);
  /**
   * State variables for user textInput at login (email / password)
   * @type {[String, Function]} email
   * @type {[String, Function]} password
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /**
   * Loads the required fonts and skip Login if there already is a signed in user.
   * If user is not registered, show the login UI
   * @method
   * @return {void}
   */
  const loadFonts = async () => {
    await Font.loadAsync({
      "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
      "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
      "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
      "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
      "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf")
    });
    // Listens to any changes in authentication state.
    firebase.auth().onAuthStateChanged(user => {
      //console.log(user);
      checkIfLoggedIn();
    });
  };
  /**
   * Move to homescreen if the user exists. If not, show the login UI.
   * @method
   * @return {void}
   */
  const checkIfLoggedIn = () => {
    if (firebase.auth().currentUser != null) {
      navigation.navigate("Home");
    } else {
      setLogin(true);
    }
  };
  /**
   * @method
   * @return {void}
   */
  const signInWithFacebook = async () => {
    // Initialize FB login with the given APP ID
    Facebook.initializeAsync("199623754607347");
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      "199623754607347",
      {
        permissions: ["email", "public_profile"]
      }
    );
    if (type === "success") {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(function() {
          navigation.navigate("Home");
        })
        .catch(function(error) {
          /* 
          For cases where the user have already signed up through a different provider with
          the same e-mail. However, accounts with Gmail is an edge case, since Google provider
          holds a higher priority regardless of which provider the user selected at the sign-up phase.
          i.e., if the user signed up through Facebook with a Gmail address, the following error would
          not occur even if the user signs in through Google. Instead, it will overwrite the existing
          user provider information, thus throwing this error when the user attempts to sign out and 
          sign in through Facebook again. The account linking feature in SettingScreen may be a solution,
          since it keeps all the providers within the Firebase Auth database.
          */
          if (error.code == "auth/account-exists-with-different-credential") {
            Alert.alert(
              "Seems like you already have signed in with a different method.",
               "Please sign-in with a different option and add different sign-in options\
               in the app settings!"
            );
          }
        });
    }
  };
  /**
   * Given the current Firebase user, skip the Firebase sign-up procedure if there
   * already exists a user with the same provider uid.
   * @method
   * @param {Object} googleUser
   * @param {Object} firebaseUser
   */
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
  /**
   * @const {Object}
   */
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  /**
   * @method
   * @return {Object} 
   */
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
  /**
   * 
   * @method
   * @param {*} googleUser 
   */
  const onSignIn = googleUser => {
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
              navigation.navigate("Home");
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(`${errorCode} Error: ${errorMessage}`)
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      });
  };

  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/images/app_title.png")}
          resizeMode="contain"
        />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1, alignSelf: "center", width: "100%" }}
        behavior="padding"
        enabled
      >
        {showLogin ? (
          <Fragment>
            <View>
              <TextInput
                style={styles.loginTextField}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                }}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={true}
              />
              <TextInput
                style={styles.loginTextField}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                }}
                placeholder="Password"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.loginButton}>
                <Text
                  style={styles.loginText}
                  onPress={() => console.log("hi")}
                >
                  Login
                </Text>
              </View>
              <Text style={styles.otherText}>Or login with:</Text>
              <View style={{ flexDirection: "row", marginHorizontal: 25 }}>
                <TouchableWithoutFeedback onPress={() => signInWithFacebook()}>
                  <View style={styles.otherLogin}>
                    <Image
                      source={require("../assets/images/facebook_login.png")}
                      style={{
                        height: "100%",
                        width: 40,
                        backgroundColor: "#2553B4",
                        alignSelf: "center"
                      }}
                      resizeMode="contain"
                    />
                    <Text style={styles.snsText}>facebook</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => signInWithGoogleAsync()}
                >
                  <View style={styles.otherLogin}>
                    <Image
                      source={require("../assets/images/google_login.png")}
                      style={{
                        height: "80%",
                        width: 40,
                        alignSelf: "center"
                      }}
                      resizeMode="contain"
                    />
                    <Text style={styles.snsText}>google</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  marginTop: 10
                }}
              >
                <Text
                  style={[
                    styles.otherText,
                    styles.underline,
                    {
                      borderRightWidth: 1,
                      borderRightColor: "#ADADAD",
                      paddingRight: 10
                    }
                  ]}
                >
                  Sign up!
                </Text>
                <Text
                  style={[
                    styles.otherText,
                    styles.underline,
                    { paddingLeft: 10 }
                  ]}
                >
                  Forgot Password?
                </Text>
              </View>
            </View>
          </Fragment>
        ) : (
          <Fragment>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          </Fragment>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  underline: { textDecorationLine: "underline" },
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  logoContainer: { flex: 0.75, justifyContent: "flex-end", marginBottom: 50 },
  logo: {
    paddingBottom: 30,
    width: 220,
    height: 220,
    alignSelf: "center"
  },
  loginTextField: {
    width: "85%",
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ADADAD",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
    fontFamily: "Roboto-Light"
  },
  loginButton: {
    width: "85%",
    height: 45,
    backgroundColor: "#FF4D12",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25
  },
  loginText: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "white"
  },
  otherLogin: {
    flex: 1,
    flexDirection: "row",
    height: 45,
    borderWidth: 2,
    borderColor: "#ADADAD",
    marginVertical: 10,
    marginHorizontal: 5,
    justifyContent: "flex-start"
  },
  otherText: {
    alignSelf: "center",
    fontFamily: "Roboto-Light",
    color: "#ADADAD"
  },
  snsText: {
    alignSelf: "center",
    fontFamily: "Roboto-Medium",
    color: "#ADADAD",
    marginLeft: 25
  }
});
