import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import * as Location from "expo-location";

const MAP_API = "0abbbf5654f34e6dbb2606e6765f5614";

const HomeScreen = () => {
  const [address, setAddress] = useState("");
  const getAddress = async (latitude, longitude) => {
    const {
      data: { results }
    } = await axios.get(
      `http://api.opencagedata.com/geocode/v1/json?key=${MAP_API}&q=${latitude}%2C${longitude}&pretty=1`
    );
    const comp = results[0].components;
    if (comp.town) {
      loc = comp.town;
    } else if (comp.neighborhood) {
      loc = comp.neighborhood;
    } else if (comp.county) {
      loc = comp.county;
    } else {
      loc = comp.city;
    }
    setAddress(loc);
  };
  const getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      getAddress(latitude, longitude);
    } catch (error) {
      Alert.alert("Permission denied!");
    }
  };
  useEffect(() => {
    getLocation();
  });
  return (
    <View style={styles.container}>
      <Text>{address}</Text>
      <Text>location is the following</Text>
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
