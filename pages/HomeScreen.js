import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image
} from "react-native";
import firebase, { storage } from "../firebase";

class HomeScreen extends Component {


  constructor(props) {
    super(props);

    this.state = {

      datasource: [],

    };
  }
  componentDidMount() {

    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {





    var usersRef = firebase.database().ref('resaturant');


    usersRef.on('value', (snapshot) => {


      var m = snapshot.val()
      var keys = Object.values(m);

      this.setState({
        datasource: keys
      })
    });
  }
  renderItem = ({ item }) => {
    let dimensions = Dimensions.get("window");
    let imageheight = 2 * dimensions.height / 14
    let imagewidth = dimensions.width - 30;
    return (
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => { }




        }
      >
        <ImageBackground style={{
          height: imageheight, width: imagewidth,
        }}
          imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          source={{ uri: item.image }}>
          <View style={{ flex: 1, marginLeft: 10, marginBottom: 6, borderColor: 'black' }} >





          </View>
        </ImageBackground>
        <View style={{ borderBottomWidth: 2, borderLeftWidth: 1, borderRightWidth: 1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: imageheight / 2 }}>
          <View  >
            <Text>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>




    )



  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 200 }}>homescreen</Text>
        <FlatList

          data={this.state.datasource}

          renderItem={this.renderItem}


          keyExtractor={item => item.name}
          initialNumToRender={4}
          maxToRenderPerBatch={4}

          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}

          onEndReachedThreshold={10000000}


        />

      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  icon: {
    height: 70,
    width: 70
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});