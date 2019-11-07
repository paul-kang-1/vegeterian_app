import React from 'react'; 
import * as Location from 'expo-location';
import axios from 'axios';
import LoadingScreen from "./pages/LoadingScreen";


const MAP_API = '0abbbf5654f34e6dbb2606e6765f5614';

export default class App extends React.Component{
  state = {
    isLoading: true,
    fontLoaded: false,
    showLogin: false,
    toHomeScreen: false
  }
  getAddress = async(latitude, longitude) => {
    const { 
      data: { results }
    } = await axios.get(`http://api.opencagedata.com/geocode/v1/json?key=${MAP_API}&q=${latitude}%2C${longitude}&pretty=1`);
    const comp = results[0].components;
    if (comp.town){ 
      address = comp.town;
    } else if (comp.neighborhood){
      address = comp.neighborhood;
    } else if (comp.county) {
      address = comp.county;
    } else {
      address = comp.city;
    }
    this.setState({ isLoading: false, address: address});
  }
  getLocation = async() => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getAddress(latitude, longitude);
    } catch (error) {
      Alert.alert("Permission denied!")      
    }
  }
  async loadFonts() {
    await Expo.Font.loadAsync({
      'AlegreyaSans-Regular': require('./assets/fonts/AlegreyaSans-Regular.ttf')
    });
  }
  componentDidMount(){
    this.getLocation();
    this.loadFonts();
  }
  render(){
    const { isLoading } = this.state;
    return isLoading? <LoadingScreen/>: <LoadingScreen showLogin={true}/>;
  }
}