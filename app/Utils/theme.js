import { Dimensions } from "react-native";
import { moderateScale } from "../Utils/fontScaling.js";
const { width, height } = Dimensions.get("window");

let deviceHeight = () => {
  return height  
};

let devicewidth = () => {
  if (height > width) {
    return width;
  } else {
    return height;
  }
};

const WIDTH = devicewidth;
const HEIGHT = deviceHeight;
const KEYBOARDOFFSET = ((((HEIGHT() * 0.12)/2) + 10)+(moderateScale(28) + ((HEIGHT() * 0.0075)*2)));

// TODO: set application related fontStyle here
const fontStyle = {
  OswaldExtraLight: "Oswald-ExtraLight",
  OswaldLight: "Oswald-Light",
  OswaldRegular: "Oswald-Regular",
  OswaldMedium: "Oswald-Medium",
  OswaldSemiBold: "Oswald-SemiBold",
  OswaldBold: "Oswald-Bold"
};

module.exports = {
  WIDTH,
  HEIGHT,
  KEYBOARDOFFSET,
  fontStyle
};
