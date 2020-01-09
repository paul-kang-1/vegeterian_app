import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  ToastAndroid,
  Button
} from "react-native";
import Constants from "expo-constants";
import firebase, { firestore } from "firebase";

//const MAP_API = "0abbbf5654f34e6dbb2606e6765f5614";

const HomeScreen = ({ route, navigation }) => {
  const [dataSource, setDataSource] = useState([]);
  const [backClickCount, setBackClickCount] = useState(0);
  const [loading, setLoading] = useState(true); // for data
  //const { photoUrl } = route.params;
  // Now we get the references of these images

  const makeRemoteRequest = () => {
    const ref = firestore().collection("restaurants");
    return ref.onSnapshot(querySnapshot => {
      const restaurants = [];
      querySnapshot.forEach(doc => {
        const { name, rating, type, thumbnail } = doc.data();
        restaurants.push({
          id: doc.id,
          name,
          rating,
          type,
          thumbnail
        });
      });
      setDataSource(restaurants);
      if (loading) {
        setLoading(false);
      }
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Restaurant", {
            item: item
          });
        }}
      >
        <View style={[styles.imageCard, styles.shadow]}>
          <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.restaurantTitleText}>{item.name}</Text>
              <View style={styles.restaurantKeywordContainer}>
                {item.type.map((item, key) => (
                  <View style={styles.restaurantKeyword}>
                    <Text key={key} style={styles.restaurantKeywordText}>
                      {" "}
                      {item}{" "}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.restaurantRating}>
              <Text style={styles.restaurantRatingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    makeRemoteRequest();
  }, []);

  backButtonEffect = () => {
    if (navigation.isFocused()) {
      ToastAndroid.show("Press Back again to Exit", ToastAndroid.SHORT);
      setBackClickCount(1);
      setTimeout(function() {
        setBackClickCount(0);
      }, 1000);
    } else {
      navigation.goBack()
    }
  };

  handleBackButton = () => {
    backClickCount == 1 ? BackHandler.exitApp() : backButtonEffect();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [handleBackButton]);

  onSignOut = () => {
    firebase.auth().signOut();
    navigation.navigate("Loading");
  };
  return (
    <View style={styles.screenContainer}>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>{"V's Pick"}</Text>
          <Image
            style={{
              position: "absolute",
              right: 0,
              top: 0
            }}
            source={require("../assets/images/doma.png")}
          />
        </View>
        <View style={[styles.vsPick, styles.shadow]}>
          <Button onPress={() => onSignOut()} title={"sign out"} />
        </View>
        <View style={styles.titleContainer2}>
          <Text style={styles.pageTitle}>{"Around You"}</Text>
        </View>
        <View style={{ height: "100%" }}>
          <FlatList
            data={dataSource}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            scrollEnabled={false}
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
    height: 320,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 8
  },
  titleContainer: {
    height: 123,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: Constants.statusBarHeight,
    paddingLeft: 20
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
  screenContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAEAE8"
  },
  restaurantRatingText: {
    fontSize: 25,
    fontFamily: "OpenSans-SemiBold",
    color: "#FF4D12"
  },
  restaurantTitleText: {
    fontSize: 20,
    fontFamily: "OpenSans-SemiBold",
    paddingTop: 10,
    paddingBottom: 5,
    marginLeft: 10
  },
  restaurantKeywordText: {
    fontSize: 12,
    fontFamily: "OpenSans-Regular"
  },
  restaurantKeywordContainer: {
    flexDirection: "row",
    marginBottom: 10
  },
  restaurantKeyword: {
    backgroundColor: "#E1E1E1",
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 15
  },
  restaurantRating: {
    // backgroundColor: "#FF4D12",
    // borderColor: "#C53809",
    // borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginRight: 10,
    marginVertical: 20
  }
});
