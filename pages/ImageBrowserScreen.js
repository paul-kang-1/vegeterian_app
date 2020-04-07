import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { ImageBrowser } from "expo-image-picker-multiple";
import Constants from "expo-constants";

const ImageBrowserScreen = ({ navigation, route }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState();
  const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
  const renderSelectedComponent = number => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );
  const updateHandler = (count, onSubmit) => {
    setCount(count);
    setSubmit(() => onSubmit);
    console.log(onSubmit);
  };

  function goBack(photos) {
    navigation.goBack();
    route.params.imgCallBack(photos);
  }

  const imagesCallback = callback => {
    callback
      .then(async photos => {
        setLoading(true);
        const cPhotos = [];
        for (let photo of photos) {
          const pPhoto = await _processImageAsync(photo.uri);
          //   console.log(pPhoto.uri);
          cPhotos.push({
            uri: pPhoto.uri,
            name: photo.filename,
            type: "image/jpg"
          });
        }
        goBack(cPhotos);
      })
      .catch(e => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  };

  async function _processImageAsync(uri) {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Cancel</Text>
        </TouchableWithoutFeedback>
        <Text style={styles.headerText}>Selected {count}/5 Images</Text>
        {loading ? (
          <React.Fragment>
            <View style={styles.loading}>
              <ActivityIndicator size="small" color={"#0580FF"} />
            </View>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TouchableWithoutFeedback onPress={submit}>
              <Text style={styles.headerText}>Done</Text>
            </TouchableWithoutFeedback>
          </React.Fragment>
        )}
      </View>

      <View style={styles.flex}>
        <ImageBrowser
          max={5}
          onChange={updateHandler}
          callback={imagesCallback}
          renderSelectedComponent={renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
        />
      </View>
    </View>
  );
};
export default ImageBrowserScreen;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    marginTop: Constants.statusBarHeight
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    justifyContent: "center",
    backgroundColor: "#0580FF"
  },
  countBadgeText: {
    fontFamily: "Roboto-Bold",
    alignSelf: "center",
    padding: "auto",
    color: "white"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerText: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    marginVertical: 20,
    marginHorizontal: "6%"
  },
  loading: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center"
  }
});
