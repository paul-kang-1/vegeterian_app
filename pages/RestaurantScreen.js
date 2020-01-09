import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import firebase, { firestore, storage } from "firebase";

const RestaurantScreen = ({ navigation, route }) => {
  const [urlList, setUrlList] = useState([]);
  const { item } = route.params;
  async function listurl(id) {
    const storageRef = storage().ref(id);
    const result = await storageRef.listAll();
    const itemList = result.items;
    var res = [];
    for (var i = 0; i < itemList.length; i++) {
      var url = await itemList[i].getDownloadURL();
      res.push(url);
    }
    //console.log(urlList)
    return res;
  }

  useEffect(() => {
    console.log("useeffect called");
    (async () => {
      setUrlList(await listurl(item.id + "/"));
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{urlList}</Text>
      <Button title={item.id} onPress={() => navigation.goBack()} />
    </View>
  );
};
export default RestaurantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
