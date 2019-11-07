import React from 'react';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator } from 'react-native';  
import firebase from '../firebase';
import { firebaseConfig } from '../config';
import HomeScreen from './HomeScreen';
import * as Google from 'expo-google-app-auth';



export default class LoadingScreen extends React.Component{
    signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            behavior: 'web',
            androidClientId: '386677764344-4f2lfkvaupm96uih0rg1afr5qh4o1fb0.apps.googleusercontent.com',
            iosClientId: '386677764344-oeoovf93253f509banm2rgl32l54fkj0.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
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
                                <Image style={styles.loginButton} source={require('../assets/images/facebook_login.png')}/>
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