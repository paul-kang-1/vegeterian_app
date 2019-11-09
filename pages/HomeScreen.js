import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
     TouchableOpacity ,
     Image
} from "react-native";
import  firebase,{storage}  from "../firebase";

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
    
    
     var m=snapshot.val() 
     var keys= Object.values(m);
    
  this.setState({
    datasource:  keys
  })
});
}
renderItem =({item})=>{

    return(
      <TouchableOpacity
      onPress={() => {}

    
     
   
   }
      >
     <View  style={{  flex:1,  marginLeft:10,marginBottom:6,borderColor:'black'}} >
             <Image  style={styles.icon}
                   source={{uri:item.image}}
            
            />
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
                <Text>homescreen</Text>
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
    icon:{
        height:70,
        width:70
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});