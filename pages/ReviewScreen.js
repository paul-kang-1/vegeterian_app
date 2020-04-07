import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput
} from "react-native";
import Constants from "expo-constants";
import StarRating from "react-native-star-rating";

const ReviewScreen = ({ navigation, route }) => {
  const { name } = route.params;
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

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
        ></TextInput>
        <TouchableWithoutFeedback onPress={()=>navigation.navigate("ImageBrowser")}>
          <Image
            source={require("../assets/icons/button_addImage.png")}
            style={{ width: "15%" }}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};
export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.statusBarHeight,
    padding: 15,
    backgroundColor: "#FF4D12"
  },
  sectionTitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: "white"
  },
  cancelText: {
    fontFamily: "Roboto-Light",
    fontSize: 20
  },
  sectionCard: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
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
    flex: 0.8,
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#ADADAD",
    borderRadius: 15,
    padding: 15,
    fontFamily: "Roboto-Regular",
    fontSize: 15
  }
});
