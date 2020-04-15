import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import Collapsible from "react-native-collapsible";

const GetWeekSchedule = props => {
  const { sun, mon, tue, wed, thu, fri, sat } = props.schedule;
  const scheduleToArray = [sun, mon, tue, wed, thu, fri, sat];
  const result = getDaySchedule(scheduleToArray);
  return (
    <View style={styles.container}>
      <Text style={styles.headerFont}>{result.headerText}</Text>
      <TouchableWithoutFeedback onPress={() => props.onStateChange()}>
        {props.isCollapsed ? (
          <View style={{ width: "50%", alignSelf: "center" }}>
            <Image
              style={{ width: 30, height: 30, alignSelf: "center" }}
              source={require("../assets/icons/button_show.png")}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={{ width: "50%", alignSelf: "center" }}>
            <Image
              style={{ width: 30, height: 30, alignSelf: "center" }}
              source={require("../assets/icons/button_hide.png")}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableWithoutFeedback>
      <Collapsible collapsed={props.isCollapsed}>
        <View>
          {result.content.map((val, i) => {
            return (
              <Text key={i} style={styles.scheduleFont}>
                {val}
              </Text>
            );
          })}
        </View>
      </Collapsible>
    </View>
  );
};

function getDaySchedule(scheduleToArray) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let d = new Date().getDay();
  const today = scheduleToArray[d];
  const todayToString = weekday[d];
  let result = {};
  result.headerText = todaySchedule(today, todayToString);
  scheduleToArray.splice(d, 1);
  weekday.splice(d, 1);
  var newArray = weekday.map((e, i) => [e, scheduleToArray[i]]);
  result.content = [];
  for (let item of newArray) {
    result.content.push(todaySchedule(item[1], item[0]));
  }
  return result;
}

function todaySchedule(today, todayToString) {
  if (today === null) {
    return `${todayToString}: Closed`;
  } else if (today.length === 2) {
    return `${todayToString}:\nOpen: ${numToTime(today[0])} - ${numToTime(
      today[1]
    )}`;
  } else {
    return `${todayToString}:\nOpen: ${numToTime(today[0])} - ${numToTime(
      today[1]
    )} / Break: ${numToTime(today[2])} - ${numToTime(today[3])}`;
  }
}

function numToTime(num) {
  let timePeriod = num < 1200 ? "am" : "pm";
  let numStr = num.toString();
  let [hour, min] = splitAt(-2)(numStr);
  hour = parseInt(hour) % 12 === 0 ? 12 : parseInt(hour) % 12;
  return min == 0
    ? hour + " " + timePeriod
    : hour + ":" + min + " " + timePeriod;
}

const splitAt = index => x => [x.slice(0, index), x.slice(index)];

export default GetWeekSchedule;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderColor: "#FF4D12",
    borderWidth: 1,
    padding: 10
  },
  scheduleFont: { fontSize: 15, fontFamily: "Roboto-Light", paddingBottom: 5 },
  headerFont: { fontSize: 15, fontFamily: "Roboto-Regular" }
});
