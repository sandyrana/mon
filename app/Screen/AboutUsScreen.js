import React, { Component } from 'react';
import { SafeAreaView,KeyboardAvoidingView,StyleSheet,FlatList,
    ScrollView,View,Text,Alert,TouchableOpacity,BackHandler, 
} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { Menu1 } from "../../assets/icons";
import FastImage from "react-native-fast-image";
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import Spinner from 'react-native-loading-spinner-overlay';
const backAction = () => {
  Actions.pop()
    return true;
  };
export default class AboutUsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          token:'',
          };
    };
    componentDidMount = async() =>{
        BackHandler.addEventListener("hardwareBackPress", backAction);
        await   AsyncStorage.getItem("token").then((value) => {
          console.log('token :'+value)
          if(value!=null){
            this.setState({token : value});
          }
        
      });
      }
      componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", backAction); 
       }
       _onContentSizeChange() {
        this.scrollView.scrollTo({ y: 0, animated: false });
      };
      
    render() {
        return (
          <View style={{flex:1}}>
          <SafeAreaView style={{ flex: 1 }}>
            <FastImage style={{ flex: 1 }} source={images.registerBG}>
            <Spinner
          visible={this.state.loading}
        />
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
                            onContentSizeChange={() => {
                              this._onContentSizeChange();
                            }}
                          >
                          <View style={styles.CardHeader}>
                          <View
                style={styles.inputRowContainer}>
                  <Text style={[styles.questionTextStyle]}>
                  About Backyard Builder
                            </Text>
                            <Text style={styles.answerTextStyle}>
                            {`Backyard Builder is an application built for use on tablets and mobile and for Android and IOS. This app allows users to design their own yard or landscape using their own photographs of their outdoor space. By uploading a photo of your landscape, you will then be able to incorporate images of nearly all the product we carry at Moon Valley Nurseries. \n\nAll designs that are saved in Backyard Builder will be available to you at any of our Moon Valley Nurseries locations.\n\nMoon Valley Nurseries is a family-owned and operated business that has been growing the best trees and creating dream landscapes for clients since 1995. We are now one of the best and biggest nurseries in the country. Let us bring your dreams and ideas to reality.`}</Text>
               
      </View>
                          </View>
      
      </ScrollView>
  </KeyboardAvoidingView> 
                  </View>
                  <View style={styles.loginHeader}>
            <Text style={styles.loginHeaderText}>About</Text>
          </View>
                  </View>
                </View>
            </FastImage>
          </SafeAreaView>
          <TouchableOpacity
                        style={[styles.redBtnBg, {position: "absolute",left :10,top :10}]}
                        onPress={() => {
                           Actions.drawerOpen()
                        }}
                         >
                        <Menu1 iconColor={"white"}  onPress={() => {
                           Actions.drawerOpen()
                        }}/>
                    </TouchableOpacity>
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
      paddingTop: moderateScale(40),
      flexDirection: 'column',
      alignItems: "center",
      justifyContent: "center",
    },
    inputRowContainer2: {
      width: "90%",
      marginTop :7,
      paddingTop: moderateScale(10),
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
      marginTop :50,
      marginLeft :10,
      marginRight :10,
      justifyContent: "center",
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
  
  
  
    FloatingLabelMainInput: {
      color: Colors.themeGray,
      
    },
    input: {
      borderWidth: 0,
      color: Colors.themeDark,
      fontSize: moderateScale(16),
      height: moderateScale(28),
      
    },
    topFormInput: {
      marginTop:responsiveHeight(5),
  
      borderWidth: 0,
      borderRadius: 0,
      borderBottomWidth: 1.5,
      flex: 1,
      borderColor: Colors.themeGray,
      marginVertical: HEIGHT() * 0.0075
    },
  
    formInput: { 
      borderWidth: 0,
      borderRadius: 0,
      borderBottomWidth: 1.5,
      flex: 1,
      borderColor: Colors.themeGray,
      marginVertical: HEIGHT() * 0.0075
    },
    emailFormInput: {
      marginTop:responsiveHeight(5),
     
      borderWidth: 0,
      borderRadius: 0,
      borderBottomWidth: 1.5,
      flex: 1,
      borderColor: Colors.themeGray,
      marginVertical: HEIGHT() * 0.0075
    },
    checkBoxContainer: { marginVertical: HEIGHT() * 0.06 },
    loginHeader: {
      width: "95%",
      height: HEIGHT() * 0.18,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.stepHeaderBG,
      borderRadius: moderateScale(6),
      elevation: 6
    },
  
    loginHeaderText: {
      color: "white",
      textAlign: "center",
      fontSize: moderateScale(24),
     
    },
  flatListViewHeaderStyle: {
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 5,
    paddingVertical: 5,
    // borderRadius: 3.0,
    // borderColor: Colors.themeGray,
    // borderWidth: 1.0
  },

  questionTextStyle: {
    color: Colors.themeDark,
    marginVertical: 5,
    fontWeight : 'bold',
    fontSize: moderateScale(18), 
    alignSelf: "flex-start"
  },

  answerTextStyle: {
    color: Colors.themeDark,
   
    fontSize: moderateScale(12),
    marginTop: 10, 
    marginBottom: 5, 
    marginHorizontal: 10
  },
  redBtnBg: {
    height: 50,
    width: 50,
    margin: 20,
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
});