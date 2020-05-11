import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import Input from "./Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import firebase from "firebase";

const SignupScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwValidate, setPWValidate] = useState([, ,]);
  const [pwConfirm, setPWConfirm] = useState("");
  const [isUserNameValid, setUserNameValid] = useState(false);
  const [isEmailValid, setEmailValid] = useState(false);
  const { notification } = route.params;

  const userNameMsg = [
    "Good to Go!",
    "Invalid username (3-15 chars incl. underscore)",
  ];
  const emailMsg = ["Good to Go!", "Invalid Email. Try Again!"];
  const pwConfirmMsg = ["Matching Password!", "Check your password again!"];

  function checkValidity(target, isValid, msgArray) {
    if (target === "") return;
    else {
      return isValid ? (
        <Text
          style={{
            fontFamily: "Roboto-Light",
            fontSize: 13,
            color: "green",
          }}
        >
          ✔️ {msgArray[0]}
        </Text>
      ) : (
        <Text
          style={{
            fontFamily: "Roboto-Light",
            fontSize: 13,
            color: "red",
          }}
        >
          ❌ {msgArray[1]}
        </Text>
      );
    }
  }

  function checkFields() {
    var pw = password === pwConfirm;
    var pwv = pwValidate.every((e) => e);
    //console.log(isUserNameValid, isEmailValid, pw, pwValidate);
    return isUserNameValid && isEmailValid && pw && pwv;
  }

  function addUser(userName, email, password) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        var user = result.user;
        user.updateProfile({
          displayName: userName,
          photoURL: null,
        });
        createUserDoc(user, userName);
        return user;
      })
      .then((user) => user.sendEmailVerification())
      .then(() =>{
        navigation.navigate("Loading")
        Alert.alert(
          "Verify Your E-mail!",
          "An email has been sent to your registered address for verification. Please verify your email before you sign in!"
        )}
      )
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        Alert.alert(errorCode, errorMessage);
      });
  }

  function createUserDoc(user, userName) {
    let userDocRef = firebase.firestore().collection("users").doc(user.uid);
    userDocRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          userDocRef.set({
            name: userName,
            nickName: null,
            reviews: [],
            favorites: [],
            thumbnail: null,
            notification: notification,
          });
        } else {
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Welcome to <Text style={{ color: "#FF4D12" }}>V</Text>'s Pick!
        </Text>
        <Text style={styles.headerText}>Let's get you started with.</Text>
      </View>
      <KeyboardAwareScrollView style={styles.contents}>
        <View style={{ marginHorizontal: 10 }}>
          <Text style={styles.fieldTitle}>
            Username<Text style={{ color: "#FF4D12" }}>*</Text>
          </Text>
          <Input
            style={styles.textField}
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
            maxLength={15}
            placeholder="Username"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={true}
            pattern={[
              "^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:.(?!.))){0,15}(?:[A-Za-z0-9_]))?)$",
              "^.{3,30}$",
            ]}
            onValidation={(isValid) => {
              setUserNameValid(isValid[0] && isValid[1]);
            }}
          />
          {checkValidity(name, isUserNameValid, userNameMsg)}
        </View>
        <View style={styles.divider}></View>
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          <Text style={styles.fieldTitle}>
            Email<Text style={{ color: "#FF4D12" }}>*</Text>
          </Text>
          <Input
            style={styles.textField}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            maxLength={25}
            placeholder="Email"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={true}
            pattern={
              "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
            }
            onValidation={(isValid) => {
              setEmailValid(isValid);
            }}
          />
          {checkValidity(email, isEmailValid, emailMsg)}
        </View>
        <View style={styles.divider}></View>
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          <Text style={styles.fieldTitle}>
            Password<Text style={{ color: "#FF4D12" }}>*</Text>
          </Text>
          <Input
            style={styles.textField}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            maxLength={30}
            placeholder="Password"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={true}
            secureTextEntry={true}
            pattern={[
              "^.{8,30}$", // 8-30 chars
              "(?=.*\\d)", // number required
              "(?=.*[A-Z])", // uppercase letter
            ]}
            onValidation={(isValid) => {
              setPWValidate(isValid);
            }}
          />
          <View>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 13,
                color: pwValidate[0] ? "green" : "red",
                marginBottom: 5,
              }}
            >
              <Text>{pwValidate[0] ? "✔️" : "❌"}</Text> Rule 1: 8-30 characters
            </Text>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 13,
                color: pwValidate[1] ? "green" : "red",
                marginBottom: 5,
              }}
            >
              <Text>{pwValidate[1] ? "✔️" : "❌"}</Text> Rule 2: At least 1
              numeric character
            </Text>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 13,
                color: pwValidate[2] ? "green" : "red",
              }}
            >
              <Text>{pwValidate[2] ? "✔️" : "❌"}</Text> Rule 3: At least 1
              uppercase letter
            </Text>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          <Text style={styles.fieldTitle}>
            Confirm Password<Text style={{ color: "#FF4D12" }}>*</Text>
          </Text>
          <TextInput
            style={styles.textField}
            value={pwConfirm}
            onChangeText={(text) => {
              setPWConfirm(text);
            }}
            maxLength={30}
            placeholder="Password"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={true}
            secureTextEntry={true}
          />
          {checkValidity(pwConfirm, password === pwConfirm, pwConfirmMsg)}
        </View>
      </KeyboardAwareScrollView>
      <TouchableWithoutFeedback
        onPress={() => {
          checkFields() ? addUser(name, email, password) : null;
        }}
      >
        <View
          style={[
            styles.continueButton,
            { backgroundColor: checkFields() ? "#FF4D12" : "#DEDEDE" },
          ]}
        >
          <Text
            style={{
              fontFamily: "Roboto-Regular",
              color: "white",
              fontSize: 18,
            }}
          >
            Continue
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: "white",
  },
  header: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "Roboto-Light",
    fontSize: 24,
  },
  contents: {
    flex: 7,
    padding: 20,
    paddingTop: 0,
  },
  fieldTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
  },
  textField: {
    borderWidth: 1,
    fontSize: 15,
    borderColor: "#C4C4C4",
    marginVertical: 10,
    padding: 5,
    fontFamily: "Roboto-Regular",
  },
  divider: {
    backgroundColor: "#ADADAD",
    height: 1,
    marginVertical: 10,
  },
  validateButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    borderColor: "#FF4D12",
    borderWidth: 1,
    margin: 10,
    marginRight: 0,
  },
  continueButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
