import React from 'react';
import {View, Text, Alert, TouchableOpacity,  FlatList,  Image, ScrollView,  UIManager,
    ActivityIndicator, TextInput,InputAccessoryView, Keyboard,  StyleSheet} from "react-native";
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import { Actions } from 'react-native-router-flux';  
import { step1, step2, step3 } from "../_constants/SaveDesignDraftStep.js";
import ErrorHandling from "../Utils/ErrorHandling";
import {POSTApiAuth} from '../Utils/ApiCall.js';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
  import FastImage from "react-native-fast-image";
var designNameTrim = ""
export default class SaveDesignDraft extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
           loading :false,
           Email: "",
          Phone: "",
          Name: "",
          userid: "",
          isMorning: false,
          isEvening: false,
          isAfternoon: false,
          isAnyTime: false,
          isPreView: true,
          isSpecification: false,
          isScroll: true,
          isShare: false,
          designName: "",
        };
      }
     componentDidMount(){
        const { userData, token } = this.props;
        var telephone = ""

        console.log("email =====",userData.DATA.email); 
        if(userData) {

            if(userData.DATA.addresses.length > 0){
                telephone = userData.DATA.addresses[0].telephone;
            } else{
                telephone = ""
            }

            this.setState({
                userid: userData.DATA.id,
                Email: userData.DATA.email,
                Name: userData.DATA.firstname + " " + userData.DATA.lastname,
                Phone: telephone,
            })
        }
        this.props.updateDesignFormPage(0, step1);
        this.setState({designName:this.props.fileName})
     }

    
    openFavouriteItems = async()=> {
      this.setState({loading : true})
      var result  = await POSTApiAuth({
        'action': 'getFavourite',
        params: {
          user_id: this.state.userId,
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
              text:result.message,
              duration: Snackbar.LENGTH_SHORT,
              textColor :Colors.headerBg,
              backgroundColor : Colors.base_color
            });
          }, 100);
        
        }
      }
    
    }
   
    NextButtonAction() {
        this.setState({ isScroll: false })
        this.props.updateDesignFormPage(1, step2);
    }

    renderDesignForm2() {

        const { imageUrl ,onPressCancel,snapImage} = this.props
        const { designName } = this.state

        return(

            <View style={styles.CardHeader}>

                <View  style={styles.imageBaseViewStyle}>

                        <View style = {{height: "100%", width: "100%", alignItems: "center"}}>

                            <TextInput
                                style = {[styles.textInputStyle, {color: Colors.themeDark,
                                    marginBottom:responsiveHeight(2), borderBottomColor: Colors.themeDark, borderBottomWidth: 1.0,
                                    height: moderateScale(25), width: "65%", fontSize: moderateScale(13)}]}
                                value={designName}
                                placeholder="File Name"
                                placeholderTextColor={Colors.themeGray}
                                ref={ref => this.input1 = ref}
                                returnKeyType={"done"}
                                underlineColorAndroid={"transparent"}
                                onChangeText={designName =>
                                    this.setState({ designName })
                                }
                                onEndEditing={() => {
                                    Keyboard.dismiss() }}
                            />

                        <View style={styles.imageBackGroundStyle}>

                            <FastImage
                                style={styles.imageViewStyle}
                                source={{
                                    uri: snapImage,
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                        </View>

                        </View>



                </View>

                <View style={[styles.titleViewStyle, {justifyContent: "center",marginTop:responsiveHeight(2),
                    marginVerical: 15, height: HEIGHT() * 0.06, backgroundColor: "white", alignItems: "center"}]}>
                    <TouchableOpacity
                        onPress={() => this.onSubmitDesignAction()}
                        style={[styles.buttonStyle]}
                    >
                        <Text style={styles.btnText}>SAVE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onPressCancel}
                        style={[styles.buttonStyle, styles.transparentShadowStyle]}
                    >
                        <Text style={[styles.btnText, {color: "black",}]}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }


    onBackAction() {
        this.setState({ isScroll: true })
        this.props.updateDesignFormPage(0, step1);
    }
    onSubmitClick()
    {
        this.setState({ isScroll: false })
        this.props.updateDesignFormPage(2, step3);
    }

    onSubmitDesignAction(){

        designNameTrim = this.state.designName.trim()
        console.log("design name ===", designNameTrim)

        if(designNameTrim == "") {
           Alert.alert(ErrorHandling.alertTitle,ErrorHandling.addFileName);
        } else if (this.props.imageSnapUrlStatus != "SUCCESS"){
            Alert.alert(ErrorHandling.alertTitle,ErrorHandling.snapInProgress);
        } else {

            this.props.onPressSubmitDesign("AnyTime",designNameTrim,this.props.imageUrl)
        }
    }


    renderPageView () {
        return(

        this.renderDesignForm2()
        )
    }
    render()
    {
        return(
            <View style={styles.MainContainer}>
                <View style={styles.backgroundviewStyle}>
                    <ScrollView
                        style={{ flex: 1}}
                        keyboardShouldPersistTaps={"always"}
                        contentContainerStyle={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingBottom: 100
                        }}
                    >
                        {this.renderDesignForm2()}
                    </ScrollView>
                </View>

                <View style={styles.headerView}>
                    <Text style={styles.headerTextStyle}>Save Design Draft</Text>
                </View>
            </View>
        )
    }

  }
  const constWidth = "85%";

  const styles = StyleSheet.create({
      MainContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start"
      },
      backgroundviewStyle: {
  
          width: "75%",
          height: HEIGHT() * 0.7,
          backgroundColor: "white",
          borderRadius: moderateScale(6),
          marginTop: moderateScale(30) + ((HEIGHT() * 0.1)/2),
          marginBottom: moderateScale(20),
          position: "absolute",
          elevation: 6,
      },
      headerView: {
          marginTop: moderateScale(30),
          width: "65%",
          height: HEIGHT() * 0.1,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.stepHeaderBG,
          borderRadius: moderateScale(6),
          elevation: 6
      },
  
      headerTextStyle: {
          color: "white",
          textAlign: "center",
          fontSize: moderateScale(24),
      },
  
      mainViewStyle:{ 
          width: "100%",
          height: "100%",
          backgroundColor: "transparent", 
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "flex-start",
      },
  
      baseViewStyle: {
          width: responsiveWidth(70),
          height: responsiveHeight(85),
          marginVertical: responsiveHeight(15/2),
      },
  
      backgroundViewStyle: {
          width: responsiveWidth(70),
          backgroundColor: "white",
          borderRadius: moderateScale(6),
          marginTop: WIDTH>HEIGHT?responsiveHeight(20/2):responsiveHeight(15/2),
          marginBottom: moderateScale(15),
          position: "absolute",
          elevation: 6
      },
  
      //page1
  
      CardHeader: {
          width: "100%",
          alignItems: "center",
          paddingHorizontal: WIDTH() * 0.06,
          paddingTop: HEIGHT() * 0.1,
          paddingBottom: HEIGHT() * 0.008,
          justifyContent: "center"
      },
  
      titleTextStyle: {
          width: "50%",
          color: Colors.themeDark,
          
          fontSize: moderateScale(12),
          textAlign: "center"
      },
  
      titleViewStyle: {
          height: 50,
          width: constWidth,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: Colors.lightGray,
      },
  
      checkboxBaseViewStyle:{
          width: constWidth,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
      },
  
      checkBoxViewStyle: {
          height: 50,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
      },
  
      textStyle: {
          color: Colors.themeDark,
          
          fontSize: moderateScale(12),
          textAlign: "center"
      },
  
      checkBoxView: {
          width: "50%", 
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
      },
  
      buttonStyle: {
          height: HEIGHT() * 0.06,
          width: '35%',
          paddingHorizontal: moderateScale(25),
          marginHorizontal: WIDTH() * 0.020,
          //marginTop: HEIGHT() * 0.030,
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
          textAlign: "center",
          
          fontSize: responsiveFontSize(1.5)
      },
  
      previewButtonStyle:{ 
          backgroundColor: "transparent",
          shadowColor: "transparent", 
          marginHorizontal:3.0, 
          width: WIDTH() * 0.25, 
          height: HEIGHT() * 0.05,
          alignItems: "center",
          justifyContent: "space-between"
      },
  
      imageBaseViewStyle: {
          width: constWidth,
          height: responsiveHeight(40),
          alignItems: "center",
          justifyContent: 'center',
          marginVertical: 12,
      },
  
      imageViewStyle: {
          justifyContent: 'center',
          width:'100%',
          height:"100%",     
          alignItems: "center",
          borderRadius: 15.0,
      },
  
      transparentShadowStyle: {
          backgroundColor: "transparent",
          borderColor: Colors.themeDark, 
          borderRadius: moderateScale(4), 
          borderWidth: 1.0,
          shadowColor: "transparent"
      },
  
      flatlistViewStyle: {
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
      },
  
      listTextColor: {
          width: "33%",
          color: Colors.themeDark,
          textAlign: "center",
          
          fontSize: moderateScale(13)
      },
  
      lightText: {
          textDecorationLine: "underline",
          color: Colors.themeGray 
      },
  
      textInputStyle: {
          flex: 1,
          color: "#FFF",
          // marginLeft: moderateScale(25),
          fontSize: moderateScale(16)
      },
  
  
      imageBackGroundStyle: {
          justifyContent: 'center',
          width:'65%',
          height:"80%",
          alignItems: "center",
          elevation: 6,
          borderRadius: 15.0,
          backgroundColor:'#d1d1d1',
          shadowColor: "black",
          shadowOffset: {
              width: 0,
              height: 3
          },
          shadowOpacity: 0.3,
          shadowRadius: moderateScale(4)
      },
  });