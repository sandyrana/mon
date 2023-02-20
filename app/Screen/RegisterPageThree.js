import React, { Component } from 'react';
import { SafeAreaView,KeyboardAvoidingView,StyleSheet,Modal,
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
import { FloatingTextInput } from '../Components/FloatingTextInput.js';
import NetInfo from "@react-native-community/netinfo";
import StepIndicator from "../Components/StepIndicator";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { step1, step2, step3 } from "../Components/registrationSteps";
import {POSTApiAuth} from '../Utils/ApiCall.js';
const backAction = () => { Actions.pop()
   
    return true;
  };
export default class RegisterPageThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
          modalVisible:false,
          email :this.props.email,
          phone :this.props.phone,
          password :this.props.password,
          getOtp :this.props.getOtp,
          firstName :'',
          lastName :'',
          addressLine1 :'',
          addressLine2 :'',
          cityName :'',
          postalCode:'',
          token:'',
          stateid: '',
          stateCode: '',
          stateNm:'',
          getStates :[],

          };
    };
    componentDidMount = async() =>{
      
        BackHandler.addEventListener("hardwareBackPress", backAction);
        await   AsyncStorage.getItem("token").then((value) => {
          console.log('token :'+value)
          if(value!=null){
            this.setState({token : value});
            this.getAllStoreList(value)
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
      getAllStoreList = async(token)=>{
          this.setState({loading : true})
          var result  = await POSTApiAuth({
            'action': 'getRegions',
            params: {
              token: token
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
              this.setState({loading : false,
                getStates : result.data.DATA})
            }
          }
      }
      checkDataAvl = async()=>{
        if(this.state.firstName == ''){
          this.showMessage("Please enter first name",Colors.headerBg,Colors.base_color)
        }else if(this.state.lastName== ""){
          this.showMessage("Please enter last name",Colors.headerBg,Colors.base_color)
        }else  if(this.state.addressLine1 == ''){
          this.showMessage("Please enter address",Colors.headerBg,Colors.base_color)
        }else  if(this.state.stateNm == ''){
          this.showMessage("Please select state",Colors.headerBg,Colors.base_color)
        }else  if(this.state.cityName == ''){
          this.showMessage("Please enter city",Colors.headerBg,Colors.base_color)
        }else  if(this.state.postalCode == ''){
          this.showMessage("Please enter postal code",Colors.headerBg,Colors.base_color)
        }else{
          this.setState({loading : true})
          var result  = await POSTApiAuth({
            action: "userRegister",
            params: {
              email: this.state.email,
              firstname: this.state.firstName,
              lastname: this.state.lastName,
              region: this.state.stateNm,
              regionId: this.state.stateid,
              postcode: this.state.postalCode,
              street: this.state.addressLine1,
              street1:  this.state.addressLine2,
              city:  this.state.cityName,
              telephone:  this.state.phone,
              countryId: "US",
              password:  this.state.password,
              token:  this.state.token,
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
              setTimeout(function(){
                Snackbar.show({
                  text:result.message,
                  duration: Snackbar.LENGTH_SHORT,
                  textColor :Colors.headerBg,
                  backgroundColor : Colors.base_color
                });
              }, 100);
              this.setState({loading : false})
              AsyncStorage.setItem("id",result.data.DATA.id.toString())
              AsyncStorage.setItem("email",result.data.DATA.email.toString())
              AsyncStorage.setItem("firstname",result.data.DATA.firstname.toString())
              AsyncStorage.setItem("lastname",result.data.DATA.lastname.toString())
              AsyncStorage.setItem("telephone",result.data.DATA.telephone.toString())
              AsyncStorage.setItem("isLogin","true")
              Actions.dashboardScreen()
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
                style={styles.inputRowContainer}>
                <View style = {{width :"100%"}}>
        <FloatingTextInput
          keyboardType = 'default'
          attrName = 'firstName'
          isSecure = {false}
          title = '* First Name'
          value = {this.state.firstName}
          updateMasterState = {this._updateMasterState} />
        
          </View>
           
              </View>
            
              <View
                style={styles.inputRowContainer2}>
                <View style = {{width :"100%"}}>
        <FloatingTextInput
          keyboardType = 'default'
          attrName = 'lastName'
          isSecure = {false}
          title = '* Last Name'
          value = {this.state.lastName}
          updateMasterState = {this._updateMasterState} />
        
          </View>
           
              </View>
              <View
                style={styles.inputRowContainer2}>
                <View style = {{width :"100%"}}>
                <FloatingTextInput
          keyboardType = 'default'
          attrName = 'addressLine1'
          isSecure = {false}
          title = '* Adddress Line 1'
          value = {this.state.addressLine1}
          updateMasterState = {this._updateMasterState} />
          </View>
           
              </View>
              <View
                style={styles.inputRowContainer2}>
                <View style = {{width :"100%"}}>
                <FloatingTextInput
          keyboardType = 'default'
          attrName = 'addressLine2'
          title = 'Adddress Line 2'
          isSecure = {false}
          value = {this.state.addressLine2}
          updateMasterState = {this._updateMasterState} />
          </View>
           
              </View>
              <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}
                style={styles.inputRowContainer3}>
                <View  style={[styles.textStyle3]}>
                <Text style={[styles.textStyle4]}>
                {this.state.stateNm == ''? "* State Name":this.state.stateNm }
          </Text>
          </View>
           
              </TouchableOpacity >
              <View
                style={styles.inputRowContainer2}>
                <View style = {{width :"100%"}}>
                <FloatingTextInput
          keyboardType = 'default'
          attrName = 'cityName'
          isSecure = {false}
          title = '* City Name'
          value = {this.state.cityName}
          updateMasterState = {this._updateMasterState} />
          </View>
           
              </View>
              <View
                style={styles.inputRowContainer2}>
                <View style = {{width :"100%"}}>
                <FloatingTextInput
          keyboardType = 'default'
          attrName = 'postalCode'
          isSecure = {false}
          title = '* Postal Code'
          value = {this.state.postalCode}
          updateMasterState = {this._updateMasterState} />
          </View>
           
              </View>
          
              <TouchableOpacity
          onPress={() => this.checkDataAvl()}
          style={styles.buttonStyle}
        >
          <Text style={styles.btnText}>DONE</Text>
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
                  <StepIndicator step={2} steps={step3} />
                  </View>
                </View>
          
            </FastImage>
            <Modal
          animationType="slide"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.ModalContainer}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}> Select State</Text>
              </View>
              <ScrollView
                keyboardShouldPersistTaps={"always"}
                contentContainerStyle={{
                  paddingVertical: HEIGHT() * 0.025
                }}
              >
                {this.state.getStates.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={styles.itemContainer}
                      key={index}
                      onPress={() =>
                        this.setState({
                          modalVisible: false,
                          stateid: item.id,
                          stateCode: item.code,
                          stateNm: item.name
                        })
                      }
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  inputRowContainer3: {
    width: "90%",
    paddingTop: moderateScale(6),
    flexDirection: "row",
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
    marginTop :30,
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

  textStyle3: {
    width: "98%",
    height :55,
    marginTop :7,
    justifyContent : 'center',
    backgroundColor : Colors.base_color2,
    borderColor  :'black',
    borderWidth :1,
    borderRadius :5,
    paddingLeft :12,
    },
    textStyle4: {
      fontSize: 15,
      backgroundColor : Colors.base_color2,
      color: 'black',
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
  ModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center"
  },

  modal: {
    width: WIDTH() * 0.92,
    maxHeight: HEIGHT() * 0.9,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },

  modalHeader: {
    width: "100%",
    height: HEIGHT() * 0.1,
    paddingHorizontal: WIDTH() * 0.07,
    borderBottomWidth: 1,
    borderColor: "#b7b7b7",
    alignItems: "flex-start",
    justifyContent: "center"
  },

  modalHeaderText: {
    color: "black",
    fontSize: moderateScale(20),
   
  },

  itemContainer: {
    width: WIDTH() * 0.92,
    paddingHorizontal: WIDTH() * 0.05,
    paddingVertical: HEIGHT() * 0.015,
    alignItems: "flex-start",
    justifyContent: "center"
  },

  modalItemText: {
    color: Colors.themeGray,
    fontSize: moderateScale(16),
    
  }
});