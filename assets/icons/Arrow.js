
import React, { Component } from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";
import Colors from "../../assets/Colors.js";

class Arrow extends Component {
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
        <Path
          fill={iconColor}
          d="M14 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"
        />
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

Arrow.propTypes = {
  style: PropTypes.object,
  iconColor: PropTypes.string,
  onPress: PropTypes.func
};
Arrow.defaultProps = { style: {}, onPress: () => {}, iconColor: "black" };

export default Arrow;
