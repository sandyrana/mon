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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Spinner from 'react-native-loading-spinner-overlay';
import { FloatingTextInput } from '../Components/FloatingTextInput.js';
import { Menu1 } from "../../assets/icons";
import {POSTApiAuth} from '../Utils/ApiCall.js';
const backAction = () => {
  Actions.pop()
    return true;
  };
export default class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
          oldPassword :'',
          newPassword :'',
          confrimPassword :'',
          token:'',
          userId :'',
          validInfo :false,
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
      await   AsyncStorage.getItem("id").then((value) => {
        if(value!=null){
          this.setState({userId : value});
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
      callForgotPassword = async()=>{
        console.log("oldPassword :"+this.state.oldPassword)
        console.log("newPassword :"+this.state.newPassword)
        console.log("confrimPassword :"+this.state.confrimPassword)
        const regPassword = /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\'"()\[\]_<=>-]{8,25}$/;
        if(this.state.oldPassword == ''){
          this.showMessage("Please enter old password",Colors.headerBg,Colors.base_color)
        }else if(regPassword.test(this.state.oldPassword) == false){
          this.showMessage("Please enter valid old password",Colors.headerBg,Colors.base_color)
        }else  if(this.state.newPassword == ''){
          this.showMessage("Please enter new password",Colors.headerBg,Colors.base_color)
        }else if(regPassword.test(this.state.newPassword) == false){
          this.showMessage("Please enter valid new password",Colors.headerBg,Colors.base_color)
        }else  if(this.state.confrimPassword == ''){
          this.showMessage("Please enter confirm password",Colors.headerBg,Colors.base_color)
        }else if(regPassword.test(this.state.confrimPassword) == false){
          this.showMessage("Please enter valid confirm password",Colors.headerBg,Colors.base_color)
        }else if(this.state.newPassword != this.state.confrimPassword ){
          this.showMessage("Confirm password and New Password must be same",Colors.headerBg,Colors.base_color)
        }else{
          this.setState({loading : true})
          var result  = await POSTApiAuth({
            'action': 'updatePassword',
            params: {
              customer_id: this.state.userId,
              currentPassword: this.state.oldPassword,
              newPassword: this.state.newPassword,
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
                  backgroundColor : Colors.themeDark
                });
              }, 100);
            }else {
              this.setState({loading : false})
              setTimeout(function(){
                Snackbar.show({
                  text:"Please check your mail",
                  duration: Snackbar.LENGTH_SHORT,
                  textColor :Colors.headerBg,
                  backgroundColor : Colors.themeDark
                });
              }, 100);
              Actions.pop()
            }
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
                          <View
                style={styles.inputRowContainer2}>
              
                <View style = {{width :"80%"}}>
          </View>
          <View style = {{width :"20%",flexDirection :'row'}}>
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

          <Info
            iconColor={Colors.iconColor}
            style={styles.iconStyleRight}
            onPress={() => this.setState({ validInfo: !this.state.validInfo })}
          />
              </View>
              </View>
              {this.state.validInfo && (
          <Text style={styles.validInfoText}>
            {`* Password requires 8 characters, 1 uppercase,\n1 lowercase, 1 number and no spaces`}
        </Text>
        )}
                          <View
                                style={styles.inputRowContainer}>
                              <MaterialIcons
                            name="lock"
                            size={moderateScale(26)}
                            color={"rgba(37, 37, 37,0.7)"}
                            style={styles.lockIconStyle}
                          />
                                <View style = {{width :"100%"}}>
                                <FloatingTextInput
                          keyboardType = 'default'
                          attrName = 'oldPassword'
                          title = '* Old Password'
                          isSecure = {this.state.isSecure}
                          value = {this.state.oldPassword}
                          updateMasterState = {this._updateMasterState} />
                          </View>
                           </View>
                           <View
                                style={styles.inputRowContainer}>
                              <MaterialIcons
                            name="lock"
                            size={moderateScale(26)}
                            color={"rgba(37, 37, 37,0.7)"}
                            style={styles.lockIconStyle}
                          />
                                <View style = {{width :"100%"}}>
                                <FloatingTextInput
                          keyboardType = 'default'
                          attrName = 'newPassword'
                          title = '* New Password'
                          isSecure = {this.state.isSecure}
                          value = {this.state.newPassword}
                          updateMasterState = {this._updateMasterState} />
                          </View>
                           </View>
                           <View
                                style={styles.inputRowContainer}>
                              <MaterialIcons
                            name="lock"
                            size={moderateScale(26)}
                            color={"rgba(37, 37, 37,0.7)"}
                            style={styles.lockIconStyle}
                          />
                                <View style = {{width :"100%"}}>
                                <FloatingTextInput
                          keyboardType = 'default'
                          attrName = 'confrimPassword'
                          isSecure = {this.state.isSecure}
                          title = '* Confirm Password'
                          value = {this.state.confrimPassword}
                          updateMasterState = {this._updateMasterState} />
                          </View>
                           </View>
            
             <View style={{flexDirection : 'row',alignSelf : 'center'}}>
             <TouchableOpacity
          onPress={() => this.callForgotPassword()}
          style={styles.buttonStyle}
        >
          <Text style={styles.btnText}>DONE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Actions.pop()}
          style={styles.buttonStyle}
        >
          <Text style={styles.btnText}>CANCEL</Text>
        </TouchableOpacity>
             </View>
             
      
                          </View>
      
      </ScrollView>
  </KeyboardAvoidingView> 
                  </View>
                  <View style={styles.loginHeader}>
            <Text style={styles.loginHeaderText}>Reset Password</Text>
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
    marginTop : moderateScale(6),
    paddingTop: moderateScale(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRowContainer2: {
    width: "90%",
    paddingTop: moderateScale(40),
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
    
    marginTop: moderateScale(5)
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