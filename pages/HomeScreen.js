
import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import firebase, { storage } from "../firebase";

const MAP_API = "0abbbf5654f34e6dbb2606e6765f5614";

const HomeScreen = () => {
  const [address, setAddress] = useState("");
  const [dataSource, setDataSource] = useState([]);

  const getAddress = async (latitude, longitude) => {
    console.log('getaddress')
    const {
      data: { results }
    } = await axios.get(
      `http://api.opencagedata.com/geocode/v1/json?key=${MAP_API}&q=${latitude}%2C${longitude}&pretty=1`
    );
    const comp = results[0].components;
    console.log('comp', comp)
    if (comp.town) {
      loc = comp.town;
    } else if (comp.neighborhood) {
      loc = comp.neighborhood;
    } else if (comp.county) {
      loc = comp.county;
    } else {
      loc = comp.city;
    }
    //console.log('location: ',loc);
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

  const makeRemoteRequest = () => {
    var usersRef = firebase.database().ref("resaturant");
    usersRef.on("value", snapshot => {
      var m = snapshot.val();
      var keys = Object.values(m);
      setDataSource(keys);
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("running");
        }}
      >
        <View
          style={styles.imageCard}
        >
          <Image style={styles.thumbnail} source={{ uri: item.image }} />
          <View>
            <Text style={styles.restaurantTitle}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    console.log('useeffect called')
    getLocation();
    makeRemoteRequest();
  },[]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image
          style={styles.domaImage}
          source={require("../assets/images/doma.png")}
        />
      </View>
      <View
        style={{
          flex:1,
          width: '100%',
          paddingBottom: 20,
          borderWidth: 5,
          borderColor: "red",
          justifyContent: "center",
          paddingTop: 50
        }}
      >
        <Text>{address}</Text>
      </View>
      <View style={{flex:5}}>
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
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    position: "absolute",
    top:0,
    left: 0,
    right: 0,
  }
  ,
  domaImage: {
    alignSelf: "flex-end"
  }
  ,
  thumbnail: {
    width: 300,
    height: 300
  },
  imageCard: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 6,
    borderColor: "black",
    borderWidth: 4
  }
  ,
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAEAE8"
  },
  addressText: {
    //paddingTop: 30,
    fontSize: 25,
    fontFamily: "OpenSans-SemiBold"
  },
  restaurantTitle: {
    fontSize: 20,
    fontFamily: "OpenSans-SemiBold"
  }

});

