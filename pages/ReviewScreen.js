import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  ToastAndroid,
  Platform,
  AlertIOS
} from "react-native";
import Constants from "expo-constants";
import StarRating from "react-native-star-rating";
import firebase from "firebase";

const ReviewScreen = ({ navigation, route }) => {
  const { name: restaurantName } = route.params;
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [images, setImages] = useState([]);
  const uid = firebase.auth().currentUser.uid;

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

  async function uploadImage(uri, imageName) {
    const response = await fetch(uri);
    const blob = await response.blob();
    //***THE IMAGE UPLOAD PATH IS CURRENTLY SET TO A TEST PATH***
    let ref = firebase
      .storage()
      .ref()
      .child(`images/${restaurantName}/${imageName}`);
    return ref.put(blob);
  }

  async function getImageUrlList() {
    let result = [];
    for (let item of images) {
      await uploadImage(item.uri, item.name)
        .then(snapshot => {
          return snapshot.ref.getDownloadURL();
        })
        .then(downloadURL => {
          console.log(`download available at ${downloadURL}`);
          result.push(downloadURL);
        })
        .catch(err => {
          console.error(err);
        });
    }
    return Promise.all(result);
  }

  async function addReviewForUserDoc(ref) {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .update({
        reviews: firebase.firestore.FieldValue.arrayUnion(ref.id)
      })
      .catch(err => {
        console.error(err);
      });
  }

  async function addReviewForReviewDoc(ref, urlList) {
    ref
      .set({
        review: review,
        photos: urlList,
        rating: rating,
        userID: uid,
        likes: 0,
        time: firebase.firestore.FieldValue.serverTimestamp(),
        restaurant: restaurantName
      })
      .catch(err => {
        console.error(err);
      });
  }

  async function addReview(urlList) {
    const reviewRef = firebase
      .firestore()
      .collection("reviews")
      .doc();
    await addReviewForUserDoc(reviewRef, uid);
    await addReviewForReviewDoc(reviewRef, urlList, uid);
    return;
  }

  function onSaveButtonPress() {
    if (review.length < 40)
      notifyMessage("The review should be at least \n40 characters long 😔");
    else {
      navigation.goBack();
      getImageUrlList()
        .then(urlList => addReview(urlList))
        .then(() => notifyMessage("Review saved! 🥰"))
        .catch(err => {
          console.error(err);
        });
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Rate & Review</Text>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.restaurantTitle}>{restaurantName}</Text>
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
