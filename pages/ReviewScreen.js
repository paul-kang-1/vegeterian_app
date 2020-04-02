import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

const ReviewScreen = ({navigation}) => (
    <View style={styles.container}>
        <Text>ReviewScreen</Text>
    </View>
    )
export default ReviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});