import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TextInput,
  BackHandler,
  ToastAndroid,
  Alert,
  PanResponder,
  Platform,
} from "react-native";
import firebase from "firebase";
import { GeoFirestore } from "geofirestore";
import MapView from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Keyword from "./Keyword";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 3.5;
const CARD_WIDTH = width / 1.5;

const SearchScreen = ({ navigation }) => {
  const [backClickCount, setBackClickCount] = useState(0);
  const [myLocation, setMyLocation] = useState();
  let newLocation;
  let currentIndex = 0;
  let animation = new Animated.Value(0);
  let position = new Animated.ValueXY();
  let positionRef = useRef(position);
  let timeouts = [];
  const [markers, setMarkers] = useState();
  const [search, setSearch] = useState("");
  const [noRestaurants, setNoRestaurants] = useState(false);
  const mapRef = useRef();
  const scrollRef = useRef();
  // const [interpolations, setInterpolations] = useState();
  const firestore = firebase.firestore();
  const geofirestore = new GeoFirestore(firestore);
  const geocollection = geofirestore.collection("restaurants");
  const dbRef = firebase.firestore().collection("restaurants");

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        const currentOffset = getCurrentOffset(gestureState.moveY);
        positionRef.current.setValue({ y: setHeight(currentOffset) });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        const currentOffset = getCurrentOffset(gestureState.moveY);
        if (-240 <= currentOffset && currentOffset <= -120) {
          console.log("lower half");
          startAnimation(false);
        } else if (-120 < currentOffset && currentOffset <= 0) {
          console.log("upper half");
          startAnimation(true);
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })
  ).current;

  function getCurrentOffset(moveY) {
    return height - moveY - (CARD_HEIGHT + 70);
  }

  const startAnimation = (isUpperHalf) => {
    isUpperHalf
      ? Animated.timing(positionRef.current, {
          toValue: 0,
          duration: 200,
        }).start()
      : Animated.timing(positionRef.current, {
          toValue: -CARD_HEIGHT - 20,
          duration: 200,
        }).start(() => {
          console.log(position.y);
        });
  };

  function setHeight(currentOffset) {
    if (currentOffset < -CARD_HEIGHT) return -CARD_HEIGHT;
    else if (-CARD_HEIGHT <= currentOffset && currentOffset <= 0) {
      return currentOffset;
    } else {
      return 0;
    }
  }

  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({});
    setMyLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    noRestaurants ? null : initScrollPosition();
    if (location) {
      const { latitude, longitude } = location.coords;
      makeQuery({ latitude: latitude, longitude: longitude });
    }
  };

  function redoSearch() {
    if (myLocation && newLocation) {
      currentIndex = 0;
      initScrollPosition();
      setMyLocation({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });
      makeQuery(newLocation);
    }
  }

  function initScrollPosition() {
    scrollRef.current.getNode().scrollTo({
      x: 0,
      animated: true,
    });
  }

  function makeQuery(location) {
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(
        location.latitude,
        location.longitude
      ),
      radius: 2,
    });
    query.get().then((value) => {
      if (value.docs.length === 0) {
        Alert.alert(
          "No restaurants around you 😞",
          "Try searching on a different location!"
        );
        setNoRestaurants(true);
      }
      // All GeoDocument returned by GeoQuery, like the GeoDocument added above
      console.log(`${value.docs.length} restaurants near you!`);
      value.docs.sort(compare);
      for (let doc of value.docs) {
        console.log(doc.id);
      }
      setMarkers(value.docs);
    });
  }

  function compare(a, b) {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    getLocationAsync();
  }, []);

  useEffect(() => {
    if (mapRef && markers) {
      animation.addListener(({ value }) => {
        let index = Math.floor(value / (CARD_WIDTH + 20) + 0.3);
        if (index >= markers.length) {
          index = markers.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }

        clearTimeout(regionTimeout);
        let regionTimeout = setTimeout(() => {
          if (currentIndex !== index) {
            // console.log(
            //   `current: ${currentIndex}, new: ${index}, ${markers[index].id}`
            // );
            currentIndex = index;
            const coordinate = {
              latitude: markers[index].data().coords["U"],
              longitude: markers[index].data().coords["k"],
            };
            // console.log(coordinate);
            mapRef.current.animateToRegion(
              {
                ...coordinate,
                latitudeDelta: 0.0194,
                longitudeDelta: 0.022099,
              },
              550
            );
          }
        }, 20);
        timeouts.push(regionTimeout);
      });
    }
  });

  function displayDistance(n) {
    if (n >= 1) {
      return Math.round((n + Number.EPSILON) * 100) / 100 + "km";
    } else {
      return Math.round((n * 1000 + Number.EPSILON) * 1) / 1 + "m";
    }
  }

  function displayRating(n) {
    return n % 1 ? n : n + ".0";
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [backClickCount]);

  backButtonEffect = () => {
    if (navigation.isFocused()) {
      ToastAndroid.show("Press Back again to Exit", ToastAndroid.SHORT);
      setBackClickCount(1);
      console.log(backClickCount);
      setTimeout(function () {
        setBackClickCount(0);
      }, 1000);
    } else {
      console.log("go Back");
      navigation.pop();
    }
  };

  const handleBackButton = () => {
    console.log(`backclick: ${backClickCount}`);
    backClickCount == 1 ? BackHandler.exitApp() : backButtonEffect();
    return true;
  };

  return (
    <View style={styles.container}>
      {myLocation ? (
        <React.Fragment>
          <MapView
            mapPadding={{ bottom: CARD_HEIGHT * 0.3 }}
            style={{
              flex: 1,
              width: "100%",
              marginBottom: 30,
            }}
            region={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
              latitudeDelta: 0.0022,
              longitudeDelta: 0.0221,
            }}
            rotateEnabled={false}
            onRegionChangeComplete={({ latitude, longitude }) =>
              (newLocation = { latitude: latitude, longitude: longitude })
            }
            ref={mapRef}
          >
            <MapView.Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
            >
              <Image
                source={require("../assets/icons/marker_myLocation.png")}
                style={{ width: 30, height: 30 }}
              />
            </MapView.Marker>
            {markers
              ? markers.map((marker, index) => {
                  const inputRange = [
                    (index - 1) * (CARD_WIDTH + 20),
                    index * (CARD_WIDTH + 20),
                    (index + 1) * (CARD_WIDTH + 20),
                  ];
                  const scaleStyle = {
                    transform: [
                      {
                        scale: animation.interpolate({
                          inputRange,
                          outputRange: [1, 1.5, 1],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  };
                  return (
                    <MapView.Marker
                      key={index}
                      coordinate={{
                        latitude: marker.data().coords["U"],
                        longitude: marker.data().coords["k"],
                      }}
                      title={marker.id}
                    >
                      <Animated.Image
                        source={require("../assets/icons/pin_location.png")}
                        style={[{ width: 35, height: 35 }, scaleStyle]}
                        resizeMode="cover"
                      />
                    </MapView.Marker>
                  );
                })
              : null}
          </MapView>

          <TextInput
            style={[styles.search, styles.shadow]}
            onChangeText={(text) => {
              setSearch(text);
            }}
            placeholder="Search.."
            placeholderTextColor="gray"
          ></TextInput>
          <TouchableWithoutFeedback onPress={() => redoSearch()}>
            <View style={[styles.redoSearchButton, styles.shadow]}>
              <Text style={styles.redoSearchButtonText}>
                Redo search in this area
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        </React.Fragment>
      )}
      <Animated.View
        style={[{ bottom: positionRef.current.y }, styles.bottomCollapsible]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: 'flex-end'
          }}
        >
          <View style={{ width: 50, height: 50, marginBottom:10, marginRight:10 }}></View>
          <TouchableWithoutFeedback onPress={() => console.log("filterButton")}>
            <Image
              source={require("../assets/icons/button_filter.png")}
              style={styles.filterButtonImage}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => getLocationAsync()}>
            <Image
              source={require("../assets/icons/button_myLocation.png")}
              style={styles.myLocationButtonImage}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            width: "100%",
            height: CARD_HEIGHT * 1.3,
            backgroundColor: "rgba(255,255,255,0.9)",
            borderTopLeftRadius: CARD_HEIGHT * 0.2,
            borderTopRightRadius: CARD_HEIGHT * 0.2,
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              paddingBottom: CARD_HEIGHT * 0.1,
              borderColor: "rgba(255,255,255,0)",
              zIndex: 999,
            }}
            {...panResponder.panHandlers}
          >
            <View style={styles.bottomCollapsibleHandle}></View>
          </View>
          {
            <Animated.ScrollView
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              decelerationRate={0.9}
              snapToInterval={CARD_WIDTH + 20} //your element width
              snapToAlignment={"center"}
              centerContent={false}
              snapToStart={true}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: animation,
                      },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
              style={[
                styles.scrollView,
                {
                  paddingLeft: Platform.OS === "ios" ? 0 : width / 6 - 10,
                  paddingRight: Platform.OS === "ios" ? width / 6 - 10 : 0,
                },
              ]}
              contentContainerStyle={styles.endPadding}
              ref={scrollRef}
            >
              {markers
                ? markers.map((marker, index) => {
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          navigation.navigate("Restaurant", {
                            id: marker.id,
                            ref: dbRef,
                          });
                        }}
                        key={index}
                      >
                        <View style={[styles.card, styles.shadow]}>
                          <View
                            style={{
                              position: "absolute",
                              zIndex: 999,
                              top: 5,
                              right: 0,
                            }}
                          >
                            <Keyword
                              keywords={marker.data().type}
                              vertical={true}
                            />
                          </View>
                          <Image
                            source={{
                              uri: marker.data().images[
                                Math.floor(
                                  Math.random() * marker.data().images.length
                                )
                              ],
                            }}
                            style={styles.cardImage}
                            resizeMode="cover"
                          />
                          <View style={{ flexDirection: "row" }}>
                            <View style={styles.textContent}>
                              <Text numberOfLines={1} style={styles.cardtitle}>
                                {marker.id}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={styles.cardDescription}
                              >
                                {marker.data().address["address_depth2"]},{" "}
                                {displayDistance(marker.distance)}
                              </Text>
                            </View>
                            <View style={styles.ratingContainer}>
                              <Text style={styles.ratingText}>
                                {displayRating(marker.data().rating)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  })
                : null}
            </Animated.ScrollView>
          }
        </View>
      </Animated.View>
    </View>
  );
};
export default SearchScreen;

const elevationShadowStyle = (elevation) => {
  return {
    elevation,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0.5 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
};

const styles = StyleSheet.create({
  shadow: elevationShadowStyle(6),
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: Constants.statusBarHeight,
    borderTopColor: "#FF4D12",
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "visible",
    borderRadius: 15,
    marginVertical: 15,
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  textContent: {
    flex: 1,
    padding: 10,
  },
  cardtitle: {
    fontSize: 18,
    marginTop: 0,
    fontFamily: "Roboto-Medium",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  search: {
    position: "absolute",
    top: 10,
    backgroundColor: "white",
    height: 40,
    width: width * 0.8,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: "white",
    fontFamily: "Roboto-Light",
    fontSize: 16,
  },
  bottomCollapsible: {
    position: "absolute",
    width: "100%",
    height: CARD_HEIGHT * 1.55,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  bottomCollapsibleHandle: {
    marginTop: 10,
    height: 7,
    backgroundColor: "#888888",
    width: 50,
    borderRadius: 2.5,
  },
  filterButtonImage: {
    marginBottom: 10,
    width: 80,
    height: 40,
  },
  myLocationButtonImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    marginRight: 10,
  },
  redoSearchButtonText: {
    color: "gray",
    fontSize: 12,
    fontFamily: "Roboto-Medium",
  },
  redoSearchButton: {
    position: "absolute",
    top: 70,
    height: 30,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  ratingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FF4D12",
    height: CARD_HEIGHT * 0.16,
    margin: 10,
    width: CARD_WIDTH * 0.25,
    borderRadius: CARD_HEIGHT * 0.08,
    marginTop: 15,
  },
  ratingText: {
    fontFamily: "Roboto-Medium",
    color: "white",
    fontSize: 18,
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
