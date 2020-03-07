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
import Keyword from "./Keyword";

//const MAP_API = "0abbbf5654f34e6dbb2606e6765f5614";

const HomeScreen = ({ route, navigation }) => {
  const [dataSource, setDataSource] = useState([]);
  const [backClickCount, setBackClickCount] = useState(0);
  const [loading, setLoading] = useState(true); // for data
  const ref = firestore().collection("restaurants");
  //const { photoUrl } = route.params;
  // Now we get the references of these images

  const makeRemoteRequest = () => {
    return ref.onSnapshot(querySnapshot => {
      const restaurants = [];
      querySnapshot.forEach(doc => {
        const { name, rating, type, thumbnail, address } = doc.data();
        restaurants.push({
          id: doc.id,
          name,
          rating,
          type,
          thumbnail,
          address
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
            id: item.id,
            ref: ref
          });
        }}
      >
        <View style={[styles.imageCard, styles.shadow]}>
          <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
          <View style={{ position: "absolute", marginTop: 10, right: 5 }}>
            <Keyword keywords={item.type} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 10
            }}
          >
            <View>
              <Text style={styles.restaurantTitleText}>{item.name}</Text>
              <Text>{item.address.address_depth2}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <View style={{ width: 25, height: 25, marginTop: 19, marginRight: 10 }}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={require("../assets/icons/heart.png")}
                />
              </View>
              <View style={[styles.restaurantRating, styles.shadow]}>
                <Text style={styles.restaurantRatingText}>{item.rating}</Text>
              </View>
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
      console.log("go Back");
      navigation.pop();
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
    // firebase.auth().signOut();
    // navigation.navigate("Loading");
  };

  const listHeader = () => {
    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>
            <Text style={{ color: "#FF4D12" }}>V</Text>'s Pick
          </Text>
        </View>
        <View style={[styles.vsPick, styles.shadow]}>
          <Button onPress={() => onSignOut()} title={"Merge Account"} />
        </View>
        <View style={styles.titleContainer2}>
          <Text style={styles.pageTitle}>
            <Text style={{ color: "#FF4D12" }}>A</Text>round You
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={dataSource}
      renderItem={renderItem}
      keyExtractor={item => item.name}
      // initialNumToRender={2}
      // maxToRenderPerBatch={2}
      scrollEnabled={true}
      ListHeaderComponent={listHeader()}
      showsVerticalScrollIndicator={false}
      //onRefresh={this.handleRefresh}
      //refreshing={this.state.refreshing}
      //onEndReachedThreshold={10000000}
    />
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
  shadow: elevationShadowStyle(6),
  vsPick: {
    height: 300,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 8
  },
  titleContainer: {
    height: 100,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 20,
    marginTop: 10
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
    fontFamily: "Roboto-Light",
    fontSize: 40,
    alignSelf: "flex-end",
    marginBottom: 5
  },
  thumbnail: {
    //flex: 1,
    width: null,
    height: 170,
    resizeMode: "cover"
  },
  imageCard: {
    flex: 1,
    height: 235,
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
    backgroundColor: "white",
    marginTop: Constants.statusBarHeight
  },
  restaurantRatingText: {
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    color: "#FFF"
  },
  restaurantTitleText: {
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    paddingTop: 5,
    paddingBottom: 2
  },
  restaurantRating: {
    backgroundColor: "#FF4D12",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    marginVertical: 15,
    paddingTop: 2
  }
});
