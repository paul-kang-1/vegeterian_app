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
  ToastAndroid
} from "react-native";
import Constants from "expo-constants";
import { firestore } from "firebase";

const MAP_API = "0abbbf5654f34e6dbb2606e6765f5614";

const HomeScreen = ({ route, navigation }) => {
  const [dataSource, setDataSource] = useState([]);
  const [backClickCount, setBackClickCount] = useState(0);
  const [loading, setLoading] = useState(true); // for data
  //const { photoUrl } = route.params;

  const makeRemoteRequest = () => {
    const ref = firestore().collection("restaurants");
    return ref.onSnapshot(querySnapshot => {
      const restaurants = [];
      querySnapshot.forEach(doc => {
        const { name, rating, address, type, thumbnail } = doc.data();
        restaurants.push({
          name,
          rating,
          address,
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
        }}
      >
        <View style={[styles.imageCard, styles.shadow]}>
          <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
          <View>
            <Text style={styles.restaurantTitle}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    makeRemoteRequest();
  }, []);

  backButtonEffect = () => {
    ToastAndroid.show("Press Back again to Exit", ToastAndroid.SHORT);
    setBackClickCount(1);
    setTimeout(function() {
      setBackClickCount(0);
    }, 1000);
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

  return (
    <View style={styles.container}>
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
          <Text>V's Pick</Text>
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
    height: 400,
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
