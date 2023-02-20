import React, { Component } from 'react';
import { SafeAreaView,KeyboardAvoidingView,StyleSheet,Modal,
    ScrollView,View,Text,Image,TouchableOpacity,BackHandler, Platform
} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { Menu1, Plus, Arrow, Search,Check,Star,Save, Menu } from "../../assets/icons";
import FastImage from "react-native-fast-image";
import Icon from 'react-native-vector-icons/FontAwesome';
import ErrorHandling from "../Utils/ErrorHandling";
import {launchCamera,launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import Snackbar from 'react-native-snackbar';
import MyView from "../_constants/MyView";
import Card from "../Components/Card";
import Spinner from 'react-native-loading-spinner-overlay';
import Tooltip from 'react-native-walkthrough-tooltip';
import {POSTApiAuth} from '../Utils/ApiCall.js';
const backAction = () => {
  Actions.pop()
    return true;
  };
export default class StartTutorialsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading :false,
          token:'',
          backgroundImageUrl: "",
          isPhotoTool: false,
          isDrawerOpen: false,
          isToolOpen: false,
          selectedMenuImage: "",
          isShowImageTool: false,
          isShowMenuTool: false,
          isShowFinishTool: false,
          isShowDrawer: false,
          isShowCategoryTool: false,
          isShowSubCategoryTool: false,
          selected: false,
          showImagePicker: false,
          categoryArrray : [
            {
                "cat_id": 8,
                "name": "Desert Trees",
                "image": "https://moonvalleynurseries.com/pub/media/catalog/category/desert_willow_bloom_edited_2019_571x571.jpg"
            },
            {
                "cat_id": 9,
                "name": "Flowering Trees",
                "image": "https://moonvalleynurseries.com/pub/media/catalog/category/blue_palo_verde_cspec_edited_2019_571x571.jpg"
            },
            {
                "cat_id": 10,
                "name": "Legacy Trees",
                "image": "https://moonvalleynurseries.com/pub/media/catalog/category/legacy_trees.jpg"
            },
            {
                "cat_id": 11,
                "name": "Oak & Magnolia Trees",
                "image": "https://moonvalleynurseries.com/pub/media/catalog/category/magnolia_and_oak_tree.jpg"
            },
        ],
        productArray : [
          {
              "is_favourite": "0",
              "product_id": "46",
              "name": "Desert Willow",
              "sku": "Desert Willow",
              "botnical_name": "Chilopsis linearis",
              "description": "<h1>Desert Willow</h1> \r\n<h2>Chilopsis linearis</h2> \r\n<ul> \r\n   <li><strong>Other common names include Flowering Willow, Willow-leaved Catalpa, Willowleaf Catalpa, Bow Willow, Desert Catalpa</strong></li> \r\n   <li><strong>Noted for its resemblance to Willows (willow-like leaves)</strong></li> \r\n   <li><strong>Fragrant, trumpet-shaped blossoms from spring to fall</strong></li> \r\n   <li><strong>Airy foliage can cast light shade</strong></li> \r\n   <li><strong>Deciduous</strong> </li> \r\n</ul> \r\n<p>Desert Willow, botanical name Chilopsis linearis, is a small to medium-size tree that blends well with any landscape style and gets bonus points for being able to cast light shade! These Southwest natives feature willow-like, long and narrow leaves and they typically grow along desert washes, hence the name. They are fast becoming a favorite small tree in landscapes both for their size and for their fragrant, trumpet-shaped blossoms that fill the air from spring to fall. The Penstemon flowers vary in color and range from pink to lavender, adding a beautiful contrast with the airy green foliage! Hummingbirds love the Desert Willow, especially in the summer, and if you're looking for a smaller tree that thrives in hot, arid climates, you'll love this Chilopsis linearis too! \r\n</p> \r\n<p>This fast-growing tree thrives in a location that gets plenty of full sun exposure. Once established, Desert Willow is drought tolerant with little to moderate water requirements, with just enough water, it can keep blooming and looking nice and green throughout the warm months. Homeowners and landscapers alike rave about its low-maintenance features, and this is an excellent tree for adding visual interest, so if you're looking for an easy-care tree that can add lots of curb appeal, use this Desert Willow to decorate your yard! \r\n</p> \r\n<p>Moon Valley Nurseries grows the best-quality Desert Willow trees, and we nurture them so that they will thrive in your landscape! We are the growers so that we can assure their quality! We make it easy to revamp your yard with free planting on all box sized trees! All you have to do is handpick the perfect trees, buy it, and we'll do the rest! \r\n</p>",
              "image": "https://moonvalleynurseries.com/pub/media/catalog/product/d/e/desert_wiilow.png"
          },
          {
              "is_favourite": "0",
              "product_id": "45",
              "name": "Jacaranda",
              "sku": "Jacaranda",
              "botnical_name": "Jacaranda mimosifolia",
              "description": "<h1>Jacaranda</h1><h2>Jacaranda mimosifolia</h2><p>Jacaranda mimosifolia is another one of the beautiful, large, and great-for-climbing shade trees that are grown and nurtured at our Moon Valley Nurseries. We sell younger, fast growing Jacaranda trees too. Jacaranda mimosifolia trees originate from Brazil and are admired for their beautiful, vibrant purple blooms in mid to late spring. The purple bell shaped flowers attract hummingbirds and other pollinators, making this Jacaranda tree a wonderful and colorful addition to any landscape. \r\n</p><p>Jacaranda mimosifolia is drought tolerant once established, has deep roots, and thrives in full sun environments. Though soft in appearance, Jacaranda trees are pretty tough and love growing in the intense summer heat that is common here in the Southwestern United States. Available as standard or multi-trunk, this semi-evergreen Jacaranda goes well with a tropical theme landscape design or even a desert landscape design. Since it is a semi-evergreen tree, it can provide excellent shade in the summer, and lets in the light during winter. This tree is fairly hardy after it gains some mature, hard wood, so feel free to buy a mature Jacaranda mimosifolia tree from the large inventory available at our Moon Valley Nurseries. \r\n</p><p>Part of its striking beauty comes from its soft, feathery, fern-like foliage and of course, the beautiful tubular flowers. Homeowners love to touch and feel the foliage while admiring its beauty up close and from a distance. Feel free to install nighttime landscape lighting and show off this beautiful tree to neighbors and passersby. This beauty can grow an up to 30-foot wide canopy, so you can expect to have an excellent amount of shade when you need it during those hot summer months but can also be trimmed to maintain a smaller width for tighter planting areas. \r\n</p> Homeowners looking to fill an open space on their property will love this vigorous, fast growing Jacaranda tree. Many will appreciate its easy to care for features. Pruning and maintenance is a breeze once you have this strikingly beautiful tree established on your landscape",
              "image": "https://moonvalleynurseries.com/pub/media/catalog/product/j/a/jacaranda_in_bloom.png"
          },
          {
              "is_favourite": "0",
              "product_id": "38",
              "name": "Tipu",
              "sku": "Tipu",
              "botnical_name": "Tipuana tipu",
              "description": "<h1>Tipu</h1>\r\n<h2>Tipuana tipu</h2>\r\n<p>One of if not the best shade tree you can plant on your property to not only give you great shade but year round beauty is a Tipu tree. Tipuana tipu, is a fast growing, colorful flowering medium to large sized tree that can provide a great amount of shade, as well as beauty for your landscape. From South America, Tipu trees put on a unique show of golden blooms from late spring into early summer that contrast beautifully with its feathery, bright bluish green foliage. It's a showy, semi-evergreen tree with abundant nectar that is sure to attract butterflies and pollinators into your garden. The Tipu tree also features a fissured bark texture which adds to its showy characteristic.</p>\r\n<p>Tipu trees are drought tolerant once established and will require full sun exposure as well as low to moderate water use. In the Southwest, especially in the desert, shade can be a lifesaver. Homeowners looking for an attractive shade tree with striking features will love this tree. It makes a good street tree or lawn tree and is a useful tree for a patio or terrace too. Have a picnic under a Tipu tree and enjoy the natural beauty and shade that this showy tree provides.</p>\r\n<p>Feel free to plant a Tipu tree as a feature plant or in a tropical landscape! Homeowners and landscapers alike are finding that the Tipuana tipu is quite useful in a wide range of landscape designs.</p>\r\n<p>Though these trees grow fast, we recommend buying as big as you can for instant shade and curb appeal! At Moon Valley Nurseries we grow and nurture the finest Tipu trees for sale, ready to thrive and bring the shade and beauty you want in your landscape! Feel free to so speak with our nursery professional for placement ideas.</p>\r\n<p>Visit one of our huge nursery locations and witness this beautiful tree for yourself. Be sure to plant with Moon Valley Nurseries brand Fertilizers and Nutrients for spectacular results!</p>",
              "image": "https://moonvalleynurseries.com/pub/media/catalog/product/t/i/tipu_mature_done.png"
          },
          {
              "is_favourite": "0",
              "product_id": "40",
              "name": "Purple Leaf Plum ",
              "sku": "Purple Leaf Plum ",
              "botnical_name": "Prunus cerasifera 'Krauter vesuvius'",
              "description": "<h1>Purple Leaf Plum </h1><h2>Prunus cerasifera 'Krauter Vesuvius'</h2><p>The Purple Leaf Plum, Prunus cerasifera 'Krauter Vesuvius', is a beautiful small to medium sized tree featuring vivid purple foliage that is sure to add curb appeal and impress your neighbors. During its seasonal bloom cycle, it produces luscious, puffy pink flowers that add even more color to any landscape. This is one showy ornamental tree that is sure to attract birds and butterflies too. The cultivar we sell, 'Krauter Vesuvius' is recognized for having the darkest foliage and for producing little to no fruit. </p><p>This low maintenance ornamental tree requires little pruning, making it a very desirable plant for both landscapers and homeowners. At Moon Valley Nurseries, we offer Purple Leaf Plum trees for sale that produce no fruit and practically no litter, making this an ideal tree for shading patios or placing around backyard seating areas. We recommend buying as big as you can to instantly adorn your property with the beauty that a specimen tree can bring to any setting. Feel free to speak with our nursery professional for placement ideas.</p><p>Homeowners with smaller yards will appreciate the size of this tree. It's a great addition to a small or medium space where strong color is desired. The strikingly beautiful color of this tree accents homes, parks, streets and makes a huge impact wherever it's planted. Even the tree's smooth gray to reddish bark is attractive.  Plant in any area in your landscape and enjoy this beautiful specimen all year long! It requires low to moderate water use and enjoys full sun environments, so it's a great choice for landscapes across the Southwest. </p><p>Plant with Moon Valley Nurseries line of fertilizers for spectacular results! We offer free professional planting on all box sized trees as well as the best warranty in the industry! You buy it, we can deliver and plant it!</p>",
              "image": "https://moonvalleynurseries.com/pub/media/catalog/product/p/u/purple_plum_on_tractor.png"
          },
      ]
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
  
       buttonFinishTutorialPress() {

        AsyncStorage.setItem('MyDesignImageId','')
         Actions.pop()
    
    }

    buttonSkipTutorialPress(){
      this.buttonFinishTutorialPress()
    }
    parentMethod(data)
    {
      this.setState({ isDrawerOpen: false, selectedMenuImage: data.image, isShowImageTool: true })
    }

    buttonNextStepPress(){
      if(this.state.isShowImageTool){
        this.setState({ isShowImageTool: false})
        this.setState({ isShowMenuTool: true })
      } else {
        this.setState({ isShowMenuTool: false })
        this.setState ({ isShowFinishTool: true})
      }
    }

    buttonRestartTutorialPress() {
        this.setState({
          backgroundImageUrl: "",
          isPhotoTool: true,
          isDrawerOpen: false,
          isToolOpen: false,
          selectedMenuImage: "",
          isShowImageTool: false,
          isShowMenuTool: false,
          isShowFinishTool: false,
          isShowDrawer: false,
          isShowCategoryTool: false,
          isShowSubCategoryTool: false,
          selected: false,
        })
    }

    handleAddPlant() {
      this.setState({
        isShowSubCategoryTool: false,
        selected: !this.state.selected,
        isDrawerOpen: false,
        //isShowDrawer: false
      });

      if(Platform.OS == "ios"){
        setTimeout(() => {
          this.setState({ isShowDrawer: false })
        }, 10);
      } else{
          this.setState({ isShowDrawer: false });
      }

      setTimeout(() => {
      this.setState({ selectedMenuImage: this.state.productArray[0].image, isShowImageTool: true })
      }, 10);
    }

    handleCategoryClick() {
      this.setState({ isShowCategoryTool: false});

      setTimeout(() => {
        this.setState({ selected: !this.state.selected })
        this.setState ({ isShowSubCategoryTool: true})
      }, 10);
    }

    _renderButton = (text,icon) => (
      <View style={{ flexDirection: "row", marginVertical: 15, alignItems: "center", justifyContent: "center"}}>
      <Text style={styles.detailTextStle}> {text} </Text>
      <TouchableOpacity style={styles.shadowButtonstyle}
      disabled={true}
          >
           <Icon name={icon} size={25} color="white" style={{padding:2}}  />
      </TouchableOpacity>
      </View>
    );


    handleBottomViewContent() {

       if (this.state.selected ) {

        return (
            <ScrollView
                horizontal
                style={{ flex: 1 }}
                contentContainerStyle={styles.contentContainerStyle}
                scrollEnabled={false}
            >
            <Tooltip
                animated
                isVisible={this.state.isShowSubCategoryTool}
                content={<Text style={ {  color: "black",
                fontSize: moderateScale(12),
                textAlign: "center",
                marginVertical: moderateScale(2) }}> {`Tap/Click the {+} icon or drag your \n tree/plant onto your design`} </Text>}
                placement={"top"}
                // onClose={ () => {
                //   this.setState({ isShowSubCategoryTool : false})
                //   setTimeout(() => {
                //     this.setState({ isShowDrawer : false})
                //     this.buttonSkipTutorialPress()
                //   }, 10);
                // }}
            >
              <Card
                item={this.state.productArray[0]}
                optionBtn={true}
                onPressInfo={() => {}}
                onAdd={() => this.handleAddPlant()}
                onFavourite={() => {}}
              />
            </Tooltip>
              <Card
                item={this.state.productArray[1]}
                optionBtn={true}
                onPressInfo={() => {}}
                onAdd={() => this.handleAddPlant()}
                onFavourite={() => {}}
              />

              <Card
                item={this.state.productArray[2]}
                optionBtn={true}
                onPressInfo={() => {}}
                onAdd={() => this.handleAddPlant()}
                onFavourite={() => {}}
              />

              <Card
                item={this.state.productArray[3]}
                optionBtn={true}
                onPressInfo={() => {}}
                onAdd={() => this.handleAddPlant()}
                onFavourite={() => {}}
              />
            </ScrollView>
        );
      }
      else {
        return (
            <ScrollView
                horizontal
                style={{ flex: 1}}
                contentContainerStyle={styles.contentContainerStyle}
                scrollEnabled={true}
            >
              <Card
                item={this.state.categoryArrray[0]}
                optionBtn={false}
                onPressCategory={() =>{}}
              />
                <Tooltip
                isVisible={this.state.isShowCategoryTool}
                content={<Text style={{ color: "black",
                fontSize: moderateScale(12),
                textAlign: "center",
                marginVertical: moderateScale(2)} }> {`Select the category you are interested in.`} </Text>}
                placement={"top"}
                // onClose={ () => {
                //   this.setState({ isShowCategoryTool : false})
                //   setTimeout(() => {
                //     this.setState({ isShowDrawer : false})
                //     this.buttonSkipTutorialPress()
                //   }, 10);

                // }}
              >
                 <Card
                  item={this.state.categoryArrray[1]}
                  optionBtn={false}
                  onPressCategory={() => { this.handleCategoryClick() }}
                />
              </Tooltip>
               <Card
                item={this.state.categoryArrray[2]}
                optionBtn={false}
                onPressCategory={() =>{ }}
              />
               <Card
                item={this.state.categoryArrray[3]}
                optionBtn={false}
                onPressCategory={() =>{ }}
              />
            </ScrollView>
        );
      }
    }

    selectFile = () => {
      this.setState({showImagePicker :false})
      AsyncStorage.setItem("CameraOpen","true")
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      
      launchImageLibrary(options, (res) => {
        console.log('Response = ', res);
  
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          this.setState({ isPhotoTool: false, isDrawerOpen: true, isToolOpen: true })
          this.setState({ backgroundImageUrl: res.uri });
        }
      });
    };
  
    cameraLaunch = () => {
      this.setState({showImagePicker :false})
      AsyncStorage.setItem("CameraOpen","true")
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
     launchCamera(options, (res) => {
        console.log('Response = ', res);
  
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          this.setState({ isPhotoTool: false, isDrawerOpen: true, isToolOpen: true })
          this.setState({ backgroundImageUrl: res.assets[0]?.uri });
        }
      });
  }
    renderDashBottomView() {


      return (
          <View style={styles.drawerContainer}>

            <View style={styles.drawerShadow}>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={ { marginVertical: 10, marginHorizontal: 10,height: 50,
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
                      } }}
                >
                  {/* <MaterialCommunityIcons
                      name="chevron-left"
                      size={moderateScale(30)}
                      color={"white"}
                  /> */}
                  <Arrow
                    iconColor={"white"}
                  />
                </TouchableOpacity>

                    <TouchableOpacity
                      style={ {marginVertical: 5 ,height: 50,
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
                    >
                      <Search
                          iconColor={"white"}
                      />
                    </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginVertical: 5,height: 50,
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
                      } }}
                >
                  <Star
                      iconColor={"white"}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, height:responsiveHeight(33) }}>{this.handleBottomViewContent()}</View>

            </View>
          </View>
      );
    }
       handleDashboardView() {

        if (this.state.backgroundImageUrl !== "") {
          return (
            <View style={styles.container2}>
  
              {this.state.selectedMenuImage != "" &&
                <Tooltip
                  animated
                  isVisible={this.state.isShowImageTool}
                  content={
                  <View>
                    <TouchableOpacity
                      style={styles.buttonStyle}
                      onPress = {() => this.buttonNextStepPress()}
                    >
                      <Text style={styles.btnTextStyle}> OK Next Step </Text>
                    </TouchableOpacity>
                    <Text style={ { textAlign: "right", marginRight: 30, color: "black",
    fontSize: moderateScale(10),
    textAlign: "center",
    marginVertical: moderateScale(2),paddingBottom :moderateScale(6)}
     }> {`Tap to move, rotate or resize a tree or plant.\nLong press to edit a tree or plant.`} </Text>
                  </View>
                  }
                  placement="left"
                  // onClose={ () => {
                  //   this.setState({ isShowImageTool : false})
                  //   this.buttonSkipTutorialPress()
                  // }}
                >
                <View style={styles.viewBaseStyle}>
                  <View style={this.state.isShowImageTool ? [styles.stickerContainer, {borderWidth: 2,borderColor: '#000'}]: styles.stickerContainer}>
                    <Image style={styles.pinchableImage} source={{uri: this.state.selectedMenuImage}}/>
                  </View>
                </View>
                </Tooltip>
              }
  
              {this.state.selectedMenuImage != "" && !this.state.isShowFinishTool &&
               <MyView  style={{right:15,bottom:15,position:"absolute"}} key="designImageMenu">
                <Tooltip
                animated
                isVisible={this.state.isShowMenuTool}
                content={
                  <View >
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress = {() => this.buttonNextStepPress()}
                  >
                    <Text style={styles.btnTextStyle}> OK Next Step </Text>
                  </TouchableOpacity>
                  <Text style={ {textAlign: "right", marginRight: 30, color: "black",
    fontSize: moderateScale(10),
    marginVertical: moderateScale(2)}}> {`From this toolset you can also Duplicate, \nErase and Delete trees and plants.`} </Text>
                  </View>
                }
                placement="left"
                // onClose={ () => {
                //   this.setState({ isShowMenuTool : false})
                //   this.buttonSkipTutorialPress()
                // }}
              >
                {this._renderButton('Copy','clone')}
                {this._renderButton('Erase','eraser')}
                {this._renderButton('Delete','trash')}
                {this._renderButton('Close','times')}
                </Tooltip>
               </MyView>
              }
  
              {this.state.isShowFinishTool &&
               <MyView  style={styles.myViewStyle} key="FinishView">
                <View style={{height:"100%", width: "100%",  backgroundColor: "rgba(0,0,0,0.6)"}}>
                </View>
  
                 <View style={{flex:1, position:"absolute", alignSelf: "center",flexDirection: "column"}}>
                  <TouchableOpacity
                    style={styles.finishTutorialStyle}
                    onPress = {() => this.buttonFinishTutorialPress()}
                  >
                    <Text style={styles.btnTextStyle}>FINISH TUTORIAL</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                    style={styles.blankButtonStyle}
                    onPress={() => this.buttonRestartTutorialPress()}
                  >
                    <Text style={styles.btnTextStyle}>RESTART TUTORIAL</Text>
                </TouchableOpacity>
                </View>
  
                <View style={{position: "absolute", top: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                  <Text style={{textAlign: "right", color: "white",
    fontSize: moderateScale(10),
    textAlign: "center",
    marginVertical: moderateScale(2)}}> {`Use the Finish Icon to save, submit your \ndesign and schedule a consultation`} </Text>
                  <TouchableOpacity
                    style={{ height: 50,
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
                    disabled={true}
                  >
                    <Check iconColor={"white"}/>
                  </TouchableOpacity>
                </View>
  
                <View style={{position: "absolute",top:70, right: 0, flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: "center"}}>
                  <Text style={{textAlign: "right", color: "white",
    fontSize: moderateScale(10),
    textAlign: "center",
    marginVertical: moderateScale(2)}}> {`Use the Save Icon to save \n a draft of your design.`} </Text>
                  <TouchableOpacity
                    style={{ height: 50,
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
                    disabled={true}
                  >
                    <Save iconColor={"white"} />
                  </TouchableOpacity>
                </View>
  
                <View style={{position: "absolute", bottom: 0, left: 0, flexDirection: "column"}}>
                  <Text style={{textAlign: "left", marginLeft: 20, color: "white",
    fontSize: moderateScale(10),
    textAlign: "center",
    marginVertical: moderateScale(2)} }> {`Use this Icon at any time during design to \n see your list of current design inventory.`} </Text>
                  <TouchableOpacity
                    style={{ height: 50,
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
                    disabled={true}
                  >
                    <MaterialCommunityIcons
                      name="clipboard-text"
                      size={moderateScale(24)}
                      color={"white"}
                    />
                  </TouchableOpacity>
                </View>
  
                <TouchableOpacity
                  style={ { position: "absolute", bottom: 0, right: 0 , height: 50,
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
                  disabled={true}
                >
                  <Plus iconColor={"white"}/>
                </TouchableOpacity>
  
                <View style={{position: "absolute", top: 0, left: 0, flexDirection: "column"}}>
                  <TouchableOpacity
                    style={{ height: 50,
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
                    disabled={true}
                  >
                    <Menu iconColor={"white"} />
                  </TouchableOpacity>
                  <Text style={{textAlign: "left", marginLeft:20,  color: "white",
    fontSize: moderateScale(10),
    textAlign: "center",
    marginVertical: moderateScale(2)}}> {`Use the Menu Icon to open the Menu \n and navigate Backyard Builder.`} </Text>
                </View>
              </MyView>
              }
  
              {this.state.isDrawerOpen &&
               <View style = {{ flex:1, width: "100%", alignItems: "flex-end", justifyContent: "flex-end"}}>
               <Tooltip
                 animated
                 isVisible={this.state.isToolOpen}
                 content={<Text style={{ color: "black",
                 fontSize: moderateScale(10),
                 textAlign: "right",
                 marginVertical: moderateScale(2)}}> {`Let's add a tree / plant to your design. Open the \n drawer to browse our collection.`} </Text>}
                 placement="left"
                //  onClose={ () => {
                //   this.setState({ isToolOpen : false})
                //   this.buttonSkipTutorialPress()
                // }}
               >
                 <View  style = {{height: 100, width: 100 , bottom: 0, right: 0, margin: 20, alignItems: "center", justifyContent: "center", backgroundColor: "transparent"}}>
                  <TouchableOpacity
                    style={
                    { position: "absolute", bottom: 0, right: 0 , height: 50,
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
                    onPress={() => {
                      this.setState({ isToolOpen: false})
                      setTimeout(() => {
                        this.setState({ isShowDrawer: true})
                        this.setState({ isShowCategoryTool: true})
                      }, 10);
  
                    }}
                  >
                    <Plus
                      iconColor={"white"}
                      onPress={() => {
                        this.setState({ isToolOpen: false})
                        setTimeout(() => {
                          this.setState({ isShowDrawer: true})
                          this.setState({ isShowCategoryTool: true})
                        }, 10);
                      }}
                    />
                  </TouchableOpacity>
                  </View>
                </Tooltip>
                </View>
              }
  
            </View>
          );
        } else {
  
  
          return (
            <View style={{ flex:1, alignItems: "center", justifyContent: "flex-start"}}>
            {/*  <Tooltip
                animated
                isVisible={this.state.isPhotoTool}
                content={<Text ></Text>}
                onClose={ () => {
                  this.setState({ isPhotoTool : false})
                  this.buttonSkipTutorialPress()
                }}
              >*/}
              <TouchableOpacity
                 onPress={ () => {
                   this.setState({ isPhotoTool : false})
                   this.buttonSkipTutorialPress()
                 }}
                 style={styles.buttonStyleSkip}
               >
                 <Text style={styles.textStyle}> SKIP TUTORIAL </Text>
               </TouchableOpacity>
               <View style={{ flex: 1, width:"100%", alignItems:"center",justifyContent:"center"}}>
              <Text style={{marginBottom: moderateScale(20), color: "white",
    fontSize: moderateScale(10),
    textAlign: "center",
    marginVertical: moderateScale(2)} }> To begin, upload a photo of the yard you want to design. </Text>
                <View style={styles.blurContainer}>
                  <TouchableOpacity
                    style={styles.uploadViewContainer}
                    onPress={() => {this.setState({showImagePicker :true})}}
                  >
                  <Plus
                    style={{ height: 60, width: 60 }}
                    onPress={() => {this.setState({showImagePicker :true})}}
                  />
                  <Text style={styles.uploadContainerText}>
                    Upload your yard photo here
                  </Text>
                </TouchableOpacity>
              </View>
              </View>
          {/*  </Tooltip>*/}
          </View>

          );
  
        }
      }
   
    
    render() {
        return (
          <View style={{flex:1}}>
          <SafeAreaView style={{ flex: 1 }}>
            <FastImage 
             style={{ flex: 1 }}
             source={
              this.state.backgroundImageUrl !== ""
              ? { uri: this.state.backgroundImageUrl }
              : images.registerBG
          }>
            <Spinner
          visible={this.state.loading}
        />
            <View style={styles.container}>
            {this.handleDashboardView()}
            <Modal
            animationType="slide"
            transparent
            visible={this.state.showImagePicker}
            onRequestClose={() => {
               this.setState({ showImagePicker: false})
            }}
            supportedOrientations={["portrait", "landscape"]}
          >
         <View style={styles.optionsContainer}> 
         <View style={styles.optionsContainer2}> 
       <Text style = {styles.textRegister}>Choose Options</Text>
          <View style = {{flexDirection : 'row' ,alignItems : 'center', justifyContent : 'center'}}>
          <TouchableOpacity style={styles.viewButton221}  onPress = {() => this.cameraLaunch()}>
               <Text style={styles.text4} >Camera</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.viewButton221}  onPress = {() => this.selectFile()}>
               <Text style={styles.text4} >Gallery</Text>
               </TouchableOpacity>
          </View>
          </View>
          </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent
            visible={this.state.isShowDrawer}
            onRequestClose={() => {
              // this.setState({ isShowDrawer: false})
            }}
            supportedOrientations={["portrait", "landscape"]}
          >

            <View style={styles.bottomDrawerContainer}>
              { this.renderDashBottomView() }
            </View>

          </Modal>

                </View>
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
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  container2: {
    flex: 1,
    width :"100%",
    height:"100%",
    alignItems: "center",
    justifyContent: "center"
  },
  textRegister: {fontSize : 25,color : Colors.black, paddingTop : 50, paddingBottom : 50,alignSelf : 'center'},
  viewButton221: {height:45,borderRadius : 5,borderWidth :1,borderColor  :Colors.lightGray,backgroundColor : Colors.lightGray,width : 150, alignSelf : 'center',marginRight :10 },
  viewButton222: {height:45,borderRadius : 5,borderWidth :1,borderColor  :Colors.lightGray,backgroundColor : Colors.lightgray,width : 150, alignSelf : 'center',marginLeft :10 },
  text4: {fontSize : 15,color : Colors.black, paddingTop : 10, paddingBottom : 10,alignSelf : 'center'},
  optionsContainer: {
   flexDirection : 'column',
    width: "100%",
    alignItems : 'center',justifyContent : 'center',
    height :"100%",
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  optionsContainer2: {
    flexDirection : 'column',
     width: 400,
     height :250,
     backgroundColor: "white"
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
  MainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },


  baseViewStyle: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },

  textStyle: {
    color: "white",
    fontSize: moderateScale(12),
    textAlign: "center",
    marginVertical: moderateScale(2)
  },

  btnTextStyle: {
    color: "white",
    
    fontSize: moderateScale(12),
    textAlign: "center",
    marginVertical: moderateScale(2)
  },

  buttonStyle: {
    marginTop: HEIGHT() * 0.015,
    marginBottom: HEIGHT() * 0.005,
    height: HEIGHT() * 0.06,
    width: WIDTH() * 0.25,
    borderRadius: moderateScale(3),
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end", marginRight: 30
  },

  buttonStyleSkip: {
    marginTop: Platform.OS === 'ios' ? responsiveHeight(3.2) + 10 : responsiveHeight(4)+ 10,
    height: HEIGHT() * 0.07,
    width: WIDTH() * 0.25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    borderColor: "white",
    borderWidth: 1.0,
    borderRadius: 5.0
  },

  finishTutorialStyle: {
    height: HEIGHT() * 0.06,
    width: WIDTH() * 0.25,
    borderRadius: moderateScale(3),
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  blankButtonStyle: {
    marginTop: (HEIGHT() * 0.035),
    height: HEIGHT() * 0.06,
    width: WIDTH() * 0.25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderColor: "white",
    borderWidth: 1.0,
    borderRadius: 5.0
  },

  buttonSkipTutorialStyle: {
    marginTop: HEIGHT() *0.035,
    marginBottom: HEIGHT() * 0.075,
    height: HEIGHT() * 0.06,
    width: WIDTH() * 0.25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",

  },

  blurContainer: {
    height: HEIGHT() * 0.4,
    width: WIDTH() * 0.8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    alignSelf: "center"
  },

  uploadViewContainer: {
    width: "85%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dotted",
    borderColor: "black",
    borderWidth: 2,
  },

  uploadContainerText: {
    position: "absolute",
    bottom: moderateScale(5),
    right: moderateScale(20),
    fontSize: moderateScale(16),
   
    color: Colors.themeGray
  },

  bottomDrawerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "yellow"
  },

  viewBaseStyle: {
    height:250,
    width:250,
    alignItems: "center",
    justifyContent: "center"
  },

  stickerContainer: {
    height:200,
    width:200,
    backgroundColor:'transparent',
    alignItems: "center",
    justifyContent: "center"
  },

  pinchableImage: {
    width: 160,
    height: 160,
  },

  shadowButtonstyle: {
    height: 50,
    width: 50,
    marginLeft: 10,
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

  detailTextStle: {
    paddingHorizontal: 10,
    paddingVertical: 3,
   
    fontSize: moderateScale(10),
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 1.0,
    borderRadius: 5.0,
    overflow: 'hidden'
  },

  myViewStyle:{
    top:0,
    left:0,
    bottom:0,
    right: 0,
    position:"absolute",
    alignItems: "center",
    justifyContent: "center"
  },

  drawerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },

  drawerShadow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "white",
    // elevation: 6,
    // shadowColor: "#000",
    // shadowOpacity: 0.3,
    // shadowOffset: {
    //   width: 0,
    //   height: -6
    // }
  },

  menuContainer: {
    backgroundColor: "white",
    height: "100%",
    height:responsiveHeight(33),
    alignItems: "center",
    justifyContent: "space-between",
    elevation: moderateScale(15),
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: moderateScale(5),
      height: 0
    }
  },

  contentContainerStyle: {
    flexGrow: 1,
    alignItems: "flex-start",
    padding: moderateScale(10)
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

});