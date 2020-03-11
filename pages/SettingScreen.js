import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import firebase from "firebase";

const SettingScreen = ({ route, navigation }) => {
  const photoUrl = firebase.auth().currentUser.photoURL;
  console.log(photoUrl);
  return (
    <View style={styles.container}>
      <Image style={styles.thumbnail} source={{ uri: photoUrl }} />
    </View>
  );
};
export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  thumbnail: { width: 85, height: 85, borderRadius : 42.5 }
});
