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
import StarRating from "react-native-star-rating";
import Keyword from "./Keyword";

const RestaurantScreen = ({ navigation, route }) => {
  const [dataSource, setDataSource] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const { id, ref } = route.params;
  const fetchAdditionalInfo = id => {
    var docRef = ref.doc(id);
    docRef.get().then(function(doc) {
      setDataSource(doc.data());
    });
  };

  const icons = [
    require("../assets/icons/rating_food.png"),
    require("../assets/icons/rating_price.png"),
    require("../assets/icons/rating_mood.png")
  ];

  const rating = dataSource
    ? [
        dataSource.rating_detail.food,
        dataSource.rating_detail.price,
        dataSource.rating_detail.mood
      ]
    : [];

  const ratingModule = (icons, rating) => {
    const res = [];
    for (var i = 0; i < icons.length; i++) {
      res.push(
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={{ width: 18, height: 20, marginRight: 5 }}
            source={icons[i]}
            resizeMode="contain"
          />
          <StarRating
            disabled={true}
            maxStars={5}
            rating={rating[i]}
            emptyStar={"star-o"}
            emptyStarColor="#ADADAD"
            fullStar={"star"}
            fullStarColor="#FF4D12"
            halfStarEnabled={false}
            starStyle={{ marginLeft: 3 }}
            starSize={18}
          />
          <Text
            style={{
              marginLeft: 5,
              fontFamily: "OpenSans-SemiBold",
              fontSize: 14,
              color: "#ADADAD"
            }}
          >
            {rating[i]}
          </Text>
        </View>
      );
    }
    return res;
  };

  useEffect(() => {
    fetchAdditionalInfo(id);
  }, []);

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
                onPress={() => console.log(dataSource.coordinates._lat)}
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
                  <Text style={styles.restaurantTitleText}>
                    {dataSource.name}
                  </Text>
                  <View style={styles.statusContainer}>
                    <Image
                      style={[styles.statusIcon, { marginBottom: 2 }]}
                      source={require("../assets/icons/viewIcon.png")}
                      resizeMode="contain"
                    />
                    <Text style={styles.statusText}>1223</Text>
                    <Image
                      style={styles.statusIcon}
                      source={require("../assets/icons/commentIcon.png")}
                      resizeMode="contain"
                    />
                    <Text style={styles.statusText}>232</Text>
                    <Image
                      style={[styles.statusIcon, { marginBottom: 2 }]}
                      source={require("../assets/icons/starIcon.png")}
                      resizeMode="contain"
                    />
                    <Text style={styles.statusText}>100</Text>
                  </View>
                </View>
                <Text style={styles.restaurantRatingText}>
                  {dataSource.rating}
                </Text>
              </View>
              <View style={{ alignSelf: "flex-end", marginRight: 20 }}>
                {ratingModule(icons, rating)}
              </View>
              <View
                style={{
                  borderTopColor: "#C4C4C4",
                  borderTopWidth: 1,
                  margin: 10,
                  marginTop: 15,
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
                    latitude: dataSource.coordinates._lat,
                    longitude: dataSource.coordinates._long,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0221
                  }}
                >
                  <MapView.Marker
                    coordinate={{
                      latitude: dataSource.coordinates._lat,
                      longitude: dataSource.coordinates._long
                    }}
                    title={"title"}
                    description={"description"}
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
    fontSize: 25,
    fontFamily: "OpenSans-SemiBold",
    paddingTop: 10,
    paddingBottom: 5,
    marginLeft: 12
  },
  restaurantRatingText: {
    alignSelf: "center",
    marginRight: 15,
    fontSize: 35,
    fontFamily: "OpenSans-SemiBold",
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
