import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const SelectionScreen = () => {
  const [toHomeScreen, setToHomeScreen] = useState(false);

  return (
    <View style={styles.container}>
      <Text>SelectionScreen</Text>
    </View>
  );
};
export default SelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});