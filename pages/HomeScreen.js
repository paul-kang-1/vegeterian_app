import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import firebase, { storage } from "../firebase";
import Constants from "expo-constants";
import { black } from "ansi-colors";

const MAP_API = "0abbbf5654f34e6dbb2606e6765f5614";

const HomeScreen = () => {
  const [address, setAddress] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [scrollEnabled, setScroll] = useState(false);

  const getAddress = async (latitude, longitude) => {
    console.log("getaddress");
    const {
      data: { results }
    } = await axios.get(
      `http://api.opencagedata.com/geocode/v1/json?key=${MAP_API}&q=${latitude}%2C${longitude}&pretty=1`
    );
    const comp = results[0].components;
    console.log("comp", comp);
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
        <View style={[styles.imageCard, styles.shadow]}>
          <Image style={styles.thumbnail} source={{ uri: item.image }} />
          <View>
            <Text style={styles.restaurantTitle}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    console.log("useeffect called");
    getLocation();
    makeRemoteRequest();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1, maxWidth: "100%" }}
        //contentContainerStyle={{height:350, maxWidth: "100%" }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>{"V's Pick"}</Text>
          <Image
            style={{ alignSelf: "flex-end" }}
            source={require("../assets/images/doma.png")}
          />
        </View>
        <View style={[styles.vsPick, styles.shadow]}>
          <View style={{ flex: 3, paddingHorizontal:10, marginVertical:5 }}>
            <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: 30 }}>
              Restaurant Testing
            </Text>
            <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 13 }}>
              (Restaurant description goes here) brinjal is a plant species in
              the nightshade family Solanaceae. Solanum melongena is grown
              worldwide for its edible fruit.
            </Text>
          </View>
          <View style={{ flex: 5 }}>
            <Image
              style={{
                flex: 1,
                width: null,
                height: null,
                resizeMode: "cover"
              }}
              source={require("../assets/images/veggie_food_4.jpg")}
            />
          </View>
          <View style={{ flex: 3 }}></View>
        </View>
        <View style={styles.titleContainer2}>
          <Text style={styles.pageTitle}>{"Around You"}</Text>
        </View>
        <View style={{ height: "100%" }}>
          <FlatList
            data={dataSource}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            scrollEnabled={scrollEnabled}
            //onRefresh={this.handleRefresh}
            //refreshing={this.state.refreshing}
            //onEndReachedThreshold={10000000}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;

const elevationShadowStyle = elevation => {
  return {
    elevation,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0.5 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation
  };
};

const styles = StyleSheet.create({
  shadow: elevationShadowStyle(4),
  vsPick: {
    height: 400,
    marginHorizontal: 15,
    //paddingHorizontal: 10,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 8
  },
  titleContainer: {
    height: 123,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingLeft: 20,
    marginBottom: 5
  },
  titleContainer2: {
    flex: 0,
    flexDirection: "row",
    width: "100%",
    paddingTop: 20,
    justifyContent: "space-between",
    paddingLeft: 20
  },
  pageTitle: {
    fontFamily: "El-Messiri-SemiBold",
    fontSize: 45,
    alignSelf: "flex-end"
    //marginBottom:10
  },
  thumbnail: {
    //flex: 1,
    width: null,
    height: 170,
    resizeMode: "cover"
  },
  imageCard: {
    flex: 1,
    height: 250,
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden"
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAEAE8"
  },
  restaurantTitle: {
    fontSize: 20,
    fontFamily: "OpenSans-SemiBold",
    paddingVertical: 10,
    marginLeft: 10
  }
});
