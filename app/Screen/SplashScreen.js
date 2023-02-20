import React, { Component } from 'react';
import { SafeAreaView,StyleSheet,View,Image
} from 'react-native';
import FastImage from "react-native-fast-image";
import images from "../Utils/images";
import { Actions } from 'react-native-router-flux';
export default class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          };
    };
    componentDidMount = async() =>{
    setTimeout(function(){Actions.getStarted()}, 1000);
    }
    render() {
        return (
          <View style={{flex:1}}>
          <SafeAreaView style={{ flex: 1 }}>
            <FastImage style={{ flex: 1 }} source={images.getStartedBG}>
            <Image style={{ height :90,width :160 ,alignSelf : 'center',marginTop :100 }} source={images.mvnLogo}>
            </Image>
            </FastImage>
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
  
});