import firebase, { googleProvider, facebookProvider } from "../firebase";
import * as Facebook from "expo-facebook";

const LoadingScreen = ({ navigation }) => {
  const signInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync("444233602924989");
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        "444233602924989",
        {
          permissions: ["public_profile", "email"]
        }
      );
      if (type === "success") {
        const credential = facebookProvider.credential(token);
        onSignInFB(credential);
      } else {
        Alert.alert('FB sign-in failed')
      }
    } catch ({ message }) {
      console.log(`Facebook 1 Error: ${message}`);
      Alert.alert(`first ${message}`);
    }
  };

  const onSignInFB = credential => {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(function() {
        navigation.navigate("Home");
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  };



  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "386677764344-4f2lfkvaupm96uih0rg1afr5qh4o1fb0.apps.googleusercontent.com",
        iosClientId:
          "386677764344-oeoovf93253f509banm2rgl32l54fkj0.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        onSignIn(result);
        //console.log(result.user.photoUrl)
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    loadFonts();
    console.disableYellowBox = true;
  }, []);

  const checkIfLoggedIn = () => {
    if (firebase.auth().currentUser != null) {
      //setHomescreen(true);
      console.log("The object is", firebase.auth().currentUser);
      navigation.navigate("Home");
    } else {
      alert("user is null");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image
          style={styles.backgroundImage}
          source={require("../assets/images/loading_bg.png")}
        />
      </View>
      <View style={styles.backgroundContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/images/app_title.png")}
        />
      </View>
      {showLogin ? (
        <React.Fragment>
          <View style={{ flex: 1 }} />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.loginText}>Start With:</Text>
            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={() => signInWithFacebook()}
            >
              <Image
                style={styles.LoginButton}
                resizeMode={"contain"}
                source={require("../assets/images/facebook_login.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={() => signInWithGoogleAsync()}
            >
              <Image
                style={styles.LoginButton}
                source={require("../assets/images/google_login.png")}
              />
            </TouchableOpacity>
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        </React.Fragment>
      )}
    </View>
  );
};

export default LoadingScreen;
