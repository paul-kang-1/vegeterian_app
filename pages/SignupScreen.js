import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

const SignupScreen = ({navigation}) => (
    <View style={styles.container}>
        <Text>SignupScreen</Text>
    </View>
    )
export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});