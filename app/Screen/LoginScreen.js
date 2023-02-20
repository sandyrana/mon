/* eslint-disable jsx-quotes */
/* eslint-disable no-return-assign */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
/* eslint-disable keyword-spacing */
/* eslint-disable space-infix-ops */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { SafeAreaView,KeyboardAvoidingView,StyleSheet,
    ScrollView,View,Text,Alert,TouchableOpacity,BackHandler, 
} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { Call, Info, Invisible, Mail, Visible,Check } from "../../assets/icons";
import FastImage from "react-native-fast-image";
import ErrorHandling from "../Utils/ErrorHandling";
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
    BackHandler.exitApp()
    return true;
  };
export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
          email :'',
          password :'',
          token:'',
          isSecure :false,
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
      _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
       
      }
      checkDataAvl = async()=>{
        const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
         const regPassword = /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\'"()\[\]_<=>-]{8,25}$/;
    
        if(this.state.email == ''){
          this.showMessage("Please enter email",Colors.headerBg,Colors.base_color)
        }else if(reg.test(this.state.email) == false){
          this.showMessage("Please enter valid email",Colors.headerBg,Colors.base_color)
        }else  if(this.state.password == ''){
          this.showMessage("Please enter password",Colors.headerBg,Colors.base_color)
        }else if(regPassword.test(this.state.password) == false){
          this.showMessage("Please enter valid password",Colors.headerBg,Colors.base_color)
        }else{
          this.setState({loading : true})
          var result  = await POSTApiAuth({
            'action': 'userLogin',
            params: {
              username: this.state.email,
              password: this.state.password,
              token: this.state.token
            } 
          });
          console.log("result :"+JSON.stringify(result))
          if(result){
            if(result.error){
              this.setState({loading : false})
              setTimeout(function(){
                Snackbar.show({
                  text:result.message,
                  duration: Snackbar.LENGTH_SHORT,
                  textColor :Colors.headerBg,
                  backgroundColor : Colors.base_color
                });
              }, 100);
            }else {
              this.setState({loading : false})
              setTimeout(function(){
                Snackbar.show({
                  text:"Login Successful",
                  duration: Snackbar.LENGTH_SHORT,
                  textColor :Colors.headerBg,
                  backgroundColor : Colors.base_color
                });
              }, 100);
              console.log("result :"+JSON.stringify(result))
              AsyncStorage.setItem("id",result.data.DATA.id.toString())
              AsyncStorage.setItem("email",result.data.DATA.email.toString())
              AsyncStorage.setItem("fullName",result.data.DATA.firstname + " "+result.data.DATA.lastname.toString() )
              AsyncStorage.setItem("store_id",result.data.DATA.store_id.toString())
              if(result.data.DATA.addresses.length !=0){
                AsyncStorage.setItem("telephone",result.data.DATA.addresses[0].telephone != undefined ? result.data.DATA.addresses[0].telephone.toString():'')
                AsyncStorage.setItem("addressLine1",result.data.DATA.addresses[0].street[0]!= undefined ? result.data.DATA.addresses[0].street[0].toString():'')
                AsyncStorage.setItem("addressLine2",result.data.DATA.addresses[0].street[1]!= undefined ? result.data.DATA.addresses[0].street[1].toString():'')
                AsyncStorage.setItem("cityName",result.data.DATA.addresses[0].city!= undefined ? result.data.DATA.addresses[0].city.toString():'')
                AsyncStorage.setItem("postalCode",result.data.DATA.addresses[0].postcode!= undefined ? result.data.DATA.addresses[0].postcode.toString():'')
                AsyncStorage.setItem("stateNm",result.data.DATA.addresses[0].region.region!= undefined ? result.data.DATA.addresses[0].region.region.toString():'')
                AsyncStorage.setItem("region_id",result.data.DATA.addresses[0].region.region_id!= undefined ? result.data.DATA.addresses[0].region.region_id.toString():'')
                
              }else {
                  AsyncStorage.setItem("telephone",'')
                  AsyncStorage.setItem("addressLine1",'')
                  AsyncStorage.setItem("addressLine2",'')
                  AsyncStorage.setItem("cityName",'')
                  AsyncStorage.setItem("postalCode",'')
                  AsyncStorage.setItem("stateNm",'')
                  AsyncStorage.setItem("region_id",'')
                
              }
              AsyncStorage.setItem('MyDesignImageId',"")
            AsyncStorage.setItem("isLogin","true")
              // setTimeout(() => {
              //   Alert.alert(
              //     ErrorHandling.alertTitle,
              //     ErrorHandling.questionUploadMessage,
              //     [
              //     {
              //       text: "Ok",
              //       onPress: () => {
              //         this.setState({ question : ""})
              //       }
              //     }
              //   ],
              //     {cancelable: false},
              //   );
              // }, 100);
              Actions.dashboardScreen()
             
            }
          }
      }
    //  Actions.registerPageTwo({email :'test@gmail.com', phone : '0943094304039',password :"Arun@1234" ,getOtp : '1123'})
      }
      showMessage =(text,txtcolor,backColor)=>{
        Snackbar.show({
          text: text,
          duration: Snackbar.LENGTH_SHORT,
          textColor : txtcolor,
          backgroundColor : backColor
        });
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
                <Mail iconColor={Colors.iconColor} style={styles.iconStyle} />
                <View style = {{width :"100%"}}>
        <FloatingTextInput
          keyboardType = 'email-address'
          attrName = 'email'
          title = '* Email'
          isSecure = {false}
          value = {this.state.email}
          updateMasterState = {this._updateMasterState} />
        
          </View>
           
              </View>
            
             
              <View
                style={styles.inputRowContainer2}>
              <MaterialIcons
            name="lock"
            size={moderateScale(26)}
            color={"rgba(37, 37, 37,0.7)"}
            style={styles.lockIconStyle}
          />
                   <View style = {{width :"90%"}}>
                <FloatingTextInput
          keyboardType = 'default'
          attrName = 'password'
          title = '* Password'
          value = {this.state.password}
          isSecure = {this.state.isSecure}
          updateMasterState = {this._updateMasterState} />
          </View>
          <View style = {{width :"10%",flexDirection :'row'}}>
          {this.state.isSecure ? (
            <Visible
              iconColor={Colors.iconColor}
              style={styles.iconStyleRight}
              onPress={() => this.setState({ isSecure: false })}
            />
          ) : (
            <Invisible
              iconColor={Colors.iconColor}
              style={styles.iconStyleRight}
              onPress={() => this.setState({ isSecure: true })}
            />
          )}
              </View>
              </View>
            
              <TouchableOpacity
          onPress={() => this.checkDataAvl()}
          style={styles.buttonStyle}
        >
          <Text style={styles.btnText}>SIGN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Actions.forgotPasswordScreen()}>
          <Text style={[styles.textStyle2, { textDecorationLine: "underline" }]}>
            Forgot your password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Actions.registerPageOne()}>
          <Text style={[styles.textStyle2, { textDecorationLine: "underline" }]}>
            Register new account?
          </Text>
        </TouchableOpacity>
                          </View>
      
      </ScrollView>
  </KeyboardAvoidingView> 
                  </View>
                  <View style={styles.loginHeader}>
            <Text style={styles.loginHeaderText}>Welcome - Sign In</Text>
          </View>
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
    marginTop : moderateScale(40),
    paddingTop: moderateScale(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRowContainer2: {
    width: "90%",
    paddingTop: moderateScale(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconStyle: {
    alignSelf: "center",
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
    alignSelf: "center",
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
});