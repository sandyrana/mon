import React, {Component} from 'react';
import {Platform, StyleSheet, Linking,Text, View,LogBox,StatusBar,Alert,SafeAreaView} from 'react-native';
import RoutePage from './app/Utils/RoutePage.js'
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners'
LogBox.ignoreAllLogs()
import  Colors  from './assets/Colors.js';
export default class App extends Component {
  state = {
    response: {},
    loading :false,
  };
    componentDidMount = async () => {
    }
  
    componentWillUnmount() {
    }
  render() {
    return (
      <View style ={{flex : 1}}>
      <StatusBar
      backgroundColor={Colors.statusbar}
      barStyle="light-content"
  />  
      <SafeAreaView style ={{flex : 1}} forceInset = {{top : 'never'}} >
      <RoutePage/>
      </SafeAreaView>
      </View>
    );
  }
}
