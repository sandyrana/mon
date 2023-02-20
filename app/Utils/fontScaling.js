import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

let deviceHeight = Dimensions.get("window").height;
let devicewidth = Dimensions.get("window").width;
let heightOne = () => {
  if (deviceHeight > devicewidth) {
    return devicewidth;
  } else {
    return deviceHeight;
  }
};

let widthOne = () => {
  if (deviceHeight > devicewidth) {
    return devicewidth;
  } else {
    return deviceHeight;
  }
};

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (widthOne() / guidelineBaseWidth) * size;
const verticalScale = size => (heightOne() / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
