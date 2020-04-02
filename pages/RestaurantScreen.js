import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import MapView from "react-native-maps";
import BGCarousel, { DEVICE_WIDTH, DEVICE_HEIGHT } from "./BGCarousel";
import Constants from "expo-constants";
import Keyword from "./Keyword";

const RestaurantScreen = ({ navigation, route }) => {
  const [dataSource, setDataSource] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const { id, ref } = route.params;
  let schedule;
  const fetchAdditionalInfo = id => {
    var docRef = ref.doc(id);
    docRef.get().then(function(doc) {
      var result = doc.data().d;
      result.coordinates = doc.data().l;
      setDataSource(result);
    });
  };
  function getWeekSchedule(schedule) {
    const { sun, mon, tue, wed, thu, fri, sat } = schedule;
    let weekday = [mon, tue, wed, thu, fri, sat, sun];
    return weekday;
  }

  function groupSchedule(scheduleArray) {
    const result = [0];
    for (let i = 1; i < scheduleArray.length; i++) {
      if (!isEqual(scheduleArray[i - 1], scheduleArray[i])) {
        result.push(i);
      }
    }
    console.log(result);
    return result;
  }

  function isEqual(a, b) {
    return (JSON.stringify(a) == JSON.stringify(b));
  }

  function displayRating(n) {
    return n % 1 ? n : n + ".0";
  }

  useEffect(() => {
    fetchAdditionalInfo(id);
  }, []);

  useEffect(() => {
    if (dataSource != null) {
      schedule = getWeekSchedule(dataSource["schedule"]);
      console.log(schedule);
      groupSchedule(schedule);
    }
  });

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.scrollViewContainer}>
        {dataSource ? (
          <View style={styles.contents}>
            <View style={{ flex: 2 }}>
              <BGCarousel images={dataSource.images} />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  padding: 10
                }}
                onPress={() => navigation.navigate("Review")}
              >
                <Image
                  source={require("../assets/icons/button_WriteReview.png")}
                  style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  padding: 10,
                  paddingBottom: 5
                }}
                onPress={() => setFavorite(!favorite)}
              >
                {favorite ? (
                  <Image
                    source={require("../assets/icons/button_favorite_toggled.png")}
                    style={{ width: 40, height: 60 }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("../assets/icons/button_favorite.png")}
                    style={{ width: 40, height: 60 }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ flex: 7 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <View>
                  <Text style={styles.restaurantTitleText} numberOfLines={1}>
                    {dataSource.name}
                  </Text>
                </View>
                <Text style={styles.restaurantRatingText}>
                  {displayRating(dataSource.rating)}
                </Text>
              </View>

              <View
                style={{
                  borderTopColor: "#C4C4C4",
                  borderTopWidth: 1,
                  margin: 10,
                  marginTop: 10,
                  paddingTop: 10,
                  paddingHorizontal: 5
                }}
              >
                <Keyword keywords={dataSource.type} />
                <MapView
                  style={{
                    height: 200,
                    width: "100%",
                    marginVertical: 10,
                    marginTop: 0
                  }}
                  initialRegion={{
                    latitude: dataSource.coordinates["U"],
                    longitude: dataSource.coordinates["k"],
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0221
                  }}
                >
                  <MapView.Marker
                    coordinate={{
                      latitude: dataSource.coordinates["U"],
                      longitude: dataSource.coordinates["k"]
                    }}
                    title={dataSource.name}
                  />
                </MapView>
                <Text
                  style={{
                    fontFamily: "OpenSans-Regular",
                    fontSize: 15,
                    alignSelf: "center"
                  }}
                >
                  {dataSource.address.address_full}
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${dataSource.phone}`)}
                  style={styles.callButton}
                >
                  <Image
                    source={require("../assets/icons/phone.png")}
                    style={{ width: 20, height: 20, marginRight: 15 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{ fontFamily: "OpenSans-Regular", fontSize: 15 }}
                  >
                    Make a Phone Call
                  </Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: "OpenSans-Bold", fontSize: 20 }}>
                  Open Hours
                </Text>
                <Text>{"data"}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.contents}>
            <View style={{ flex: 2, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
            <View style={{ flex: 7 }}></View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default RestaurantScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: DEVICE_WIDTH,
    marginTop: Constants.statusBarHeight
  },
  contents: {
    width: DEVICE_WIDTH,
    flex: 1,
    height: 1.5 * DEVICE_HEIGHT
  },
  scrollViewContainer: {
    height: 1.5 * DEVICE_HEIGHT,
    width: "100%"
  },
  restaurantTitleText: {
    fontSize: 35,
    fontFamily: "Roboto-Light",
    paddingTop: 10,
    marginLeft: 12
  },
  restaurantRatingText: {
    alignSelf: "center",
    marginRight: 15,
    marginTop: 10,
    fontSize: 40,
    fontFamily: "Roboto-Light",
    color: "#FF4D12"
  },
  statusText: {
    marginLeft: 5,
    color: "#ADADAD",
    paddingBottom: 2,
    fontFamily: "OpenSans-Regular",
    fontSize: 13
  },
  statusIcon: { height: 15, width: 20, marginLeft: 10 },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 5
  },
  callButton: {
    width: "100%",
    borderColor: "red",
    borderWidth: 1,
    marginVertical: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
