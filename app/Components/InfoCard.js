import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,StyleSheet,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { WebView } from 'react-native-webview';
import { moderateScale } from "../Utils/fontScaling";
import { Plus, Star } from "../../assets/icons";
import {responsiveHeight} from "../_constants/dimensions";
import Colors from '../../assets/Colors.js'
const htmlContent = `
    <h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <em style="textAlign: center;">Look at how happy this native cat is</em>
`;

export default class InfoCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: false
        };
    
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }
     componentDidMount (){
      var CustomLayoutSpring = {
        duration: 600,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleXY,
          springDamping: 0.8
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.8
        },
        delete: {
          duration: 600,
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity
        }
      };
      LayoutAnimation.configureNext(CustomLayoutSpring);
     }
    render() {
      const { onAdd, onFavourite, item } = this.props;
      console.log("item from infocard ====", item)
        return (
          <View style={styles.infoContainerStyle}>
          <View style={styles.cardContainer}>
            {/* <Text style={[styles.categoryName,{marginTop: responsiveHeight(-2)}]}>{item.name} </Text> */}
            <View style={styles.productTitleViewstyle}>
              <Text style={[styles.categoryName]}>{item.name} </Text>
              <Text style={styles.categoryBioName}>{item.botnical_name}</Text>
            </View>
            <View style={styles.imgContainer}>
              <TouchableHighlight
                  underlayColor={ "rgba(0,0,0,0.5)"}
                  onPress={onAdd}
              >
                <Image style={styles.imgStyle} source={{uri: item.image}} />
              </TouchableHighlight>
              <View style={styles.btnContainer}>
                <View
                  style={[styles.optionBtnStyle, { height: 24, width: 24 }]}
                />
  
                <TouchableOpacity
                  style={styles.optionBtnStyle}
                  onPress={onAdd}
                >
                  <Plus
                    iconColor={"white"}
                    onPress={onAdd}
                  />
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={styles.optionBtnStyle}
                  onPress={onFavourite}
                >
                  <Star
                    iconColor={item.is_favourite == '1'?"red":'white'}
                    onPress={onFavourite}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.productTitleViewstyle}>
              <Text style={styles.categoryName}>{`Product Information`}</Text>
            </View>
            <View style={styles.plantDetailContainer}>
              <WebView
                useWebKit={true}
                originWhitelist={["*"]}
                automaticallyAdjustContentInsets={false}
                source={Platform.OS =="android" ? { html: item.description } : {html: '<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">'+item.description}}
                // source={{ html: item.description }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // scalesPageToFit={false}
                decelerationRate="normal"
                onLoadStart={() => {this.setState({isLoading: true})}}
                onLoadEnd={() => {this.setState({isLoading: false})}}
              />
            </View>
          </View>
          {this.state.isLoading && Platform.OS =="android" &&
           <ActivityIndicator color={"transparent"} size={"large"}/>
          }
        </View>
        );
    }
}

const styles = StyleSheet.create({
  infoContainerStyle: {
    height: "100%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: HEIGHT() * 0.03
  },

  cardContainer: {
    flex: 1,
    margin: moderateScale(5),
    alignItems: "center",
    justifyContent: "center",
  },

  categoryName: {
    fontSize: moderateScale(14),
    
    color: Colors.themeDark,
    textAlign: "center"
  },

  categoryBioName: {
    fontSize: moderateScale(12),
    
    color: Colors.themeDark,
    textAlign: "center",
    resizeMode: "contain",
  },

  imgContainer: {
    elevation: 3,
    width: "100%",
    borderRadius: moderateScale(6),
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },

  imgStyle: {
    height: HEIGHT() * 0.3,
    width: "100%",
    resizeMode: "cover",
    borderRadius: moderateScale(6)
  },

  btnContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: moderateScale(5),
    borderBottomRightRadius: moderateScale(6),
    borderBottomLeftRadius: moderateScale(6)
  },

  optionBtnStyle: {
    padding: moderateScale(5)
  },

  plantDetailContainer: {
    width: "100%",
    height: HEIGHT() * 0.3,
  },

  productTitleViewstyle: {
    flex:1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: HEIGHT() * 0.01,
  }
});
