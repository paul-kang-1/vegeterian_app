import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import MapView from "react-native-maps";
import Constants from "expo-constants";

const screenWidth = Dimensions.get("window").width;
const MapScreen = ({ navigation, route }) => {
  const {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
    name,
  } = route.params;
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: 50,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: screenWidth / 3,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                paddingLeft: 15,
                fontSize: 20,
              }}
            >
              Cancel
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Text style={{ fontFamily: "Roboto-Light", fontSize: 20 }}>
            {name}
          </Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <MapView
        style={{ flex: 1, width: "100%" }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
      >
        <MapView.Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={name}
        />
      </MapView>
    </View>
  );
};
export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: Constants.statusBarHeight,
    borderTopColor: Platform.OS === "ios" ? "#FF4D12" : "rgba(255,255,255,0)",
  },
});
