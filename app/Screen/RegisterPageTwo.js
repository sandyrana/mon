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
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import OTPTextInput from 'react-native-otp-textinput'
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
export default class RegisterPageTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
            otp : '',
            otpvalidate : false,
            loading : false,
            timerToShow : '60',
            timer : 60,
            email :this.props.email,
            phone :this.props.phone,
            password :this.props.password,
            getOtp :this.props.getOtp,
          token:'',
          };
    };
    componentDidMount = async() =>{
      setInterval(() => {
        var newTimer = this.state.timer
      var timerToshow = "60"
      if(newTimer<2){
        newTimer = 0
        timerToshow = "00"
      }else {
        newTimer = newTimer -1 
        if(newTimer>9){
          timerToshow = ''+newTimer
        }else {
          timerToshow = '0'+newTimer
        }
      }
    
        this.setState({
          timer  :newTimer,
        timerToShow : timerToshow })
       }, 1000)

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
      callVerifyOtp = async()=>{
        console.log("this.state.getOtp  :"+this.state.getOtp )
        console.log("this.state.otp  :"+this.state.otp )
      if(this.state.getOtp == this.state.otp){

        Snackbar.show({
          text:"Otp has been verified",
          duration: Snackbar.LENGTH_SHORT,
          textColor :Colors.headerBg,
          backgroundColor : Colors.base_color
        });
     //   Actions.registerPageThree({email :'test@gmail.com', phone : '0943094304039',password :"Arun@1234" ,getOtp : '1123'})
        Actions.registerPageThree({email :this.state.email, phone : this.state.phone,password : this.state.password ,getOtp : this.state.getOtp })
      }else{
        Snackbar.show({
          text:"Otp not verified",
          duration: Snackbar.LENGTH_SHORT,
          textColor :Colors.headerBg,
          backgroundColor : Colors.base_color
        });
      }
    }
      checkDataAvl = async()=>{
          
          this.setState({loading : true})
          var result  = await POSTApiAuth({
            'action': 'sendOTP',
            params: {
              phoneNo: this.state.phone,
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
            }
          }
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
                          <View style={{width : "60%",marginTop:50,alignSelf  :'center'}}>
                          <View style={{width : "60%",alignSelf  :'center',justifyContent : 'center',alignItems :'center',flexDirection : 'row'}}>
                    <Text style = {styles.text}>Enter your verification code</Text>
                 </View>
           <OTPTextInput ref={e => (this.otpInput = e)}
           textInputStyle = {styles.textInput}
           keyboardType = 'numeric' 
           handleTextChange={(value) => this.setState({ otp : value})}
           tintColor = {Colors.base_color}/>
           </View>

           <View style={{width : "60%",marginTop:20,alignSelf  :'center',justifyContent : 'center',alignItems :'center',flexDirection : 'row'}}>
           { this.state.timerToShow != '00' && ( <Text style = {styles.textTop3}>Resend in {this.state.timerToShow} sec</Text>)}
           { this.state.timerToShow == '00' && ( <TouchableOpacity style={ styles.buttonStyle}  onPress = {() => this.checkDataAvl()}>
                    
                    <Text style = {styles.btnText}>RESEND</Text>
                 </TouchableOpacity>)}
                 </View>

              <TouchableOpacity
          onPress={() => this.callVerifyOtp()}
          style={styles.buttonStyle}
        >
          <Text style={styles.btnText}>VERIFY</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Actions.loginScreen()}>
          <Text style={[styles.textStyle2, { textDecorationLine: "underline" }]}>
            Already have an account?
          </Text>
        </TouchableOpacity>
                          </View>
      
      </ScrollView>
  </KeyboardAvoidingView> 
                  </View>
                  <StepIndicator step={1} steps={step2} />
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
  textInput: {
  marginTop :20,
    height : 50,
    width : 50,
     color: 'black',
     borderRadius : 5,borderWidth :2, backgroundColor :Colors.headerBg,borderColor  :Colors.base_color,alignSelf : 'center',alignItems :'center',justifyContent :'center'
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
    marginTop : moderateScale(40),
    paddingTop: moderateScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRowContainer2: {
    width: "90%",
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
    marginTop :30,
    backgroundColor: "red",
    alignItems: "center",
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
  checkBoxContainer: { marginVertical: HEIGHT() * 0.06 }
});