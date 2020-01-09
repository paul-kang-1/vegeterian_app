import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CommunityScreen = props => (
  <View style={styles.container}>
    <Text>CommunityScreen</Text>
  </View>
);
export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
