import React, { Component } from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";
import Colors from "../../assets/Colors.js";

class Plus extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { iconColor, style, onPress } = this.props;
    return (
      <Svg
        viewBox="0 0 24 24"
        style={[styles.svgStyle, style]}
        onPress={onPress}
      >
        <Path fill={iconColor} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </Svg>
    );
  }
}

const styles = {
  svgStyle: {
    opacity: 1,
    width: 24,
    height: 24,
    fontSize: 24
  }
};

Plus.propTypes = {
  style: PropTypes.object,
  iconColor: PropTypes.string,
  onPress: PropTypes.func
};
Plus.defaultProps = { style: {}, onPress: () => {}, iconColor: "black" };

export default Plus;
