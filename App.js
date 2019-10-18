import React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MemberScreen from './screen_member/member.js'; // 사용 할려면 매번 import 해와야함 
import RecoScreen from './screen_reco/reco.js';
import *  as Font from'expo-font' // 이것도 yarn add 해서 다운 받은거 입니다 


class HomeScreen extends React.Component {



  componentWillMount() {   // willmount 랑 didmount 의 차이가 있는데 굳이 이해는 안해도 되지만 그냥 render 하기 전에 먼저  실행되는 함수와 그 후에 실행되는 함수라고 알고있음 됩니다 
    this.loadFonts();
  }
  async loadFonts() {
    await Expo.Font.loadAsync({


      'example2-font': require('./assets/fonts/BebasNeue-Regular.ttf'),
      'example-font': require('./assets/fonts/Bayon.ttf'),  // 폰트 끌어오기 
      

    });
  }



  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen1</Text>
        <Button
          title={"to reco"}
          onPress={() => this.props.navigation.navigate('Recommend')}
        />

        <Button
          title={"to member"}
          onPress={() => this.props.navigation.navigate('member')} //  버튼 on press 는 누가봐도 알겠고 ㅋㅋ navigation 이 이제 화면간 이동 할때 쓰는건데   this 는 이함수를 가르치는거고 , prop 은 자식 , 잘 모르겠으면 자세한건 만나서 설명해드림
        />
        <TouchableOpacity>

          <Image
            source={require("./assets/plate.png")} //TouchableOpacity  가 이제 버튼인데 안에 컴포넌트로 이미지를 넣으면 내가 원하는 모양의 버튼을 만들수 있는 컴포넌트 이미지 사용법은 이거 처럼  require("./as/as") 이러던가  source={{uri:"www.naver.com"}}
          ></Image>
        </TouchableOpacity>




      </View>
    );
  }
}



// 총 몇가지 종류의 화면이 있는지 설정하는 부분 aka 대분류 
// 일단 크게 홈화면, 그리고 음식점 추천 화면 그리고 개인 계정 부분이 있다고 설정하였음
//  ooscreen 은 컴포넌트로서 하나의 js 에 하나 씩 밖에 존재할수 없음 
//  위에 import 부분 보면 다른 파일에서 설정한 reco 와 member  가 있음 
const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Recommend: {
    screen: RecoScreen,
  },
  member: {
    screen: MemberScreen,
  },

});

export default createAppContainer(AppNavigator); 