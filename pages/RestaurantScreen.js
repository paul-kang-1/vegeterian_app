import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
  ToastAndroid,
  Platform,
  AlertIOS
} from "react-native";
import MapView from "react-native-maps";
import BGCarousel, { DEVICE_WIDTH } from "./BGCarousel";
import Constants from "expo-constants";
import Keyword from "./Keyword";
import GetWeekSchedule from "./Schedule";
import { Clipboard } from "react-native";
import firebase from "firebase";

const RestaurantScreen = ({ navigation, route }) => {
  const [dataSource, setDataSource] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [isCollapsed, setCollapsed] = useState(true);
  const { id, ref } = route.params;
  const userUid = firebase.auth().currentUser.uid;
  const userDocRef = firebase
    .firestore()
    .collection("users")
    .doc(userUid);
  function fetchAdditionalInfo(id) {
    var docRef = ref.doc(id);
    docRef
      .get()
      .then(function(doc) {
        var result = doc.data().d;
        result.coordinates = doc.data().l;
        return result;
      })
      .then(result => {
        return addReviewToResult(result);
      })
      .then(data => {
        setDataSource(data);
        fetchFavorite(data.name);
      })
      .catch(e => console.error(e));
  }

  async function addReviewToResult(result) {
    const reviews = [];
    await firebase
      .firestore()
      .collection("reviews")
      .where("restaurant", "==", result.name)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          reviews.push(doc.data());
        });
      });
    result.reviews = reviews;
    return result;
  }

  function displayRating(n) {
    return n % 1 ? n : n + ".0";
  }

  function copyToClipboard() {
    if (dataSource != null)
      Clipboard.setString(dataSource.address.address_full);
  }

  function renderReviews() {
    if (dataSource.reviews.length === 0) {
      return (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontFamily: "Roboto-Light", fontSize: 15 }}>
            🥗 Be The First to Write a Review 🥗
          </Text>
        </View>
      );
    } else {
      return dataSource.reviews.map((val, i) => {
        return (
          <View
            key={i}
            style={{
              borderBottomWidth: 0.5,
              borderColor: "#C4C4C4",
              padding: 10,
              flexDirection: "row"
            }}
          >
            <Text style={styles.reviewRatingText}>
              {displayRating(val.rating)}
            </Text>
            <Text style={styles.reviewText}>{val.review}</Text>
          </View>
        );
      });
    }
  }

  async function fetchFavorite(name) {
    userDocRef
      .get()
      .then(doc => {
        return doc.data().favorites;
      })
      .then(favorites => setFavorite(favorites.includes(name)));
  }

  async function changeFavorite(newFavorite) {
    userDocRef
      .update({
        favorites: newFavorite
          ? firebase.firestore.FieldValue.arrayUnion(dataSource.name)
          : firebase.firestore.FieldValue.arrayRemove(dataSource.name)
      })
      .then(result => {
        const msg = `✔️ Successfully ${
          newFavorite ? "added to" : "removed from"
        } your favorites!`;
        notifyMessage(msg);
        setFavorite(newFavorite);
      });
  }

  function notifyMessage(msg) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      AlertIOS.alert(msg);
    }
  }

  useEffect(() => {
    fetchAdditionalInfo(id);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ flex: 1 }}>
        {dataSource ? (
          <View style={styles.contents}>
            <View style={{ flex: 2 }}>
              <BGCarousel images={dataSource.images} />
              <TouchableOpacity
                style={styles.reviewButtonContainer}
                onPress={() =>
                  navigation.navigate("Review", { name: dataSource.name })
                }
              >
                <Image
                  source={require("../assets/icons/button_WriteReview.png")}
                  style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.starContainer}
                onPress={() => changeFavorite(!favorite)}
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

              <View style={styles.lowerContainer}>
                <Keyword keywords={dataSource.type} />
                <MapView
                onPress={()=>navigation.navigate("Map")}
                  style={{
                    height: 130,
                    width: "100%",
                    marginBottom: 10
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
                    fontFamily: "Roboto-Light",
                    fontSize: 15,
                    alignSelf: "center"
                  }}
                >
                  {dataSource.address.address_full}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => Linking.openURL(`tel:${dataSource.phone}`)}
                  >
                    <View style={styles.callButton}>
                      <Image
                        source={require("../assets/icons/phone.png")}
                        style={{ width: 20, height: 20, marginRight: 15 }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{ fontFamily: "Roboto-Light", fontSize: 15 }}
                      >
                        Call
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => copyToClipboard()}>
                    <View style={styles.callButton}>
                      <Text
                        style={{ fontFamily: "Roboto-Light", fontSize: 15 }}
                      >
                        📋 Copy Address
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <Text style={styles.sectionTitleText}>Open Hours</Text>
                <GetWeekSchedule
                  schedule={dataSource["schedule"]}
                  onStateChange={() => setCollapsed(!isCollapsed)}
                  isCollapsed={isCollapsed}
                ></GetWeekSchedule>
                <Text style={styles.sectionTitleText}>
                  Reviews ({dataSource ? dataSource.reviews.length : ""})
                </Text>
                <View
                  style={{
                    marginVertical: 10
                  }}
                >
                  {dataSource ? renderReviews() : null}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.contents}>
            <View style={{ flex: 2, justifyContent: "center", paddingTop: 150 }}>
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
    marginTop: Constants.statusBarHeight,
    backgroundColor: "white"
  },
  contents: {
    width: DEVICE_WIDTH,
    flex: 1
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
  statusIcon: { height: 15, width: 20, marginLeft: 10 },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 5
  },
  callButton: {
    width: "48.5%",
    borderColor: "#FF4D12",
    borderWidth: 1,
    marginVertical: 15,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10
  },
  lowerContainer: {
    borderTopColor: "#C4C4C4",
    borderTopWidth: 1,
    margin: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 5
  },
  sectionTitleText: { fontFamily: "OpenSans-Bold", fontSize: 20 },
  reviewContainer: {
    borderWidth: 1,
    width: "100%",
    marginTop: 10,
    borderColor: "#FF4D12"
  },
  reviewText: {
    fontFamily: "Roboto-Light",
    fontSize: 15,
    flex: 1,
    flexWrap: "wrap"
  },
  starContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    padding: 10,
    paddingBottom: 5
  },
  reviewRatingText: {
    fontFamily: "OpenSans-Bold",
    fontSize: 30,
    color: "#FF4D12",
    marginRight: 10
  },
  reviewButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 10
  }
});
