import React, { Component } from 'react';
import { SafeAreaView,ActivityIndicator,StyleSheet,
    Image,View,Text,Alert,TouchableOpacity,BackHandler, 
} from 'react-native';
import { WIDTH, HEIGHT, fontStyle } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import NetInfo from "@react-native-community/netinfo";
import Video from "react-native-video";
import {POSTApiAuth} from '../Utils/ApiCall.js';
import Snackbar from 'react-native-snackbar';
const backAction = () => {
    BackHandler.exitApp()
    return true;
  };
export default class GetStarted extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            videoLoad: false,
            isLogin :"false",
          };
    };
    componentDidMount = async() =>{
        BackHandler.addEventListener("hardwareBackPress", backAction);
        await   AsyncStorage.getItem("isLogin").then((value) => {
          console.log('isLogin :'+value)
          if(value!=null){
            this.setState({isLogin : value});
          }
        
      });
        this.getToken()
      }
      componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", backAction);  }

        getToken = async()=>{
            this.setState({loading : true})
            var result  = await POSTApiAuth({
              'action': 'getToken',
            });
            console.log("result :"+JSON.stringify(result))
            console.log("token :"+result.data.token)
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
                AsyncStorage.setItem("token",result.data.token.toString())
              }
            }
        }
    render() {
        return (
            <View style={{ flex:1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ flex:1 }}>
                <Video source={images.backyardVideo}
                  ref={(ref) => {
                    this.player = ref
                  }}
                  repeat={true}
                  resizeMode={"cover"}
                  style={{ height:"100%", width: "100%"}}
                />
              </View>
      
              <View style={[styles.container, { backgroundColor: "#0008", position: "absolute" }]}>
                <Image source={images.mvnLogo} style={styles.logoStyle} />
                     <TouchableOpacity
                       onPress={() => {
                        if(this.state.isLogin == "true"){
                          Actions.dashboardScreen()
                        }else {
                          Actions.loginScreen()
                        }
                       }}
                       style={styles.buttonStyle}
                     >
                       <Text style={styles.btnText}>START DESIGNING</Text>
                     </TouchableOpacity>
      
                     {this.state.isLoading && (
                       <View style={styles.fullScreenLoader}>
                         <ActivityIndicator
                           size="large"
                           color={Colors.ActivityIndicatorColor}
                         />
                       </View>
                     )}
                </View>
            </SafeAreaView>
          </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      },
    
      logoStyle: {
        height: HEIGHT() * 0.2,
        width: WIDTH() * 0.4,
        resizeMode: "contain",
        marginTop: HEIGHT() * 0.12,
      },
    
      buttonStyle: {
        marginBottom:HEIGHT() * 0.15,
        height: HEIGHT() * 0.08,
        paddingHorizontal: WIDTH() * 0.05,
        borderRadius: moderateScale(4),
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(4)
      },
    
      btnText: {
        color: "white",
        
        // textShadowColor: "rgba(0, 0, 0, 0.8)",
        // textShadowRadius: 6,
        // textShadowOffset: { width: 0, height: 2 },
        fontSize: moderateScale(16),
        textAlign: "center"
      },
      fullScreenLoader: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.7)"
      },
});