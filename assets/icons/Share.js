import React, { Component } from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";
class Share extends Component {
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
          d="m385.513,301.214c-27.438,0 -51.64,13.072 -67.452,33.09l-146.66,-75.002c1.92,-7.161 3.3,-14.56 3.3,-22.347c0,-8.477 -1.639,-16.458 -3.926,-24.224l146.013,-74.656c15.725,20.924 40.553,34.6 68.746,34.6c47.758,0 86.391,-38.633 86.391,-86.348c0.001,-47.672 -38.633,-86.327 -86.39,-86.327c-47.65,0 -86.326,38.655 -86.326,86.326c0,7.809 1.381,15.229 3.322,22.412l-146.639,75.002c-15.833,-20.039 -40.079,-33.154 -67.56,-33.154c-47.715,0 -86.326,38.676 -86.326,86.369s38.612,86.348 86.326,86.348c28.236,0 53.043,-13.719 68.832,-34.664l145.948,74.656c-2.287,7.744 -3.947,15.79 -3.947,24.289c0,47.693 38.676,86.348 86.326,86.348c47.758,0 86.391,-38.655 86.391,-86.348c0.022,-47.736 -38.611,-86.37 -86.369,-86.37z"
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

Share.propTypes = {
  style: PropTypes.object,
  iconColor: PropTypes.string,
  onPress: PropTypes.func
};
Share.defaultProps = { style: {}, onPress: () => {}, iconColor: "black" };

export default Share;
