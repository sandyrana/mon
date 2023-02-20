import React from 'react';
import { View, StyleSheet ,Text,  ScrollView, Image, Alert ,TouchableHighlight} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import { Actions } from 'react-native-router-flux';
const menu = [
    {
      displayName: "New Design",
      screen: "Dashboard"
    },
    {
      displayName: "My Designs",
      screen: "MyDesigns"
    },
    {
      displayName: "My Profile",
      screen: "MyProfile"
    },
    {
      displayName: "Tutorial",
      screen: "Tutorial"
    },
    {
      displayName: "FAQ",
      screen: "FAQ"
    },
    {
      displayName: "Contact Us",
      screen: "Questions"
    },
    {
      displayName: "About",
      screen: "About"
    },
    {
      displayName: "Logout",
      screen: "Logout"
    }
  ];
  
export default class DrawerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLogeedIn: true
        };
      }
      menuClickAction =(screen) =>{
        if(screen==="About"){
         Actions.aboutUsScreen()
        }else   if(screen==="Questions"){
          Actions.contactUsScreen()
        }else   if(screen==="FAQ"){
          Actions.faqListScreen()
         }else   if(screen==="MyProfile"){
          Actions.myProfileScreen()
         }else   if(screen==="Dashboard"){
          Actions.dashboardScreen()
         }else   if(screen==="MyDesigns"){
          Actions.myDesignScreen()
         }else   if(screen==="Tutorial"){
          Actions.tutorialsScreen()
         }else   if(screen==="Logout"){
          AsyncStorage.setItem("isLogin",false.toString())
          Actions.loginScreen()
         }
         
      }
    
      handleLogoutFunc =() =>{
        Alert.alert(
          ErrorHandling.alertTitle,
          ErrorHandling.logOutConfirmation,
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
                this.props.handleLogout(this.props.token);
                AsyncStorage.setItem('MyDesignImageId','')
                this.props.removeFieldData();
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
            <View style={styles.container}>
            <ScrollView
              style={{
                width: "100%",
                height: "100%"
              }}
              contentContainerStyle={{ paddingVertical: 15 }}
              showsVerticalScrollIndicator={false}
            >
               <TouchableHighlight
                  onPress={() =>Actions.dashboardScreen()}
                >
                   <Image source={images.mvnLogo} 
               style={styles.logoStyle} />
                </TouchableHighlight>
           
              {menu.map((item, index) => {
                return (
                  <TouchableHighlight
                  underlayColor={"rgba(0,0,0,0.2)"}
                  style={styles.drawerMenu}
                  onPress={() => this.menuClickAction(item.screen)}
                >
                  <Text style={styles.drawerMenuText}>{item.displayName}</Text>
                </TouchableHighlight>
                );
              })}
    
              <View style={{
                alignItems: "flex-start",
                justifyContent: "center",
                paddingLeft: "20%",
                paddingVertical: HEIGHT() * 0.02
                }}>
                <Text style={ styles.textStyle}>Backyard Builder v2.0</Text>
    
                <Text style={ styles.textStyle }>© 1995 - 2022 Moon Valley</Text>
    
                <Text style={styles.textStyle}>Nurseries All Rights Reserved </Text>
    
                {/* Android */}
                <Text style={ styles.textStyle }>Version: 1.16.09032020a </Text>
    
                {/* iOS */}
                {/* <Text style={ styles.textStyle }>Version: 1.9.06022020a </Text>*/}
    
              </View>
    
    
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 280,
        height: "100%",
        alignItems: "center",
        backgroundColor: "white",
      },
    
      logoStyle: {
        marginLeft:"20%",
        height: responsiveHeight(20),
        width: responsiveHeight(20),
        resizeMode: "contain",
      },
    
      textStyle: {
        color: Colors.themeGray,
        textAlign: "center",
        fontSize: responsiveFontSize(1.2),
        
      },
      drawerMenu: {
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: "20%",
        paddingVertical: responsiveHeight(1)
      },
    
      drawerMenuText: {
        color: Colors.themeGray,
        textAlign: "center",
        fontSize: responsiveFontSize(1.8),
        
      }
});
