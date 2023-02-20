import React, { Component } from 'react';
import { SafeAreaView,KeyboardAvoidingView,StyleSheet,FloatingInput,
    ScrollView,View,Text,Alert,TouchableOpacity,BackHandler, 
} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { Call, Info, Invisible, Mail} from "../../assets/icons";
import FastImage from "react-native-fast-image";
import Icon from 'react-native-vector-icons/FontAwesome';
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import NetInfo from "@react-native-community/netinfo";
import StepIndicator from "../Components/StepIndicator";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Loader from "../Utils/Loader.js";
const backAction = () => {
  Actions.pop()
    return true;
  };
export default class test extends Component {
    constructor(props) {
        super(props);
        this.state = {
          emailAvailable: true,
          inValidEmail :false,
          inValidPhone: false,
          inValidPwd: false,
          isSecure :false,
          validInfo :false,
          };
    };
    componentDidMount = async() =>{
        BackHandler.addEventListener("hardwareBackPress", backAction);
      
     
      }
      componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", backAction); 
       }
   
    
    render() {
        return (
            <View style={{flex:1}}>
            <SafeAreaView style={{ flex: 1 }}>
              <FastImage style={{ flex: 1 }} source={images.registerBG}>
                <View style={styles.container}>
                <View style={styles.baseViewStyle}>
                  <View
                    style={{
                      width: responsiveWidth(70),
                      backgroundColor: "white",
                      height: HEIGHT() * 0.75,
                      borderRadius: moderateScale(6),
                      marginTop: WIDTH>HEIGHT?responsiveHeight(20/2):responsiveHeight(15/2),
                      marginBottom: moderateScale(15),
                      position: "absolute",
                      elevation: 6
                    }}
                  >
                      <KeyboardAvoidingView style={{flex:1}} behavior="padding" enabled
                        keyboardVerticalOffset={KEYBOARDOFFSET}
                      >
                          <ScrollView
                            ref={ref => this.scrollView = ref}
                            keyboardShouldPersistTaps={"always"}
                            contentContainerStyle={{
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                              paddingBottom: 100
                            }}
                           
                          >
                            <View style={{flexDirection : 'column'}}>

            
                                 </View>
                          </ScrollView>
                      </KeyboardAvoidingView>
                  </View>
                  {/* <StepIndicator step={0} steps={3} /> */}
                  </View>
                </View>
      
                {this.state.getVerified ? (
                  <View style={styles.CheckBoxStyleContainer}>
                    <View style={styles.CheckBoxStyle}>
                      <Check iconColor={"white"} style={styles.iconStyle} />
                    </View>
                  </View>
                ) : null}
              </FastImage>
            </SafeAreaView>
            </View>
  
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    // marginTop: 40,
  },

  baseViewStyle: {
      width: responsiveWidth(70),
      height: HEIGHT() * 0.85,
     // height: responsiveHeight(85),
      marginVertical: responsiveHeight(15/2),
  },

  CheckBoxStyleContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute"
  },

  CheckBoxStyle: {
    height: moderateScale(150),
    width: moderateScale(150),
    borderRadius: moderateScale(75),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green"
  },

  iconStyle: {
    width: moderateScale(75),
    height: moderateScale(75)
  },
  CardHeader: {
    width: "100%",
    paddingHorizontal: WIDTH() * 0.06,
    paddingTop: moderateScale(20),
    paddingBottom: HEIGHT() * 0.01,
    alignItems: "center",
    justifyContent: "center",
  },

  inputRowContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconStyle: {
    alignSelf: "flex-end",
    width: moderateScale(26),
    height: moderateScale(26),
    marginRight: WIDTH() * 0.05,
    opacity: 0.8
  },

  iconStyleRight: {
    alignSelf: "flex-end",
    width: moderateScale(26),
    height: moderateScale(26),
    marginLeft: WIDTH() * 0.02,
    opacity: 0.8
  },

  lockIconStyle: {
    alignSelf: "flex-end",
    marginRight: WIDTH() * 0.05,
    opacity: 0.8
  },

  validInfoText: {
    color: "#979797",
   
    fontSize: moderateScale(12),
    textAlign: "center",
    
    marginTop: moderateScale(15)
  },

  errorInfoText: {
  
   
    fontSize: moderateScale(12),
    position: "absolute",
    textAlign: "right",
    color: "red",
    bottom: responsiveHeight(-3.5),
    right: 0
  },

  infoText: {
    marginTop: HEIGHT() * 0.04,
    marginBottom: HEIGHT() *0.04,
   
    color: Colors.themeGray,
    fontSize: moderateScale(13),
    textAlign: "center",
  },

  buttonStyle: {
    height: HEIGHT() * 0.06,
    width: WIDTH() * 0.25,
    borderRadius: moderateScale(4),
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    // elevation: 3,
    // shadowColor: "black",
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: moderateScale(4)
  },

  btnText: {
    color: "white",
    
    fontSize: moderateScale(14)
  },

  textStyle: {
    marginLeft: 5,
    color: Colors.themeGray,
   
    fontSize: moderateScale(14),
  },
  
  textStyle2: {
  //  marginBottom:HEIGHT>WIDTH?responsiveHeight(11):responsiveHeight(21),
    marginTop: HEIGHT() * 0.035 ,
    color: Colors.themeGray,
   
    fontSize: moderateScale(14),
    textAlign: "center",
  },

  formInput: { 
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    flex: 1,
    borderColor: Colors.themeGray,
    marginVertical: HEIGHT() * 0.0075
  },
  shadowButtonstyle: {
    height: 50,
    width: 50,
    marginLeft: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    elevation: 6,
    shadowColor: "#000",
    shadowRadius: 25,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 6
    }
  },
  detailTextStle: {
    paddingHorizontal: 10,
    paddingVertical: 3,
   
    fontSize: moderateScale(10),
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 1.0,
    borderRadius: 5.0,
    overflow: 'hidden'
  },
  checkBoxContainer: { marginVertical: HEIGHT() * 0.06 }
});