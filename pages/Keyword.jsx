import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Keyword = props => {
  const { keywords } = props;
  return (
    <React.Fragment>
      <View style={styles.restaurantKeywordContainer}>
        {keywords.map((item, key) => (
          <View key={key} style={styles.restaurantKeyword}>
            <Text key={key} style={styles.restaurantKeywordText}>
              {" "}
              {item}{" "}
            </Text>
          </View>
        ))}
      </View>
    </React.Fragment>
  );
};
export default Keyword;

const styles = StyleSheet.create({
  restaurantKeywordText: {
    fontSize: 12,
    fontFamily: "Roboto-Medium"
  },
  restaurantKeywordContainer: {
    flexDirection: "row",
    marginBottom: 10
  },
  restaurantKeyword: {
    backgroundColor: "#E1E1E1",
    marginRight:10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 15
  }
});
