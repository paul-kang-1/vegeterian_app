import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Constants from "expo-constants";

const Terms = ({ navigation }) => {
  const [location, setLocation] = useState(false);
  const [notification, setNotification] = useState(false);

  function checked(isChecked) {
    return isChecked ? (
      <Image
        source={require("../assets/icons/button_agree.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />
    ) : (
      <Image
        source={require("../assets/icons/button_disagree.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />
    );
  }

  function setAll(){
    setLocation(!location);
    setNotification(!location)
  }
  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={styles.headerText}>Welcome!</Text>
        <Text style={styles.headerSmallText}>
          If you agree to the terms below,
        </Text>
        <Text style={styles.headerSmallText}>
          Your <Text style={{ color: "#FF4D12" }}>V</Text> life will begin.
        </Text>
      </View>
      <View style={{ margin: 15, flex: 3, width: "100%", paddingHorizontal: 15  }}>
        <View style={styles.term}>
          <Text
            style={{
              fontFamily: "Roboto-Light",
              fontSize: 15,
              marginRight: 10,
            }}
          >
            Agree All
          </Text>
          <TouchableWithoutFeedback onPress={()=>setAll()}>
            {checked(location && notification)}
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.term}>
          <Text
            style={{
              fontFamily: "Roboto-Light",
              fontSize: 15,
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            Location-based Terms of Service Agreement (Required)
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              setLocation(!location);
            }}
          >
            {checked(location)}
          </TouchableWithoutFeedback>
        </View>
        
        <View style={[styles.term, { marginTop: 20 }]}>
          <Text
            style={{
              fontFamily: "Roboto-Light",
              fontSize: 15,
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            Marketing Information App Push Notifications Agreement
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              setNotification(!notification);
            }}
          >
            {checked(notification)}
          </TouchableWithoutFeedback>
        </View>
      </View>
      
      <TouchableWithoutFeedback onPress={() => location? navigation.navigate("Signup"): null}>
        <View
          style={[
            styles.continueButton,
            { backgroundColor: location ? "#FF4D12" : "#DEDEDE" },
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
export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: Constants.statusBarHeight,
  },
  headerText: {
    fontFamily: "Roboto-Light",
    fontSize: 24,
  },
  headerSmallText: {
    fontFamily: "Roboto-Light",
    fontSize: 20,
  },
  continueButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    bottom: 0,
  },
  divider: {
    backgroundColor: "#ADADAD",
    height: 1,
    marginVertical: 10,
  },
  term: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
