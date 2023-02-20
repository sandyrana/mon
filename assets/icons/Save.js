import React, { Component } from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";
import Colors from "../../assets/Colors.js";

class Save extends Component {
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
          d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
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

Save.propTypes = {
  style: PropTypes.object,
  iconColor: PropTypes.string,
  onPress: PropTypes.func
};
Save.defaultProps = { style: {}, onPress: () => {}, iconColor: "black" };

export default Save;
