import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback
} from "react-native";
import firebase from "firebase";
import { GeoFirestore } from "geofirestore";
import MapView from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const SearchScreen = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [myLocation, setMyLocation] = useState();
  const [markers, setMarkers] = useState();
  const firestore = firebase.firestore();
  const geofirestore = new GeoFirestore(firestore);
  const geocollection = geofirestore.collection("restaurants");

  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setErrorMessage({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    setMyLocation(location);
    if (location) {
      const query = geocollection.near({
        center: new firebase.firestore.GeoPoint(
          location.coords.latitude,
          location.coords.longitude
        ),
        radius: 2
      });
      query.get().then(value => {
        // All GeoDocument returned by GeoQuery, like the GeoDocument added above
        console.log(`${value.docs.length} restaurants near you!`);
        for (let doc of value.docs) {
          console.log(doc.id);
          setMarkers(value.docs);
        }
      });
    }
  };

  useEffect(() => {
    getLocationAsync();
  }, []);
  return (
    <View style={styles.container}>
      {myLocation ? (
        <React.Fragment>
          <MapView
            style={{
              flex: 1,
              width: "100%"
            }}
            region={{
              latitude: myLocation.coords.latitude,
              longitude: myLocation.coords.longitude,
              latitudeDelta: 0.0022,
              longitudeDelta: 0.0221
            }}
            rotateEnabled={false}
          >
            <MapView.Marker
              coordinate={{
                latitude: myLocation.coords.latitude,
                longitude: myLocation.coords.longitude
              }}
            >
              <Image
                source={require("../assets/icons/marker_myLocation.png")}
                style={{ width: 30, height: 30 }}
              />
            </MapView.Marker>
            {markers
              ? markers.map((marker, index) => (
                  <MapView.Marker
                    key={index}
                    coordinate={{
                      latitude: marker.data().coords["U"],
                      longitude: marker.data().coords["k"]
                    }}
                    title={marker.id}
                  >
                    {/* <Image
                      source={require("../assets/icons/pin_location.png")}
                      style={{ width: 30, height: 50}}
                      resizeMode="contain"
                    /> */}
                  </MapView.Marker>
                ))
              : null}
          </MapView>
          <TouchableWithoutFeedback onPress={() => getLocationAsync()}>
            <Image
              source={require("../assets/icons/button_myLocation.png")}
              style={{
                position: "absolute",
                top: "50%",
                alignSelf: "flex-end",
                width: 50,
                height: 50
              }}
            />
          </TouchableWithoutFeedback>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        </React.Fragment>
      )}
    </View>
  );
};
export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.statusBarHeight
  }
});
