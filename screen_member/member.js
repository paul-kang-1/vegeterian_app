import React from 'react';
import { View, Text } from 'react-native';
import firebase, { storage } from "../firebase"; //firebase 는 로드를 한거고  firebase.js 에 설정을 해놓았습니다 
import *  as Font from'expo-font'

class MemberScreen extends React.Component {

  constructor(props) {  //constructor 설정은 state 를 위한 것이면 이 class 안에 있는 전역 변수? 즉 state  를 설정하여 해당 class 안에서 번갈아가면서 사용하기를 위함 입니다 
    super(props);

    this.state = {
      text: "",

    };

  }

  _Loaddata() {
    var m;
    var usersRef = firebase.database().ref('restaurant'); // 데이터 베이스 restaurant 에 있는  데이터 끌어오기 
    usersRef.on('value', (snapshot) => {
      m = snapshot.val()



      alert(JSON.stringify(m.res1));

    });

  }
  render() {



    console.log("?");

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>MemberScreen</Text>
        {this._Loaddata()}

        <Text>{this._Loaddata()}</Text>

      </View>
    );
  }
}




export default MemberScreen; 