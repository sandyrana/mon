import React, { Component } from 'react';
import { SafeAreaView,KeyboardAvoidingView,StyleSheet,FlatList,
    ScrollView,View,Text,Alert,TouchableOpacity,BackHandler, 
} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { Menu1, Info, Invisible, Visible,Check } from "../../assets/icons";
import FastImage from "react-native-fast-image";
import ErrorHandling from "../Utils/ErrorHandling";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import { FloatingTextInput } from '../Components/FloatingTextInput.js';
import NetInfo from "@react-native-community/netinfo";
import StepIndicator from "../Components/StepIndicator";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { step1, step2, step3 } from "../Components/registrationSteps";
import {POSTApiAuth} from '../Utils/ApiCall.js';
const backAction = () => {
  Actions.pop()
    return true;
  };
export default class TutorialsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
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
                <Text style={styles.textStyle}> Welcome to the Backyard Builder Tutorial. </Text>
                <Text style={styles.textStyle}> Let's walk through designing your dream landscape together. </Text>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress = {() => Actions.startTutorial()}
                >
                  <Text style={styles.btnTextStyle}>START TUTORIAL</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.blankButtonStyle}
                  onPress={() => Actions.pop()}
                >
                  <Text style={[styles.btnTextStyle, {textDecorationLine: "underline"}]}>SKIP TUTORIAL</Text>
                </TouchableOpacity>
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
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)"
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
  baseViewStyle: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },

  textStyle: {
    color: "white",
   
    fontSize: moderateScale(12),
    textAlign: "center",
    marginVertical: moderateScale(2)
  },

  btnTextStyle: {
    color: "white",
    
    fontSize: moderateScale(12),
    textAlign: "center",
    marginVertical: moderateScale(2)
  },

  buttonStyle: {
    marginTop: HEIGHT() * 0.07,
    marginBottom: HEIGHT() * 0.03,
    height: HEIGHT() * 0.06,
    width: WIDTH() * 0.25,
    borderRadius: moderateScale(3),
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },

  blankButtonStyle: {
    marginTop: HEIGHT() * 0.015,
    marginBottom: HEIGHT() * 0.025,
    height: HEIGHT() * 0.06,
    width: WIDTH() * 0.25,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonSkipTutorialStyle: {
    
    marginTop: HEIGHT() *0.03,
    marginBottom: HEIGHT() * 0.07,
    height: HEIGHT() * 0.05,
    width: WIDTH() * 0.25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5, 
    borderWidth: 1, 
    borderColor: "white", 
  },

  blurContainer: {
    height: HEIGHT() * 0.3,
    width: WIDTH() * 0.8,
    marginTop: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  
  uploadViewContainer: {
    width: "85%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dotted",
    borderColor: "black",
    borderWidth: 2,
  },

  uploadContainerText: {
    position: "absolute",
    bottom: moderateScale(5),
    right: moderateScale(20),
    fontSize: moderateScale(16),
   
    color: Colors.themeGray
  },

  bottomDrawerContainer: {
    position: "absolute",
    bottom: 0,
    height: "80%",
    width: "100%",
    backgroundColor: "red"
  }
});