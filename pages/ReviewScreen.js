import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView
} from "react-native";
import Constants from "expo-constants";
import StarRating from "react-native-star-rating";

const ReviewScreen = ({ navigation, route }) => {
  const { name } = route.params;
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [images, setImages] = useState([]);

  function imgCallBack(data) {
    setImages(data);
  }

  function renderImage(item, i) {
    return (
      <Image
        style={{ height: 100, width: 100, margin: 2.5 }}
        source={{ uri: item.uri }}
        key={i}
      />
    );
  }
  function onSaveButtonPress() {}

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Rate & Review</Text>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.restaurantTitle}>{name}</Text>
        <View style={{ paddingHorizontal: 40, paddingVertical: 10 }}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            selectedStar={rating => setRating(rating)}
            fullStarColor={"#FF4D12"}
            halfStarEnabled={true}
          />
        </View>
        <Text style={styles.ratingText}>
          Touch the Stars to Rate Your Experience!
        </Text>
        <TextInput
          style={styles.reviewTextInput}
          onChangeText={text => setReview(text)}
          multiline={true}
          textAlignVertical="top"
          placeholder={"Type your review here!"}
          maxLength={10000}
        ></TextInput>
        <Text style={styles.letterCount}>{review.length}/10000 Characters</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate("ImageBrowser", {
                imgCallBack: imgCallBack
              })
            }
          >
            <Image
              source={require("../assets/icons/button_addImage.png")}
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => onSaveButtonPress()}>
            <Image
              source={require("../assets/icons/button_saveReview.png")}
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </View>
        {images.length ? (
          <View>
            <ScrollView horizontal={true}>
              {images.map((item, i) => renderImage(item, i))}
            </ScrollView>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};
export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    minHeight: 600,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.statusBarHeight,
    padding: 15,
    backgroundColor: "white"
  },
  sectionTitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: "#FF4D12"
  },
  cancelText: {
    fontFamily: "Roboto-Light",
    fontSize: 20
  },
  sectionCard: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    borderColor: "#FF4D12",
    borderWidth: 1.2,
    marginTop: 10,
    borderRadius: 15,
    padding: 15
  },
  restaurantTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 30
  },
  ratingText: {
    alignSelf: "center",
    color: "#949191",
    fontFamily: "Roboto-Light",
    paddingBottom: 10
  },
  reviewTextInput: {
    flex: 1,
    minHeight: 250,
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#ADADAD",
    borderRadius: 15,
    padding: 15,
    fontFamily: "Roboto-Regular",
    fontSize: 15
  },
  buttonImage: {
    width: 75,
    height: 75,
    marginRight: 10,
    alignSelf: "center",
    marginTop: 10
  },
  letterCount: {
    alignSelf: "center",
    fontFamily: "Roboto-Light",
    color: "#949191"
  }
});
