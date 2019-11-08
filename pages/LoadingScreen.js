import React from 'react';
<<<<<<< HEAD
import { StyleSheet, Text, View, Button, Image, ActivityIndicator,TouchableOpacity } from 'react-native';  
import firebase from '../firebase';
=======
import { StyleSheet, Text, View, Button, Image, ActivityIndicator } from 'react-native';  
import firebase, { googleProvider } from '../firebase';
>>>>>>> 2f944b8752fede488c9c53666dbf2f1a02d56ce4
import { firebaseConfig } from '../config';
import HomeScreen from './HomeScreen';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

<<<<<<< HEAD


export default class LoadingScreen extends React.Component{

    async  signInWithFacebook() {
        const { navigation } = this.props;
        try {
          const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync('1998302263810491', {
            permissions: ['public_profile','email'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
           // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
           const response = await fetch(
            `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`
          );
           
            const responseJSON = JSON.stringify(await response.json());
            console.log(responseJSON);
            var obj = JSON.parse(responseJSON);
            console.log(obj.name);
            console.log(obj.email);
            console.log(obj.picture.data.url);
             alert(obj.name);
           
           
    
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          console.log(`Facebook 1 Error: ${message}`);
          alert("fisrt ${message}");
        }
    
     
        
    
    
    
    
    
    
    
          
    
    
    
    
    
      }
=======

export default class LoadingScreen extends React.Component{
    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === googleProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }
    onSignIn = googleUser => {
        //console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            const credential = googleProvider.credential(
                googleUser.idToken, googleUser.accessToken);
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential)
            .then(function(){console.log('User Signed In');})
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this));
    }

>>>>>>> 2f944b8752fede488c9c53666dbf2f1a02d56ce4
    signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            androidClientId: '386677764344-4f2lfkvaupm96uih0rg1afr5qh4o1fb0.apps.googleusercontent.com',
            iosClientId: '386677764344-oeoovf93253f509banm2rgl32l54fkj0.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
    }
      
    state = { toHomeScreen: false }
    componentDidMount(){
      this.checkIfLoggedIn();
    }
    checkIfLoggedIn = () => { 
        
       if( firebase.auth().currentUser!=null){
        this.setState({ toHomeScreen: true })                         
       }else {
        this.setState({ toHomeScreen: false }) 
        }
         
    }

    render(){
        const { toHomeScreen } = this.state
        return(
            toHomeScreen? <HomeScreen/>
            :   <View style={styles.container}>
                    <View style={styles.backgroundContainer}>
                        <Image style={styles.backgroundImage} source={require('../assets/images/loading_bg.png')}/>
                    </View>
                    <View style={styles.backgroundContainer}>
                        <Image style={styles.logo} source={require('../assets/images/app_title.png')}/>
                    </View>
                    {this.props.showLogin?
                        <React.Fragment>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 1, justifyContent: "center"}}>
                                <Text  style={styles.loginText}>Log in With:</Text>
                                <TouchableOpacity
                                
                                onPress={()=> this.signInWithFacebook()}>
                                <Image style={styles.loginButton} source={require('../assets/images/facebook_login.png')}/>
                                </TouchableOpacity>
                                <Button title='Sign in with Google' 
                                onPress={()=> this.signInWithGoogleAsync()}/>
                            </View>
                        </React.Fragment>
                    :   <React.Fragment>  
                            <View style={{flex: 1}}/>
                            <View style={{flex: 1, justifyContent: "center"}}>
                                <ActivityIndicator size="large"/>
                            </View>
                        </React.Fragment> 
                    }
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        justifyContent:"center"
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    backgroundImage: {
        width: '100%',
        height: '100%'
    },
    overlay: {
        justifyContent: "center",
        //alignItems: "center",
    },
    logo: {
        alignSelf: "center",
        flex: 1,
        aspectRatio: 1/4,
        resizeMode: "contain"
    },
    loginButton: {
        marginBottom: 15
    },
    loginText: {
        color: "white",
        alignSelf: "center",
        marginBottom: 15,
        fontSize: 18,
        fontFamily: 'AlegreyaSans-Regular', 
    }
})