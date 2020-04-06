import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

const ForgotPasswordScreen = (props) => (
    <View style={styles.container}>
        <Text>ForgotPasswordScreen</Text>
    </View>
    )
export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});