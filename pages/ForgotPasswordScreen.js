import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import firebase from "firebase";

const height = Dimensions.get("window").height;

const ForgotPasswordScreen = (props) => {
  const [email, setEmail] = useState("");
  async function onButtonPress() {
    console.log(email);
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => Alert.alert("Request sent","Please check your email inbox!"))
      .catch((e) => {
        Alert.alert(e.toString())
      });
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{}}>
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ height: height * 0.25, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 25,
                marginVertical: 10,
              }}
            >
              Forgot your password?
            </Text>
            <Text style={{ fontFamily: "Roboto-Light", fontSize: 17 }}>
              Type your email below to reset your password.
            </Text>
          </View>
          <TextInput
            style={styles.sendRequestTextField}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            placeholder="Email"
            keyboardType="email-address"
            blurOnSubmit={true}
          />
          <TouchableWithoutFeedback onPress={() => onButtonPress()}>
            <View style={styles.sendRequestButton}>
              <Text style={styles.sendRequestText}>Reset Password</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: Constants.statusBarHeight,
    borderTopColor: "#FF4D12",
    backgroundColor: "white",
  },
  sendRequestTextField: {
    width: "85%",
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ADADAD",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
    fontFamily: "Roboto-Light",
  },
  sendRequestButton: {
    width: "85%",
    height: 45,
    backgroundColor: "#FF4D12",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  sendRequestText: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "white",
  },
});
