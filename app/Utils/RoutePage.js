  
import React, { Component } from 'react';
import { Router, Scene ,Drawer, Actions} from 'react-native-router-flux';
import { BackHandler, ToastAndroid } from 'react-native';

var backButtonPressedOnceToExit = false;

import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import GetStarted  from '../Screen/GetStarted.js'
import RegisterPageOne from '../Screen/RegisterPageOne.js';
import RegisterPageTwo from '../Screen/RegisterPageTwo.js';
import RegisterPageThree from '../Screen/RegisterPageThree.js';
import LoginScreen from '../Screen/LoginScreen.js';
import ForgotPasswordScreen from '../Screen/ForgotPasswordScreen.js';
import DashboardScreen from '../Screen/DashboardScreen.js';
import DrawerList from '../Components/DrawerList.js';
import AboutUsScreen from '../Screen/AboutUsScreen.js';
import ContactUsScreen from '../Screen/ContactUsScreen.js';
import FaqListScreen from '../Screen/FaqListScreen.js';
import SplashScreen from '../Screen/SplashScreen.js';
import MyProfileScreen from '../Screen/MyProfileScreen.js';
import ResetPasswordScreen from '../Screen/ResetPasswordScreen.js';
import TutorialsScreen from '../Screen/TutorialsScreen.js';
import StartTutorialScreen from '../Screen/StartTutorialScreen.js';
import MyDesignScreen from '../Screen/MyDesignScreen.js';
import test from '../Screen/test.js';
export default class RoutePage extends Component {
  componentWillMount(){
   
  }

  componentWillUnmount(){
   
    }


    
  render() {
  return (
    <Router>
      <Scene key="root" >
      <Scene key="splashScreen"   component={SplashScreen} inital  hideNavBar={true}/>
      <Scene key="getStarted"   component={GetStarted}   hideNavBar={true}/>
      <Scene key="registerPageOne"   component={RegisterPageOne}  hideNavBar={true}/>
      <Scene key="registerPageTwo"   component={RegisterPageTwo}  hideNavBar={true}/>
      <Scene key="registerPageThree"   component={RegisterPageThree}  hideNavBar={true}/>
      <Scene key="loginScreen"   component={LoginScreen}  hideNavBar={true}/>
      <Scene key="forgotPasswordScreen"   component={ForgotPasswordScreen}  hideNavBar={true}/>
      
      <Drawer
      hideNavBar={true}
      key="drawerMenu"
      contentComponent={DrawerList}
      drawerWidth={280}
      drawerPosition="left">
        <Scene key="dashboardScreen" type = {'replace'}  component={DashboardScreen}  hideNavBar={true}/>
        <Scene key="aboutUsScreen"  component={AboutUsScreen}  hideNavBar={true}/>
        <Scene key="contactUsScreen"  component={ContactUsScreen}  hideNavBar={true}/>
        <Scene key="faqListScreen"  component={FaqListScreen}  hideNavBar={true}/>
        <Scene key="myProfileScreen"  component={MyProfileScreen}  hideNavBar={true}/>
        <Scene key="resetPasswordScreen"  component={ResetPasswordScreen}  hideNavBar={true}/>
        <Scene key="tutorialsScreen"  component={TutorialsScreen}  hideNavBar={true}/>
        <Scene key="startTutorial"  component={StartTutorialScreen}  hideNavBar={true}/>
        <Scene key="myDesignScreen"  component={MyDesignScreen}  hideNavBar={true}/>
        <Scene key="newTest"  component={test}  hideNavBar={true}/>
     </Drawer>
      </Scene>
      
    </Router>
  );
  }
}