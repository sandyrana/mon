import React, { Component } from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

class Close extends Component {
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
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
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

Close.propTypes = {
  style: PropTypes.object,
  iconColor: PropTypes.string,
  onPress: PropTypes.func
};
Close.defaultProps = { style: {}, onPress: () => {}, iconColor: "black" };

export default Close;
