import React, { Component } from "react";
import {
  View,
  Text,StyleSheet, Dimensions ,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  UIManager,
  LayoutAnimation
} from "react-native";
import PropTypes from "prop-types";

import { Info, Plus, Star } from "../../assets/icons";
import { moderateScale } from "../Utils/fontScaling";
import Colors from "../../assets/Colors";
import { WIDTH, HEIGHT, fontStyle } from "../Utils/theme";
import {responsiveHeight} from "../_constants/dimensions";
class Card extends Component {
  constructor() {
    super();

    this.state = {};

    UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  componentDidMount = async() =>{
    var CustomLayoutSpring = {
      duration: 600,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.8
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.8
      },
      delete: {
        duration: 600,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    };
    LayoutAnimation.configureNext(CustomLayoutSpring);
  }
  componentWillUnmount() {
   }
  render() {
    const {
      item,
      optionBtn,
      onPressCategory,
      onPressInfo,
      onAdd,
      onFavourite
    } = this.props;

    return (
        <View style={styles.cardContainer}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <View style={styles.imgContainer}>
            <TouchableHighlight
                underlayColor={!optionBtn ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)"}
                onPress={() => {
                  if (!optionBtn) {
                    onPressCategory();
                  } else {
                    this.props.onAdd();
                  }
                }}
            >
            <Image
                  style={styles.imgStyle}
                  source={{uri:  item.image}}
              />
             
            </TouchableHighlight>

            {optionBtn && (
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                      style={styles.optionBtnStyle}
                      onPress={onPressInfo}
                  >
                    <Info iconColor={"white"} onPress={onPressInfo} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionBtnStyle} onPress={onAdd}>
                    <Plus iconColor={"white"} onPress={onAdd} />
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.optionBtnStyle}
                      onPress={onFavourite}
                  >
                    <Star iconColor={item.is_favourite==='1'?"red":'white'} onPress={onFavourite} />
                  </TouchableOpacity>
                </View>
            )}
          </View>
        </View>
    );
  }
}

Card.propTypes = {
  optionBtn: PropTypes.bool,
  onPressCategory: PropTypes.func,
  onPressInfo: PropTypes.func,
  onAdd: PropTypes.func,
  onFavourite: PropTypes.func
};

Card.defaultProps = {
  optionBtn: false,
  onPressCategory: () => {},
  onPressInfo: () => {},
  onAdd: () => {},
  onFavourite: () => {}
};
const styles = StyleSheet.create({
    cardContainer: {
      margin: moderateScale(5),
      alignItems: "center",
      justifyContent: "center"
    },
  
    categoryName: {
      fontSize: moderateScale(14),
     
      color: Colors.themeDark,
      marginBottom: moderateScale(5)
    },
  
    imgContainer: {
      elevation: 3,
      backgroundColor: "white",
      borderRadius: moderateScale(6),
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: {
        width: 0,
        height: 3
      }
    },
  
    imgStyle: {
      height: responsiveHeight(22),
      width: WIDTH() * 0.35,
      resizeMode: "cover",
      borderRadius: moderateScale(6)
    },
  
    btnContainer: {
      position: "absolute",
      width: WIDTH() * 0.35,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: moderateScale(5),
      borderBottomRightRadius: moderateScale(6),
      borderBottomLeftRadius: moderateScale(6)
    },
  
    optionBtnStyle: {
      padding: moderateScale(5)
    }
  });
  
export default Card;
