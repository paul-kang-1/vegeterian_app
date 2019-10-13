import React from 'react';
import { View, Text ,Button} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MemberScreen from './screen_member/member.js'; // 사용 할려면 매번 import 해와야함 
import RecoScreen from './screen_reco/reco.js';



class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen1</Text>
        <Button
         title={"to reco"}
         onPress={()=> this.props.navigation.navigate('Recommend')}
         />

         <Button
         title={"to member"}
         onPress={()=> this.props.navigation.navigate('member')} //  버튼 on press 는 누가봐도 알겠고 ㅋㅋ navigation 이 이제 화면간 이동 할때 쓰는건데   this 는 이함수를 가르치는거고 , prop 은 자식 , 잘 모르겠으면 자세한건 만나서 설명해드림
         />
         
         
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