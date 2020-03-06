import * as React from "react";
import { View, Dimensions, Image, StyleSheet, FlatList } from "react-native";

export const DEVICE_WIDTH = Dimensions.get("window").width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

class BGCarousel extends React.Component {
  ScrollRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }

  setSelectedIndex = event => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const selectedIndex = Math.floor(contentOffset/viewSize);
    this.setState({selectedIndex});
  }

  render() {
    const { images } = this.props;
    const { selectedIndex } = this.state;
    return (
      <View style={{ height: "100%", width: "100%" }}>
        <FlatList
          horizontal={true}
          pagingEnabled={true}
          data={images}
          onMomentumScrollEnd={this.setSelectedIndex}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ height: "100%", width: DEVICE_WIDTH}}
              key={{item}}
            />
          )}
          keyExtractor={(images, index)=> index.toString()}
        />
        <View style={styles.circleDiv}>
          {images.map((image, i) => (
            <View
              key={image}
              style={
                [styles.whiteCircle, { opacity: i === selectedIndex ? 0.5 : 1 }]
              }
            />
          ))}
        </View>
      </View>
    );
  }
}

export default BGCarousel;

const styles = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    width: DEVICE_WIDTH
  },
  circleDiv: {
    position: "absolute",
    bottom: 15,
    height: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  whiteCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: "#FFFFFF"
  }
});
