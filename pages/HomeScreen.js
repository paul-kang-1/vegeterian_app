import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import firebase, { storage } from "../firebase";

const MAP_API = "0abbbf5654f34e6dbb2606e6765f5614";

const HomeScreen = () => {
  const [address, setAddress] = useState("");
  const [dataSource, setDataSource] = useState([]);

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
  }

  const makeRemoteRequest = () => {
    var usersRef = firebase.database().ref('resaturant');
    usersRef.on('value', (snapshot) => {
      var m = snapshot.val()
      var keys = Object.values(m);
      setDataSource(keys);
    });
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { }}>
        <View style={{ flex: 1, marginLeft: 10, marginBottom: 6, borderColor: 'black' }} >
          <Image style={styles.icon} source={{ uri: item.image }} />
          <View>
            <Text>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    getLocation();
    makeRemoteRequest();
  });

  return (
    <View style={styles.container}>
      <Text>{address}</Text>
      <FlatList
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        //onRefresh={this.handleRefresh}
        //refreshing={this.state.refreshing}
        //onEndReachedThreshold={10000000}
      />
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    height: 70,
    width: 70
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
