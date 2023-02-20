/* eslint-disable react/self-closing-comp */
/* eslint-disable no-dupe-keys */
/* eslint-disable keyword-spacing */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Alert, TouchableOpacity,  TouchableHighlight,  TouchableWithoutFeedback, ScrollView, ActivityIndicator,  UIManager,
  LayoutAnimation, TextInput,InputAccessoryView, Keyboard,  StyleSheet} from "react-native";
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import { Actions } from 'react-native-router-flux';  
import { step1, step2, step3 } from "../_constants/DesignFormStep";
import ErrorHandling from "../Utils/ErrorHandling";
import {POSTApiAuth} from '../Utils/ApiCall.js';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
  import StepIndicator from "./StepIndicator";
  import CheckBox from 'react-native-check-box';
  import {  Check, Save,ShareIcon} from "../../assets/icons";
  import Share, {ShareSheet, Button} from 'react-native-share';
  import ProgressiveImage from "./ProgressiveImage";
  import FastImage from "react-native-fast-image";
  const constWidth = "85%";
  const titleString = "Please verify your contact Information and the best time for our  Moon Valley Design Consultant to give you a call.";
  var designNameTrim = ""
export default class DesignFormView extends React.Component {
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
     // this.props.updateDesignFormPage(0, step1);
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
   
    renderDesignForm1() {

      const { onPressCancel } = this.props

      return(
          <View style={styles.CardHeader}>
               <Text style={{width: "80%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center"}}> { titleString} </Text>
                  <View style={styles.titleViewStyle}>
                      <Text style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center",alignSelf : 'center'}}> Name: </Text>
                      <Text style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "left"}}>  { this.state.Name } </Text>
                  </View>
                  <View style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center",backgroundColor : 'white'}}>
                      <Text style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center",alignSelf : 'center'}}> Email: </Text>
                      <Text style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "left"}}>  { this.state.Email } </Text>
                  </View>
                  <View style={styles.titleViewStyle}>
                      <Text style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center",alignSelf : 'center'}}> Phone: </Text>
                      <Text style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "left"}}>  { this.state.Phone } </Text>
                  </View>

                  <View style={styles.checkboxBaseViewStyle}>
                      <Text style={{color: Colors.themeGray, alignSelf: "flex-start",width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center"}}> Best Time to Call</Text>
                      <View style={styles.checkBoxViewStyle}>
                          <View style = {styles.checkBoxView}>
                              <CheckBox
                                  onClick={()=>{
                                  this.setState({ isMorning: ! this.state.isMorning})}
                                  }
                                  isChecked={this.state.isMorning}
                                  style={ styles.checkBoxStyle }
                               />
                              <Text style={styles.textStyle}> Morning    </Text>
                          </View>
                          <View style = {{ height: 50,   width: "100%",  flexDirection: "row", alignItems: "center", justifyContent: "center",justifyContent: "flex-start"}}>
                              <CheckBox
                                  onClick={()=>{
                                  this.setState({ isEvening: ! this.state.isEvening})}
                                  }
                                  isChecked={this.state.isEvening}
                                  style={ styles.checkBoxStyle }
                               />
                              <Text style={styles.textStyle}> Evening </Text>
                          </View>
                      </View>
                      <View style={styles.checkBoxViewStyle}>
                          <View style = {styles.checkBoxView}>
                              <CheckBox
                                  onClick={()=>{
                                  this.setState({ isAfternoon: ! this.state.isAfternoon})}
                                  }
                                  isChecked={this.state.isAfternoon}
                                  style={ styles.checkBoxStyle }
                               />
                              <Text style={styles.textStyle}> Afternoon </Text>
                          </View>
                          <View style = {{ height: 50,   width: "100%",  flexDirection: "row", alignItems: "center", justifyContent: "center",justifyContent: "flex-start"}}>
                              <CheckBox
                                  onClick={()=>{
                                  this.setState({ isAnyTime: ! this.state.isAnyTime})}
                                  }
                                  isChecked={this.state.isAnyTime}
                                  style={ styles.checkBoxStyle }
                               />
                              <Text style={styles.textStyle}> AnyTime </Text>
                          </View>
                      </View>
                  </View>

                  <View style={{height: 50,  width: constWidth,flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.lightGray,justifyContent: "center",marginTop: 25, height: HEIGHT() * 0.06, backgroundColor: "white"}}>
                      <TouchableOpacity
                          onPress={() => this.NextButtonAction()}
                          style={ {borderRadius: 5.0,height: HEIGHT() * 0.06,width: '35%', marginHorizontal: WIDTH() * 0.020, backgroundColor: "red", alignItems: "center",  justifyContent: "center",
                        }}
                       >
                          <Text style={styles.btnText}>NEXT</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                          onPress={onPressCancel}
                          style={styles.buttonStyle}
                      >
                          <Text style={ { color: "white", textAlign: "center",  fontSize: responsiveFontSize(1.5),color: "black",}}>CANCEL</Text>
                      </TouchableOpacity>
                  </View>
          </View>
      )
  }

  NextButtonAction() {
      this.setState({ isScroll: false })
      this.props.updateDesignFormPage(1, step2);
  }

  renderDesignForm2() {

      const { imageUrl ,snapImage} = this.props
      const { designName } = this.state

      return(
          <View style={styles.CardHeader}>
              <View style={{justifyContent: "center",height: 50,  width: constWidth,flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.lightGray,
                  height: HEIGHT() * 0.06, backgroundColor: "white"}}>


                  <TouchableOpacity
                      style={styles.buttonStyle}
                      onPress={() =>
                          this.setState({ isPreView: !this.state.isPreView, isSpecification: !this.state.isSpecification})}
                  >
                      <Text style={ {color: "#3b3b3b", color: "white", textAlign: "center",  fontSize: responsiveFontSize(1.5)}}>PREVIEW</Text>
                      {this.state.isPreView && (
                          <View style={{height:2, width: WIDTH() * 0.20, backgroundColor: "red"}}></View>
                      )}
                  </TouchableOpacity>

                  <TouchableOpacity
                      onPress={() => this.setState({ isSpecification: !this.state.isSpecification, isPreView: !this.state.isPreView})}
                      style={styles.buttonStyle}
                  >
                      <Text style={{color: "#3b3b3b", textAlign: "center",  fontSize: responsiveFontSize(1.5)}}> SPECIFICATION </Text>
                      {this.state.isSpecification && (
                          <View style={{height:2, width: WIDTH() * 0.20, backgroundColor: "red"}}></View>
                      )}
                  </TouchableOpacity>
              </View>


              <View  style={styles.imageBaseViewStyle}>
                  { this.state.isPreView && (
                      <View style = {{height: "100%", width: "100%", alignItems: "center"}}>
                      <TextInput
                          style = { {color: Colors.themeDark,
                              borderBottomColor: Colors.themeDark, borderBottomWidth: 1.0,
                              height: moderateScale(20), width: "65%", fontSize: moderateScale(13)}}
                          value={designName}
                          placeholder="File Name"
                          placeholderTextColor={Colors.themeGray}
                          ref={ref => this.input1 = ref}
                          returnKeyType={"done"}
                          keyboardAppearance={"default"}
                          underlineColorAndroid={"transparent"}
                          onChangeText={designName =>
                              this.setState({ designName })
                          }
                          onEndEditing={() => {
                              Keyboard.dismiss();
                          }}
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
                   )
                  }

                  { this.state.isSpecification && (
                          this.renderSpecificationList()
                      )
                  }
              </View>

              <View style={ {justifyContent: "center",marginTop:responsiveHeight(2),height: 50,  width: constWidth,flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.lightGray,
                  marginVerical: 15, height: HEIGHT() * 0.06, backgroundColor: "white", alignItems: "center"}}>
                  <TouchableOpacity
                      onPress={() => this.onSubmitClick()}
                      style={styles.bottomButtonStyle}
                  >
                      <Text style={styles.btnText}>SUBMIT DESIGN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      onPress={() => this.onBackAction()}
                      style={styles.bottomButtonStyle}
                  >
                      <Text style={{ color: "black", textAlign: "center",  fontSize: responsiveFontSize(1.5)}}>BACK</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )
  }

  renderSpecificationList() {

      const {  productArray } = this.props

      return(

              <FlatList
              ListHeaderComponent = {
                  <View style={{  flexDirection: "row",paddingVertical: 10,  paddingHorizontal: 10, width: "100%",backgroundColor: Colors.lightGray,  paddingVertical: 15}}>
                  <Text style={styles.listTextColor}> Name </Text>
                  <Text style={styles.listTextColor}> Scientific Name  </Text>
                  <Text style={styles.listTextColor}> Quantity  </Text>
                </View>
               }
                  contentContainerStyle={{ paddingVertical: 10 }}
                  style={{ width: "100%"}}
                  data={productArray}
                  keyExtractor={item => "key" + item.faqsID}
                  renderItem={({ item, index }) => (
                  <View style={{ backgroundColor: index%2 != 0 ? Colors.lightGray: "transparent", flexDirection: "row",paddingVertical: 10,  paddingHorizontal: 10, width: "100%",}} key={index}>
                      <Text style={styles.listTextColor}> { item.name } </Text>
                      <Text style={styles.listTextColor}> { item.botnical_name } </Text>
                      <Text style={styles.listTextColor}> { item.quantity } </Text>
                  </View>
                  )}
              />
      )
  }

  onBackAction() {
      this.setState({ isScroll: true })
      this.props.updateDesignFormPage(0, step1);
  }
  onSubmitClick()
  {
      designNameTrim = this.state.designName.trim()
      console.log("design name ===", designNameTrim)

      if(designNameTrim == "") {
          Alert.alert(ErrorHandling.alertTitle, ErrorHandling.addFileName);
      } else if (this.props.imageSnapUrlStatus != "SUCCESS") {
          Alert.alert(ErrorHandling.alertTitle, ErrorHandling.snapInProgress);
      } else {
          this.setState({ isScroll: false })
          this.props.updateDesignFormPage(2, step3);
      }

  }

  onSubmitDesignAction(){

          let best_time_to_call=""
          if(this.state.isMorning)
          {
              best_time_to_call="Morning";
          }
          if(this.state.isEvening)
          {
              if(best_time_to_call!==""){
                  best_time_to_call=best_time_to_call+",Evening"
              }
              else
              {
                  best_time_to_call="Evening"
              }
          }
          if(this.state.isAfternoon)
          {
              if(best_time_to_call!==""){
                  best_time_to_call=best_time_to_call+",Afternoon"
              }
              else
              {
                  best_time_to_call="Afternoon"
              }
          }

          if(this.state.isAnyTime)
          {
              if(best_time_to_call!==""){
                  best_time_to_call=best_time_to_call+",AnyTime"
              }
              else
              {
                  best_time_to_call="AnyTime"
              }
          }



          this.props.onPressSubmitDesign(best_time_to_call,designNameTrim,this.props.imageUrl)

  }

  renderDesignForm3() {
      const { imageUrl, onPressCancel,snapImage } = this.props

      return(
          <View style={styles.CardHeader}>
              <View  style={ {marginVertical: 0, height: responsiveHeight(35) , width: constWidth, height: responsiveHeight(40),alignItems: "center",justifyContent: 'center', marginVertical: 12,}}>

                  <FastImage
                      style={ {height: "80%",  width:'55%',justifyContent: 'center', width:'100%',  height:"100%",      alignItems: "center", borderRadius: 15.0,}}
                      source={{
                          uri: snapImage,
                          priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.stretch}
                  />
              </View>
              <Text style={{width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center",width: "80%", paddingBottom : 15, paddingVertical:10}}> Thank you for your submission, one of our Design Specialists will contact you shortly. </Text>
              <View style={{ height: 50,  width: constWidth,flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.lightGray,flexDirection: "row", justifyContent: "center",marginVerical: 20, height: HEIGHT() * 0.06, backgroundColor: "white", alignItems: "center"}}>
                  <TouchableOpacity
                      style={ {marginHorizontal: WIDTH() * 0.03, height: 50,
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
                        }}}
                      onPress={() => this.onShareAction()}
                   >
                       <Image style={{ height: 25, width: 25}} source={images.shareImage}/>
                   </TouchableOpacity>
                  <TouchableOpacity
                      style={{borderRadius: 5.0, width:"30%",height: HEIGHT() * 0.06,width: '35%', marginHorizontal: WIDTH() * 0.020, backgroundColor: "red", alignItems: "center",  justifyContent: "center", }}
                      onPress={() => this.onSubmitDesignAction()}
                   >
                      {/* <Save iconColor={"white"} onPress={() => {}}/> */}
                      <Text style={styles.btnText}> FINISH </Text>
                   </TouchableOpacity>
              </View>
          </View>
      )
  }

  onShareAction() {
      const { imageUrl ,snapImage} = this.props

      let shareImageBase64 = {
          title: "React Native",
          message: "Test app",
          url: snapImage,
          subject: "Share Link" //  for email
      };

      Share.open(shareImageBase64);
  }

  renderPageView () {

      if (this.props.step == 0) {
          return (
              this.renderDesignForm1()
          )
      } else if (this.props.step == 1){
          return(
              this.renderDesignForm2()
          )
      } else {
          return(
              this.renderDesignForm3()
          )
      }
  }

  render() {
    return(
        <View style={styles.mainViewStyle}>
        <View style={ styles.baseViewStyle}>
             <View style={styles.backgroundViewStyle}>

                {/* {this.props.steps.map((item, key) => { */}
                    {/* return ( */}
                        <ScrollView
                            style={{ flex:1 }}
                            scrollEnabled={true}
                            // key={key}
                            keyboardShouldPersistTaps={"always"}
                            contentContainerStyle={{
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                           { this.renderPageView() }
                        </ScrollView>
                    {/* ); */}
                 {/* })}    */}

            </View>
            <StepIndicator step={this.props.step} steps={this.props.steps} />
        </View>
        </View>
    )
}
  }
const styles = StyleSheet.create({
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
    height: HEIGHT() * 0.85,
   // height: responsiveHeight(85),
    marginVertical: responsiveHeight(15/2),
},

backgroundViewStyle: {
    width: responsiveWidth(70),
    height: (HEIGHT() * 0.85) -(WIDTH>HEIGHT?responsiveHeight(20/2):responsiveHeight(15/2)),
    backgroundColor: "white",
    borderRadius: moderateScale(6),
    marginTop: WIDTH>HEIGHT?responsiveHeight(20/2):responsiveHeight(15/2),
    marginBottom: moderateScale(15),
    position: "absolute",
    elevation: 6,
},

//page1
CardHeader: {
    width: "100%",
    paddingHorizontal: WIDTH() * 0.06,
    marginTop: (WIDTH>HEIGHT?responsiveHeight(20/2):responsiveHeight(15/2)) + 20,
    paddingBottom: HEIGHT() * 0.01,
    alignItems: "center",
    justifyContent: "center",
},

titleTextStyle: {
  width: "50%",color: Colors.themeDark, fontSize: moderateScale(12), textAlign: "center"
},
titleTextStyle2: {
  width: "85%",
    color: Colors.themeDark,
    
    fontSize: moderateScale(12),
    textAlign: "center"
},
titleViewStyle: {

    height: 50,  width: constWidth,flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.lightGray,
},


checkboxBaseViewStyle:{
    width: constWidth,
    marginTop: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
},

checkBoxViewStyle: {
    height: 50,   width: "100%",  flexDirection: "row", alignItems: "center", justifyContent: "center",
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
    height: HEIGHT() * 0.06,width: '35%', marginHorizontal: WIDTH() * 0.020, backgroundColor: "red", alignItems: "center",  justifyContent: "center",

 },
bottomButtonStyle: {
    height: HEIGHT() * 0.06,
    width: '35%',
    // paddingHorizontal: moderateScale(22),
     marginHorizontal: WIDTH() * 0.020,
    //marginTop: HEIGHT() * 0.030,
    borderRadius: moderateScale(4),
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderColor: Colors.themeDark, 
    borderRadius: moderateScale(4), 
    borderWidth: 1.0,
    shadowColor: "transparent"
},

btnText: {
    color: "white", textAlign: "center",  fontSize: responsiveFontSize(1.5)
},

previewButtonStyle:{ 
    backgroundColor: "transparent",
    shadowColor: "transparent", 
    marginHorizontal:3.0, 
    width: WIDTH() * 0.25, 
    height: HEIGHT() * 0.06,
    alignItems: "center",
    justifyContent: "space-between"
},

imageBaseViewStyle: {
    width: constWidth, height: responsiveHeight(40),alignItems: "center",justifyContent: 'center', marginVertical: 12,
},



imageViewStyle: {
    justifyContent: 'center', width:'100%',  height:"100%",      alignItems: "center", borderRadius: 15.0,
},

transparentShadowStyle: {
    backgroundColor: "transparent",
    borderColor: Colors.themeDark, 
    borderRadius: moderateScale(4), 
    borderWidth: 1.0,
    shadowColor: "transparent"
},

listTextColor: {
    width: "33%",
    color: Colors.themeDark,
    textAlign: "center",
    
    fontSize: moderateScale(13),
    textDecorationLine: "underline",
},


textInputStyle: {
    flex: 1,
    color: Colors.themeDark,
    height: moderateScale(20), 
    width: "65%", 
    fontSize: moderateScale(13), 
    marginVertical: moderateScale(5)  
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

checkBoxStyle: {
    height: moderateScale(20),
    width: moderateScale(20)
}
});
