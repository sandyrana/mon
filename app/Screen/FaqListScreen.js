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
export default class FaqListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
          token:'',
          FAQDATA: [
            {
              faqsID:1,
              faqsQuestion: "What is Backyard Builder?",
              isAnswerOpen: false,
              faqsAnswer: "Backyard Builder is an app that lets you design your landscape from the convenience of your own couch. All you need is a photo of your existing yard or to take a photo with the app. "
            },
            {
              faqsID:2,
              faqsQuestion: "Why would I use Backyard Builder?",
              isAnswerOpen: false,
              faqsAnswer: "Backyard Builder is the perfect way to decide how you want your landscape designed by letting you see it in action."
            },
            {
              faqsID:3,
              faqsQuestion: "How do I use Backyard Builder?",
              isAnswerOpen: false,
              faqsAnswer: "Start a new design and then upload a photo of your yard or take a photo with our app. To add any plant material, press the red “+” button in the bottom right corner. To search through our inventory and select your plant material, press the “+” button in the bottom center. You may now move and re-size the image to fit your design."
            },
    
            {
              faqsID:4,
              faqsQuestion: "Can I save a design and finish it later?",
              isAnswerOpen: false,
              faqsAnswer: "Yes! While working on your design, you will see a column of icons in the top right corner. Press the “Save” icon and your design will be waiting for you when you come back."
            },
            {
              faqsID:5,
              faqsQuestion: "Can I send my design directly to a nursery? ",
              isAnswerOpen: false,
              faqsAnswer: "You bet you can! Once you fill out your information and save a design (or 10 designs), our nurseries will be able to pull it up in the store and turn that design into a reality."
            },
          ],
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
      buttonQuestionPress(index) {
        let temp = this.state.FAQDATA; 
        temp[index].isAnswerOpen = !temp[index].isAnswerOpen;
        this.setState({ FAQDATA: temp });
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
                          <View style={styles.CardHeader}>
                         
                          <FlatList
                contentContainerStyle={{ paddingVertical: 10 }}
                style={{ marginTop:  moderateScale(40), paddingBottom: 10, width: "100%"}}
                data={this.state.FAQDATA}
                keyExtractor={item => "key" + item.faqsID}
                renderItem={({ item, index }) => (
                    <View style={styles.flatListViewHeaderStyle} key={index}>
                        <TouchableOpacity
                            style={{ flexDirection: "row",  marginHorizontal: 10, alignItems: "center",
                                justifyContent: "space-between",
                            }}
                            onPress={() => this.buttonQuestionPress(index)}
                        >
                            <Text style={styles.questionTextStyle}>
                                {item.faqsQuestion}
                            </Text>

                            <MaterialCommunityIcons
                                style={{alignSelf: "flex-end", marginVertical: 5}}
                                name={item.isAnswerOpen == true ? "chevron-up": "chevron-down"}
                                size={moderateScale(20)}
                                color={"red"}
                                onPress={() => this.buttonQuestionPress(index)}
                            />
                        </TouchableOpacity>

                        {item.isAnswerOpen ? (
                            <Text style={styles.answerTextStyle}>{item.faqsAnswer}</Text>
                        ) : null}
                    </View>
                )}
            />
      
                          </View>
      
      
  </KeyboardAvoidingView> 
                  </View>
                  <View style={styles.loginHeader}>
            <Text style={styles.loginHeaderText}>FAQ</Text>
          
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