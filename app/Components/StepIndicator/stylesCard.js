import { StyleSheet, Dimensions } from "react-native";
import { moderateScale } from "../../Utils/fontScaling";
import { WIDTH, HEIGHT, fontStyle } from "../../Utils/theme";
import Colors from "../../../assets/Colors";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "../../_constants/dimensions";


const stylesCard = StyleSheet.create({
  CardHeader: {
    width: responsiveWidth(65),
    height:WIDTH>HEIGHT?responsiveHeight(20):responsiveHeight(15),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.stepHeaderBG,
    borderRadius: moderateScale(6),
    elevation: 6,
  },

  headerStyle: {
    marginVertical: responsiveHeight(0.2),
    color: "white",
    fontSize: moderateScale(16),
    
  },

  contentContainerStyle: {
    // marginLeft:responsiveHeight(1),
    width: "100%",
    flexDirection: "row",
    marginVertical: responsiveHeight(0.2)
  },

  baseViewStyle: {
    flex:1, 
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginVertical: 5,
    marginHorizontal: responsiveWidth(3)
  },

  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 5
  },

  stepNumber: {
    height: moderateScale(25),
    width: moderateScale(25),
    borderRadius: moderateScale(25/2),
    alignItems: "center",
    justifyContent: "center"
  },

  stepNumberStyle: {
    color: "white",

    fontSize: responsiveFontSize(1.4),
  },

  stepNameStyle: {
    fontSize: responsiveFontSize(1.8),
    color: "white",
   
    paddingLeft: 5
  },

  separator: {
    marginTop:responsiveHeight(1),
    marginLeft:responsiveWidth(0.3),
    marginRight:responsiveWidth(0.3),
    alignSelf:'center',
    flex:1,
    height: 1,
    backgroundColor: "white"
  }
});

export default stylesCard;
