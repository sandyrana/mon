import React, { Component } from 'react';
import { SafeAreaView,KeyboardAvoidingView,StyleSheet,FlatList,
    ScrollView,View,Text,Alert,TouchableOpacity,BackHandler,  Image,
} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { Menu1, Info, Close, Visible,Check } from "../../assets/icons";
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
export default class MyDesignScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
          token:'',
          myDesignDataArray: []
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
        console.log('token :'+value)
        if(value!=null){
          this.setState({userId : value});
          this.getMyDesignApi(value)
        }
    });
     
      }
      componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", backAction); 
       }
       _onContentSizeChange() {
        this.scrollView.scrollTo({ y: 0, animated: false });
      };
    
      handleImagePress(item)
      {
          if(item.designType!=="submitted")
          {
              AsyncStorage.setItem('MyDesignImageId',item.id.toString())
          }
          else {
              Alert.alert(ErrorHandling.alertTitle,ErrorHandling.notUpdateSubmitDesign);
          }
      }
      getMyDesignApi = async(userNewId)=>{
        this.setState({loading : true})
        var result  = await POSTApiAuth({
          action:"getMyDesign",
          params:{
              user_id:userNewId,
              app_type:"mobile",
              token : this.state.token
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
            this.setState({loading : false,
              myDesignDataArray: result.data.DATA})
          }
      }
      }
      deleteSelectedDesignApi = async(idd)=>{
        this.setState({loading : true})
        var result  = await POSTApiAuth({
          action:"deleteDesign",
          params:{
              id:idd,
              token :this.state.token
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
            this.setState({loading : false,
              })
              this.getMyDesignApi(this.state.userId)
          }
      }
      }
      handleCloseFunc(item) {
        Alert.alert(
            ErrorHandling.alertTitle,
            ErrorHandling.designDeleteConfirmation,
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        return false;
                    },
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                      this.deleteSelectedDesignApi(item.id)
                      
                    }
                }
            ],
            {
                cancelable: false
            }
        );
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
                         
                  {this.state.myDesignDataArray.length !=0 && ( 
                <FlatList
                contentContainerStyle={{ paddingVertical: 10 }}
                style={{ marginTop:  moderateScale(20), paddingBottom: 10, width: "100%"}}
                data={this.state.myDesignDataArray}
                numColumns={2}
                keyExtractor={item => "key" + item.faqsID}
                renderItem={({ item, index }) => (
                  <View style={{ margin:responsiveHeight(2),borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#d6d7da',
                    flexDirection: 'column',
                    width:responsiveWidth(25)}}>
                    <TouchableOpacity
                        onPress={() => {this.handleImagePress(item)}}
                    >
                        <Image
                            style={{width:'100%',
                                height:responsiveHeight(22),
                                resizeMode: 'stretch',
                            }}
    
                            source={{uri: item.background_image}} />
                    </TouchableOpacity>
    
                    <Text style={{textAlign:'center',color:'#858585',fontSize:responsiveFontSize(1.2)}}>
                        {item.title}
                    </Text>
    
                    <View style={{position:"absolute",flex: 1, width:50,top:responsiveHeight(-2.2),right:responsiveHeight(-2.3),
                        zIndex:1001, alignItems: "center", justifyContent:"center"}}>
                        <TouchableOpacity
                            onPress={() => {this.handleCloseFunc(item)}}
                            style={styles.closeBtn}>
                            <Close onPress={() => {this.handleCloseFunc(item)}} />
                        </TouchableOpacity>
                    </View>
    
                    {item.designType==="submitted" &&
                    <View style={{position:"absolute",flex: 1,
                        top:responsiveHeight(-2.2),
                        left:0,
                        width: responsiveWidth(12),
                        borderTopRightRadius:20,
                        height: 30,alignItems:'center',justifyContent:'center',
                        backgroundColor: '#ff1e0f',
                        zIndex:1001}}>
                        <Text style={{textAlign:'center',color:'#FFFFFF',fontSize:responsiveFontSize(1.4)}}>Submitted</Text>
    
                    </View>}
    
                    {item.designType==="draft" &&
                    <View style={{position:"absolute",flex: 1,
                        top:responsiveHeight(-2.2),
                        left:0,
                        width: responsiveWidth(12),
                        borderTopRightRadius:20,
                        height: 30,alignItems:'center',justifyContent:'center',
                        backgroundColor: '#d1d1d1',
                        zIndex:1001}}>
                        <Text style={{textAlign:'center',color:'#000',fontSize:responsiveFontSize(1.4)}}>Draft</Text>
    
    
                    </View>}
                </View>
                )}
            />)}    
       {this.state.myDesignDataArray.length ==0 && ( 
       <Text style={{ textAlign: 'center',marginTop :100,fontSize:responsiveFontSize(2), 
      }}>No Designs</Text>
       )}
                          </View>
      
      </ScrollView>
  </KeyboardAvoidingView> 
                  </View>
                  <View style={styles.loginHeader}>
            <Text style={styles.loginHeaderText}>My Design</Text>
          
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
    marginTop : moderateScale(100),
    paddingTop: moderateScale(10),
    flexDirection: "row",
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
  flatListViewHeaderStyle: {
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 3.0,
    borderColor: Colors.themeGray,
    borderWidth: 1.0
  },

   questionTextStyle: {
    color: Colors.themeDark,
    marginVertical: 5,
    fontWeight : 'bold',
      
    fontSize: moderateScale(13), 
    alignSelf: "flex-start"
  },

  answerTextStyle: {
    color: Colors.themeDark,
    
    fontSize: moderateScale(12), 
    marginBottom: 5, 
    marginHorizontal: 10
  }
});