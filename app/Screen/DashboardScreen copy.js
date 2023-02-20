import React, { Component } from 'react';
import {  SafeAreaView,NetInfo,BackHandler,ActivityIndicator,View,StatusBar, Alert, Text, Image,
  Modal, Animated, Dimensions, TouchableOpacity, FlatList,StyleSheet,Platform} from 'react-native';
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from "react-native-fast-image";
import { Actions } from 'react-native-router-flux';
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import Snackbar from 'react-native-snackbar';
import { Check,  Plus, Save,Menu1} from "../../assets/icons";
import Loader from "../Components/Loader";
import ProgressiveImage from "../Components/ProgressiveImage.js";
import {POSTApiAuth,POSTFormApiAuth} from '../Utils/ApiCall.js';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewShot,{ captureScreen  } from "react-native-view-shot";
// import Share from 'react-native-share';
import DashBottomDrawer from "../Components/DashBottomDrawer";
import DesignFormView from "../Components/DesignFormView";
import ErrorHandling from "../Utils/ErrorHandling";
let userId='',nextScreenToAppear='';
let myStringArray='',productTitle='';
const w = Dimensions.get('window');
import { PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State,TapGestureHandler,LongPressGestureHandler,NativeViewGestureHandler } from 'react-native-gesture-handler';
import MyView from "../_constants/MyView";
import SaveDesignDraft from "../Components/SaveDesignDraft";
const USE_NATIVE_DRIVER = false; // https://github.com/kmagiera/react-native-gesture-handler/issues/71
const MINIMUM_STICKER_SCALE = 0.5;
const MAXIMUM_STICKER_SCALE = 3.5;
let myCount=0;
let eraseImageCount = 0;
let uploadDesignType = "Draft";
import SketchView from '../_constants/SketchView.js';
const sketchViewConstants = SketchView.constants;
const tools = {};
tools[sketchViewConstants.toolType.pen.id] = {
  id: sketchViewConstants.toolType.pen.id,
  name: sketchViewConstants.toolType.pen.name,
  nextId: sketchViewConstants.toolType.eraser.id
};
tools[sketchViewConstants.toolType.eraser.id] = {
  id: sketchViewConstants.toolType.eraser.id,
  name: sketchViewConstants.toolType.eraser.name,
  nextId: sketchViewConstants.toolType.pen.id
};
const backAction = () => {
  Actions.pop()
    return true;
  };
  const r = Math.random() * new Date().getMilliseconds();
  function getNewOrderID() {
    var update = ""
    update = 'moonvalley' +
      (1 + Math.floor(r % 2000) + 10000) +
      'b' +
      (Math.floor(r % 100000) + 10000)
    return update;
  }
  
export default class DashboardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        imageLoader: false,
        showImagePicker: false,
        bottomShow : false,
        toolSelected: sketchViewConstants.toolType.eraser.id,
        drawBackgroundImage:false,
        showDesignImageMenu :false,
        inImageEditMode :false,
        selectedImagePosition:0,
        saveDesignForm:false,
        designForm:false,
        isSaveDesign:false,
        imageUri:'',
        imageURL : 'https://moonvalleynurseries.com/pub/media/catalog/category/desert_willow_bloom_edited_2019_571x571.jpg',
        isLoading: false,
        myValue:'',
        initialBackgroundImage:'',
        selectedImageItem:'',
        width: 100,
        height: 100,
        top: 100,
        left: 100,
        rotateAngle: 0,
        selectedImage:'',
        showDesignView:false,
        showActionIcons:true,
        showSnapView:false,
        snapFilePath:'',
        selectedItemKey:'',
        selectedProductId:'',
        showCropView:false,
        onBottomTap:false,
        isPressDone: false,
        isSubmitData: false,
        isDesignForm:false,
        getDesignByIDData: [],
        Email: "",
        Name: "",
        Phone: "",
        onEraseTap:false,
        imageSnapURL : '',
        IsModelVisible:false,
        //subjects: [{key:'edit',text:'Edit'},{key:'delete',text:'Delete'},{key:'moveup',text:'Move Up'},{key:'movedown',text:'Move Down'},{key:'close',text:'Close'} ],
        subjects: [{key:'edit',text:'Edit'},{key:'clone',text:'Clone'},
            {key:'delete',text:'Delete'},{key:'close',text:'Close'} ],

        lastImageKey:2,
        lastImageDetails:[],


        visibleModal: 0,
        isModalVisible: false,
        selectedMenuImage:"",
        selectedMenuText:"",
        //selectedMenuImage:"",
        debugText:"",
          };
            /* Pinching */
      this.baseScale = new Animated.Value(1);
      this.pinchScale = new Animated.Value(1);
      this.scale = Animated.multiply(this.baseScale, this.pinchScale).interpolate({
          inputRange: [MINIMUM_STICKER_SCALE, MAXIMUM_STICKER_SCALE],
          outputRange: [MINIMUM_STICKER_SCALE, MAXIMUM_STICKER_SCALE],
          extrapolate: 'clamp',
      });
      this.lastScale = 1;

      this.onPinchGestureEvent = Animated.event(
          [{ nativeEvent: { scale: this.pinchScale } }],
          { useNativeDriver: USE_NATIVE_DRIVER }
      );

      this.onPinchGestureEventCrop = Animated.event(
          [{ nativeEvent: { scale: this.pinchScale } }],
          { useNativeDriver: USE_NATIVE_DRIVER }
      );

      /* Rotation */
      this.rotate = new Animated.Value(0);
      this.rotateStr = this.rotate.interpolate({
          inputRange: [-100, 100],
          outputRange: ['-100rad', '100rad'],
      });
      this.lastRotate = 0;
      this.onRotateGestureEvent = Animated.event(
          [{ nativeEvent: { rotation: this.rotate } }],
          { useNativeDriver: USE_NATIVE_DRIVER }
      );

      /* Pan */
      this.translateX = new Animated.Value(0);
      this.translateY = new Animated.Value(0);
      this.translateXc = new Animated.Value(0);
      this.translateYc = new Animated.Value(0);
      this.lastOffset = { x: 0, y: 0 };
      this.onPanGestureEvent = Animated.event(
          [
              {
                  nativeEvent: {
                      translationX: this.translateX,
                      translationY: this.translateY,
                  },
              },
          ],
          { useNativeDriver: USE_NATIVE_DRIVER }
      );

      this.onPanGestureEventCrop = Animated.event(

          [
              {
                  nativeEvent: {
                      translationX: this.translateXc,
                      translationY: this.translateYc,
                  },
              },
          ],
          { useNativeDriver: USE_NATIVE_DRIVER }
      );


      /* Design View Images */
      let tmpRotate = new Animated.Value(0);
    };


    isEraserToolSelected() {
      return this.state.toolSelected === sketchViewConstants.toolType.eraser.id;
  }

  toolChangeClick() {
      this.setState({toolSelected: tools[this.state.toolSelected].nextId});
  }

  getToolName() {
      return tools[this.state.toolSelected].name;
  }

  onSketchSave(saveEvent) {
      this.updateEraseImage(saveEvent.localFilePath)

  }


  Details = []
  ProductArray=[]

  _showModal = () => this.setState({ isModalVisible: true })

  _hideModal = () => this.setState({ isModalVisible: false })

  _buttonClose = (
      <View style={styles.buttonClose}>
          <Icon name="window-close" size={25} backgroundColor="#3b5998" onPress={() =>
          {this.setState({ visibleModal: 0 })}}/>
      </View>
  );

  _renderModalContent = (modelNo) =>
      (
          <View style={styles.modalContent}>

              <Text>Coming soon !!{modelNo}</Text>
              {this._renderButton('Close','window-close', () => this.setState({ visibleModal: 0 }))}
          </View>
      );
_getKeys(){
  return this.Details.map(d => d.key);
}

_getMaxKey() {
          //return this.Details.reduce((max, p) => p.key > max ? p.key : max, this.Details[0].key);
          if(this._getKeys().length>0){
              return Math.max(...this._getKeys());
          }
          else{
              return 0;
          }
          
        }

  updateSnapArray(Data){

      //DO NOT pass value by Reference and use pure function
      const newData=JSON.parse(JSON.stringify(Data));
      //console.log("sjjjjjjjjsjsjQWWW",newData)
      let nextKey=this._getMaxKey()+1
      this.setState({lastImageKey:nextKey})
      console.log("MaxKey",this.Details,this._getKeys(),nextKey)
      //this.state.lastImageKey++;
      this.Details.push({
          productId:newData.productId,
          key:nextKey,
          type: newData.type,
          image: newData.image,
          viewWidth:newData.viewWidth,
          viewHeight:newData.viewHeight,
          width:newData.width,
          height:newData.height,
          scale:newData.scale,
          lastScale: newData.lastScale,
          rotate:newData.rotate,
          lastRotate:newData.lastRotate,
          top:newData.top,
          left:newData.left,
          lastOffsetX: newData.lastOffsetX,
          lastOffsetY: newData.lastOffsetY
      });

      // this.ProductArray.push(this.state.selectedProductId)
      console.log("ProductArrayUpdateSnap",this.ProductArray)

  }


    componentDidMount = async() =>{
    
      Actions.drawerClose()
        BackHandler.addEventListener("hardwareBackPress", backAction);
        await   AsyncStorage.getItem("token").then((value) => {
          console.log('token :'+value)
          if(value!=null){
            this.setState({token : value});
          }
        
      });
      const { userData } = this.props;
      var telephone = ""
      if(userData) {
        console.log("userdata ====",userData);
        if (userData.DATA.addresses){
            if(userData.DATA.addresses.length > 0){
                telephone = userData.DATA.addresses[0].telephone;
            } else{
                telephone = ""
            }
        }
        userId = userData.DATA.id 
        this.setState({
            Email: userData.DATA.email,
            Name: userData.DATA.firstname + " " + userData.DATA.lastname,
            Phone: telephone,
        })
      }
     
      AsyncStorage.getItem('MyDesignImageId')
          .then(value => {
              if(value && value!==null)
              {
                this.getDesignByIDApi(value)
              }
          }).catch(error=> {

      })
      }
      componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", backAction); 
       }
       _onContentSizeChange() {
        this.scrollView.scrollTo({ y: 0, animated: false });
      };
      _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
       
      }
      
      getDesignByIDApi = async(value)=>{
          this.setState({loading : true})
          var result  = await POSTApiAuth({
            action:"getDesignByID",
            params: {
              id:value,
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
                  backgroundColor : Colors.themeDark
                });
              }, 100);
            }else {
              this.setState({loading : false})
              if(result.data.DATA.length > 0) {
                console.log("Get Success");
                var a = result.data.DATA[0].product
                myStringArray = result.data.DATA[0].product
                productTitle = result.data.DATA[0].title
                
                
                var b  = a.split(',').map(function(item) {
                    return parseInt(item, 10).toString();
                });
                this.ProductArray=b
                
                        //   this.Details=[];
                
                for (let i = 0; i <result.data.DATA[0].data.length ; i++) {
                  result.data.DATA[0].data[i].top=Number(result.data.DATA[0].data[i].top)
                  result.data.DATA[0].data[i].left=Number(result.data.DATA[0].data[i].left)
                  result.data.DATA[0].data[i].zindex=Number.isNaN(Number(result.data.DATA[0].data[i].zindex))?0:Number(getDesignByIDData[0].data[i].zindex);
                    this.Details.push(result.data.DATA[0].data[i]);
                }
                
                    // this.Details = result.data.DATA[0].data;
                    this.state.lastImageDetails = result.data.DATA[0].data;         
                    console.log("product array ==", this.ProductArray);
                    console.log("Detail array ====", this.Details);
                    this.setState({ drawBackgroundImage : false });
              }
              setTimeout(function(){
                Snackbar.show({
                  text:"Please check your mail",
                  duration: Snackbar.LENGTH_SHORT,
                  textColor :Colors.headerBg,
                  backgroundColor : Colors.themeDark
                });
              }, 100);
            }
      }
      }
      showMessage =(text,txtcolor,backColor)=>{
        Snackbar.show({
          text: text,
          duration: Snackbar.LENGTH_SHORT,
          textColor : txtcolor,
          backgroundColor : backColor
        });
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
        let filename = getNewOrderID()+'.jpg';
        var body = new FormData();
        body.append('imageData', {
            uri:res.assets[0]?.uri, // your file path string
            name: filename,
            type: 'image/jpg'
        })
        body.append(
          "action","getImageUrl")
        this.getImageUrlApi(body)
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
        let filename = getNewOrderID()+'.jpg';
        var body = new FormData();
        body.append('imageData', {
            uri: res.assets[0]?.uri, // your file path string
            name: filename,
            type: 'image/jpg'
        })
        body.append(
        "action","getImageUrl")
        this.getImageUrlApi(body)
      }
    });
}
getImageUrlApi = async(body)=>{
  this.setState({loading : true})
  var result  = await POSTFormApiAuth(body);
  console.log("result :"+JSON.stringify(result))
  if(result){
    if(result.error){
      this.setState({loading : false,
        imageURL : 'https://moonvalleynurseries.com/pub/media/catalog/category/desert_willow_bloom_edited_2019_571x571.jpg'})
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
       imageURL : result.data.DATA.imageUrl})
    }
}
}


  onPanStateChange = event => {

      if (event.nativeEvent.oldState === State.ACTIVE) {
          this.lastOffset.x += event.nativeEvent.translationX;
          this.lastOffset.y += event.nativeEvent.translationY;
          this.translateX.setOffset(this.lastOffset.x);
          this.translateX.setValue(0);
          this.translateY.setOffset(this.lastOffset.y);
          this.translateY.setValue(0);
      }
  };

  onRotateHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
          this.lastRotate += event.nativeEvent.rotation;
          this.rotate.setOffset(this.lastRotate);
          this.rotate.setValue(0);
      }
  };

  onPinchHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
          this.lastScale *= event.nativeEvent.scale;
          this.baseScale.setValue(this.lastScale);
           this.pinchScale.setValue(1);
      }
  };

  onTapHandlerStateChange = event =>{
      if (event.nativeEvent.oldState === State.ACTIVE) {
          this._updateEditImage()
      }
  }


  _renderButton = (text,icon, onPress) => (
          <TouchableOpacity style={styles.shadowButtonstyle}
              onPress={onPress}
              >
               <Icon name={icon} size={25} color="white" style={{padding:2}}  />
          </TouchableOpacity>

  );

  _renderButtonLeft = (text,icon, onPress) => (
      <TouchableOpacity style={styles.shadowButtonstyleLeft}
                        onPress={onPress}
      >
          <Icon name={icon} size={25} color="white"  />
      </TouchableOpacity>

  );
  _renderButtonRight = (text,icon, onPress) => (
      <TouchableOpacity style={styles.shadowButtonstyleRight}
                        onPress={onPress}
      >
          <Icon name={icon} size={25} color="white"  />
      </TouchableOpacity>

  );


  callUpdateArray()
  {
      myStringArray=''

      for (let i = 0; i < this.ProductArray.length; i++) {
          if(myStringArray==='')
          {
              myStringArray=this.ProductArray[i];

          } else
          {
              myStringArray=myStringArray+','+this.ProductArray[i];
          }

      }
      console.log("HSSSSSSSSSSSProductArray",myStringArray,this.props.token)

      if(myStringArray!=='')
      {
      this.getProductArrayApi(myStringArray)
      }
      else
      {
          Alert.alert(ErrorHandling.alertTitle, ErrorHandling.selectProduct);
      }
  }

  getProductArrayApi = async(myStringArray)=>{
    this.setState({loading : true})
    var result  = await POSTApiAuth({
      action:"productArray",
      params:{
          productArray:myStringArray,
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
            backgroundColor : Colors.themeDark
          });
        }, 100);
      }else {
        this.setState({loading : false,
        onBottomTap:true})
        setTimeout(function(){
          Snackbar.show({
            text:"Please check your mail",
            duration: Snackbar.LENGTH_SHORT,
            textColor :Colors.headerBg,
            backgroundColor : Colors.themeDark
          });
        }, 100);
        this.setState(
          {designForm:true}
          ,this._previewShap //callback
      );
      }
}
}
submitDesignProductArrayApi = async(myStringArray)=>{
  this.setState({loading : true})
  var result  = await POSTApiAuth({
    action:"productArray",
    params:{
        productArray:myStringArray,
      token: this.state.token
    } 
  });
  console.log("result :"+JSON.stringify(result))
  if(result){
    if(result.error){
      this.setState({loading : false})
      Alert.alert(ErrorHandling.alertTitle,ErrorHandling.errorInProductList);
        this.setState({ isSaveDesign:false });
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
        isDesignForm:true})
      setTimeout(function(){
        Snackbar.show({
          text:"Please check your mail",
          duration: Snackbar.LENGTH_SHORT,
          textColor :Colors.headerBg,
          backgroundColor : Colors.themeDark
        });
      }, 100);
    }
}
}
  submitDesignData() {
      myStringArray=''
      for (let i = 0; i < this.ProductArray.length; i++) {
          if(myStringArray==='')
          {
              myStringArray=this.ProductArray[i];
          }else
          {
              myStringArray=myStringArray+','+this.ProductArray[i];
          }
      }
      if(myStringArray!=='')
      {
        this.submitDesignProductArrayApi(myStringArray)
          this.setState(
              {designForm:true}
              ,this._previewShap //callback
          );

      } else {
          Alert.alert(ErrorHandling.alertTitle, ErrorHandling.selectProduct);

      }
  }
  _previewShap =() => {
    console.log("Mehshshshhs","Capture")
    captureScreen({
        format: "jpg",
        quality: 0.8
    })
        .then(
            res => {

                console.log("SnapImageSource",res)

                var filename = res.replace(/^.*[\\\/]/, '')

                var body = new FormData();
                body.append('imageData', {
                    uri: res, // your file path string
                    name: filename,
                    type: 'image/jpg'
                })
               this.getSnapImageUrl(body)
                this.setState({viewDesignImage:{uri:res},showActionIcons:true});
            },
            error => console.error("Oops, snapshot failed", error)
        )
}
getSnapImageUrl = async(newBody)=>{
  this.setState({loading : true})
  var result  = await POSTApiAuth({
          action:"getSnapImageUrl",
          body:newBody,
                                params:{
                                    body :{}
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
      onBottomTap:true})
      setTimeout(function(){
        Snackbar.show({
          text:"Please check your mail",
          duration: Snackbar.LENGTH_SHORT,
          textColor :Colors.headerBg,
          backgroundColor : Colors.themeDark
        });
      }, 100);
      this.setState(
        {designForm:true}
        ,this._previewShap //callback
    );
    }
}
}

  handleDashboardView() {
    const translateX = this.translateX;
  const translateY = this.translateY;
  // console.log("HandleDashboardTranslateX",translateX)
  // console.log("HandleDashboardTranslateY",translateY)
  // console.log("HandleDashboardScale",this.scale)
  // console.log("HandleDashboardRotate",this.rotate)
  // console.log("HandleDashboardRotateStr",this.rotateStr)
  const panStyle = {
      transform: [{ translateX }, { translateY }],
  };
  let imageUrl = ""
  if(this.state.getDesignByIDData && this.state.getDesignByIDData.length>0 && this.state.imageURL == "")
  {
      imageUrl=this.state.getDesignByIDData[0].background_image;
  } else {
    imageUrl=this.state.imageURL;
  }


console.log("imageUrl : "+imageUrl)
console.log("this.state.designForm : "+this.state.designForm)
console.log("this.state.onEraseTap : "+this.state.onEraseTap)
console.log("this.state.showSnapView : "+this.state.showSnapView)
console.log("this.state.showCropView : "+this.state.showCropView)
console.log("this.state.showDesignImageMenu : "+this.state.showDesignImageMenu)
console.log("this.state.inImageEditMode : "+this.state.inImageEditMode)
  return (
    <View style={styles.container}>
          

        {(imageUrl=='' || imageUrl == undefined) && (<View style={styles.blurContainer}>
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

        </View>)}
        {imageUrl !='' && (
          <View style={{backgroundColor : "black"}}>
        {!this.state.drawBackgroundImage &&  Platform.OS == "ios" &&(
            <Animated.View style={{position:'absolute'}} >
                {this._renderPhotoTypes()}
            </Animated.View>
        ) }

        <MyView hide={!this.state.showDesignImageMenu} style={{right:15,bottom:15,position:"absolute"}} key="designImageMenu">
            {/*this._renderButton('','crop', () => {this._imagePress("press",this.state.selectedImage,"crop");this.setState({ showDesignImageMenu: false })})*/}
            {this._renderButton('','clone', () => {this._imagePress("press",this.state.selectedImage,"clone");this.setState({ showDesignImageMenu: false })})}
            {this._renderButton('','eraser', () => {this._imagePress("press",this.state.selectedImage,"eraser");this.setState({ showDesignImageMenu: false })})}
            {this._renderButton('','trash', () => {this._imagePress("press",this.state.selectedImage,"delete");this.setState({ showDesignImageMenu: false })})}
            {this._renderButton('','times', () => this.setState({ showDesignImageMenu: false }))}

        </MyView>
        <MyView style={{ flex:1}} hide={!this.state.showDesignView} key="designView" 
            >
            <PanGestureHandler
                /*{...this.props}*/
                onGestureEvent={this.onPanGestureEvent}
                onHandlerStateChange={this.onPanStateChange}
                id="image_drag"
                simultaneousHandlers={['handler-tap','image_rotation','image_pinch']}
                shouldCancelWhenOutside={true}
                maxPointers={1}
            >
                        <Animated.View
                            style={[panStyle,styles.stickerContainer,{
                            }]}
                            collapsable={false}
                        >
                        <RotationGestureHandler
                            id="image_rotation"
                            simultaneousHandlers={['image_pinch', 'image_drag','handler-tap']}
                            onGestureEvent={this.onRotateGestureEvent}
                            onHandlerStateChange={this.onRotateHandlerStateChange}
                        >
                        <PinchGestureHandler
                            id="image_pinch"
                            simultaneousHandlers={['image_rotation', 'image_drag','handler-tap']}
                            onGestureEvent={this.onPinchGestureEvent}
                            onHandlerStateChange={this.onPinchHandlerStateChange}
                        >
                        <TapGestureHandler
                            id={"handler-tap"}
                            simultaneousHandlers={['image_rotation', 'image_drag','image_pinch']}
                            numberOfTaps={1}
                            onHandlerStateChange={this.onTapHandlerStateChange}
                        >
                            <Animated.Image
                                style={ styles.pinchableImage}
                                source={{
                                    uri:this.state.selectedMenuImage,
                                }}
                                onStartShouldSetResponder={() => true}
                                // onResponderGrant={() => {console.log("onResponderGrant:"+this.scale)}}

                            />
                            </TapGestureHandler>
                            </PinchGestureHandler>

                            </RotationGestureHandler>
                        </Animated.View>
            </PanGestureHandler>

        </MyView>




        {imageUrl!='' && !this.state.designForm
        && !this.state.onEraseTap  && !this.state.drawBackgroundImage
        && !this.state.saveDesignForm &&
        !this.state.showSnapView && !this.state.showCropView &&
        !this.state.showDesignImageMenu && !this.state.inImageEditMode &&
        <TouchableOpacity
            style={{height: 50,
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
              },position: "absolute", top: 0, right: 0}
            }
            onPress={() => this.submitDesignData()}
        >
            <Check iconColor={"white"} onPress={() => this.submitDesignData()}/>
        </TouchableOpacity>}

        {imageUrl!='' && !this.state.designForm &&
        !this.state.onEraseTap && !this.state.drawBackgroundImage &&
        !this.state.saveDesignForm
        &&!this.state.showSnapView &&
        !this.state.showCropView &&
        !this.state.showDesignImageMenu &&
        !this.state.inImageEditMode &&
        <TouchableOpacity
            style={{position: "absolute", top: 70, right: 0,height: 50,
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
            }}
            }
            onPress={
                this._saveSnap                }
        >
            <Save iconColor={"white"}  onPress={ this._saveSnap}/>
        </TouchableOpacity>}

        {imageUrl!='' &&!this.state.showSnapView
        && !this.state.onEraseTap  && !this.state.drawBackgroundImage
        && !this.state.designForm && !this.state.saveDesignForm
        && !this.state.showCropView
        && !this.state.showDesignImageMenu && !this.state.inImageEditMode &&
        <TouchableOpacity onPress={() => {this.setState({showImagePicker :true})}} style={[
                styles.redBtnBg,
                {position: "absolute", top: 140, right: 0}
                ]}>
                    <Icon name='image' size={25} color="white"  />
                </TouchableOpacity>
        }

      
        {!this.state.showSnapView && imageUrl!=''  &&  !this.state.designForm &&
        !this.state.onEraseTap && !this.state.drawBackgroundImage &&
        !this.state.saveDesignForm &&
        !this.state.showCropView &&
        !this.state.showDesignImageMenu  &&
        <TouchableOpacity
            style={{height: 50,
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
              },
                position: "absolute", bottom: 0, right: 0 }
            }
            onPress={() => {
                if(this.state.showDesignView) {
                    this._updateEditImage()
                }
                this.setState({
                  bottomShow :!this.state.bottomShow
                })
            }}
        >
            <Plus
                iconColor={"white"}
                onPress={() => {
                    if(this.state.showDesignView) {
                        this._updateEditImage()
                    }                        
                    this.setState({
                      bottomShow :!this.state.bottomShow
                    })
                }}
            />
        </TouchableOpacity>}


        {!this.state.showSnapView
        && !this.state.showCropView &&  !this.state.designForm && !this.state.saveDesignForm &&
        !this.state.showDesignImageMenu && imageUrl!='' &&
        !this.state.onEraseTap && !this.state.drawBackgroundImage &&
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
              },position: "absolute", bottom: 0, left: 0 }
            }
            onPress={() =>
            this.callUpdateArray()}
        >
            <MaterialCommunityIcons
                style={{ alignSelf: "center"}}
                name="clipboard-text"
                size={moderateScale(20)}
                color={"white"}
                onPress={() => this.callUpdateArray()}
            />
        </TouchableOpacity>}



        {this.state.isDesignForm  &&
        (<DesignFormView
            imageUrl= {imageUrl}
            fileName={productTitle}
            snapImage={this.props.imageSnapURL}
            productArray = {this.props.designFormProductArrayData}
            style={{ position :"absolute", alignItems: "center" }}
            onPressCancel= {() =>  this.closeDesignForm() }
            onPressSubmitDesign={(bestTime,fileName,imageurl)=> {
                this.submitDesignDataApi(bestTime,fileName,imageurl,"submitted")
                productTitle=''
            }}
        /> )
        }


              {this.state.isSaveDesign  &&
              (<SaveDesignDraft
                  imageUrl= {imageUrl}
                  fileName={productTitle}
                  snapImage={this.props.imageSnapURL}
                  productArray = {this.props.designFormProductArrayData}
                  style={{ position :"absolute", alignItems: "center" }}
                  onPressCancel= {() =>  this.closeSaveDesignForm() }
                  onPressSubmitDesign={(bestTime,fileName,imageurl)=> {
                      this.submitSaveDesignDataApi(bestTime,fileName,imageurl,"draft")
                      productTitle=''
                    }}
              /> )
              }


        <Modal
            animationType="slide"
            transparent
            visible={this.state.onBottomTap}
        >
            <View style={{flex:1,backgroundColor:'#FFFFFF'}}>



            {this._renderButtonLeft('','chevron-left', () => this.productClose())}


                <View style={{marginTop:responsiveHeight(4),marginLeft:responsiveWidth(5),marginRight:responsiveWidth(5),flexDirection: 'row',alignItems:'center',
                    backgroundColor:'#ff1e0f',justifyContent: 'space-between',
                    height: responsiveHeight(10)}}>

                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:responsiveFontSize(2),color:'white',textAlign: 'center'}}>Name</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:responsiveFontSize(2),color:'white',textAlign: 'center'}}>Scientific</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:responsiveFontSize(2),color:'white',textAlign: 'center'}}>Quantity</Text>
                    </View>

                </View>




                <FlatList style={{marginLeft:responsiveWidth(5),
                    marginRight:responsiveWidth(5),marginTop: responsiveHeight(5)}}
                          data={this.props.productArrayData}
                          keyExtractor={(item, index) => item.product_id }

                          renderItem={({item}) => this.showImageRow(item) }

                />
            </View>
        </Modal>


        {this.state.onEraseTap &&

        (
             <View style={{ flex: 1}}>
                <TouchableOpacity
                    style={{ height: "100%", width: "100%"}}
                    onPress={() => this.refs.sketchRef.saveSketch() }
                >
                </TouchableOpacity>

                <Animated.View style={{
                    position: "absolute",
                    marginTop:125,//detailt image Padding
                    marginLeft:125,//detailt image Padding
                    width: this.state.selectedImageItem.width,
                    height: this.state.selectedImageItem.height,
                    top:this.state.selectedImageItem.top ,
                    left:this.state.selectedImageItem.left,
                    zIndex:this.state.selectedImageItem.zindex,
                }
                }
                >
                    <Animated.View style={{
                        height:150,
                        width:150,
                        borderWidth: 2,
                        borderColor: '#000',
                        resizeMode: "contain",
                        transform: [
                          {perspective: 200},
                          {scale:this.state.selectedImageItem.scale},
                            {rotate:this.state.selectedImageItem.rotate},
                        ]
                    }
                    }
                    >

                        <SketchView
                            style={{ height:"100%", width:"100%",backgroundColor: "transparent"}}
                            ref="sketchRef"
                            toolColor={'#FFFA38'}
                            onSaveSketch={this.onSketchSave.bind(this)}
                            selectedTool={this.state.toolSelected}
                            imageUrl={this.state.selectedImageItem.image}
                            eraseView={true}
                        />
                    </Animated.View>
                </Animated.View>
              </View>

        )
        }
</View>
        )}
        </View>
  );


// if (imageUrl !== "") {


}

callUpdateDesignApi = async(myStringArray,fileName,imageUrl,bestTime,designType)=>{
  this.setState({loading : true})
  var result  = await POSTApiAuth({
    action:"updateDesign",
                params:{
                    id:this.state.getDesignByIDData[0].id,
                    data:this.Details,
                    productsarray: myStringArray,
                    title: fileName,
                    background_images: imageUrl,
                    snaps: this.state.imageSnapURL,
                    preview_snaps: "http://cssent.com/t/rn1/r1.jpg",
                    share_url: "https://www.facebook.com/moonvalleynursery/",
                    comments: "Need to add more plant",
                    search_key: "backyard,small plant,green",
                    created_date: getCurrentDate(),
                    user_name:this.state.Name,
                    user_email :this.state.Email,
                    user_phone:this.state.Phone,
                    best_time_to_call:bestTime,
                    designType:designType,
                    app_type: "mobile",
      token: this.state.token
    } 
  });
  console.log("result :"+JSON.stringify(result))
  if(result){
    if(result.error){
      this.setState({loading : false})
      Alert.alert(ErrorHandling.alertTitle,ErrorHandling.errorInProductList);
        this.setState({ isSaveDesign:false });
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
        isDesignForm:true})
      setTimeout(function(){
        Snackbar.show({
          text:"Please check your mail",
          duration: Snackbar.LENGTH_SHORT,
          textColor :Colors.headerBg,
          backgroundColor : Colors.themeDark
        });
      }, 100);
    }
}
}
callSetDesignApi = async(myStringArray,fileName,imageUrl,bestTime,designType)=>{
  this.setState({loading : true})
  var result  = await POSTApiAuth({
    action:"setDesign",
                params:{
                    user_id:this.state.userId,
                    data:this.Details,
                    productsarray: myStringArray,
                    title: fileName,
                    background_images: imageUrl,
                    snaps: this.state.imageSnapURL,
                    preview_snaps: "http://cssent.com/t/rn1/r1.jpg",
                    share_url: "https://www.facebook.com/moonvalleynursery/",
                    comments: "Need to add more plant",
                    search_key: "backyard,small plant,green",
                    created_date: getCurrentDate(),
                    user_name:this.state.Name,
                    user_email :this.state.Email,
                    user_phone:this.state.Phone,
                    best_time_to_call:bestTime,
                    designType:designType,
                    app_type: "mobile",
      token: this.state.token
    } 
  });
  console.log("result :"+JSON.stringify(result))
  if(result){
    if(result.error){
      this.setState({loading : false})
      Alert.alert(ErrorHandling.alertTitle,ErrorHandling.errorInProductList);
        this.setState({ isSaveDesign:false });
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
        isDesignForm:true})
      setTimeout(function(){
        Snackbar.show({
          text:"Please check your mail",
          duration: Snackbar.LENGTH_SHORT,
          textColor :Colors.headerBg,
          backgroundColor : Colors.themeDark
        });
      }, 100);
    }
}
}

penPressItem()
{
  this.setState({drawBackgroundImage:true})
}

_updateEraseImageData(eraseItem) {

this.updateSnapArray(
    {
        productId:eraseItem.productId,
        type: "Image1",
        image: eraseItem.image,
        viewWidth: eraseItem.viewWidth,//newData.viewWidth,
        viewHeight: eraseItem.viewHeight,//newData.viewHeight,
        width: eraseItem.width,//newData.width,
        height: eraseItem.height,//newData.height,
        scale: eraseItem.scale,
        lastScale:eraseItem.lastScale,
        lastRotate: eraseItem.lastRotate,
        rotate: eraseItem.rotate,
        top: eraseItem.top,//200,//newData.top,
        left: eraseItem.left,//250,//newData.left,
        lastOffsetX: eraseItem.lastOffsetX,
        lastOffsetY: eraseItem.lastOffsetY,
    }
);
}

_updateEditImage(){
    console.log("_updateEditImage",this.state.selectedProductId)

    this.setState({showDesignView:false,
        inImageEditMode:false,showDesignImageMenu:false});
    this.updateSnapArray(
        {
            productId:this.state.selectedProductId,
            type: "Image1",
            image: this.state.selectedMenuImage,
            viewWidth:200,//newData.viewWidth,
            viewHeight:200,//newData.viewHeight,
            width:150,//newData.width,
            height:150,//newData.height,
            scale:this.scale,
            lastScale:this.lastScale,
            lastRotate: this.lastRotate,
            rotate:this.rotateStr,
            top:this.translateY,//200,//newData.top,
            left:this.translateX,//250,//newData.left,
            lastOffsetX: this.lastOffset.x,
            lastOffsetY: this.lastOffset.y,
    });


    this.translateX.setOffset(0);
    this.translateX.setValue(0);
    this.translateY.setOffset(0);
    this.translateY.setValue(0);
    this.lastOffset.x = 0;
    this.lastOffset.y = 0;
    this.baseScale.setValue(1);
    this.pinchScale.setValue(1)
    this.rotate.setOffset(0)
    this.rotate.setValue(0);
}

submitDesignDataApi(bestTime,fileName,imageUrl,designType)
{
    uploadDesignType = "Submitted"
    if(this.state.getDesignByIDData && this.state.getDesignByIDData.length>0)
    {
      this.callUpdateDesignApi(myStringArray,fileName,imageUrl,bestTime,designType)
    }
    else {
      this.ca(myStringArray,fileName,imageUrl,bestTime,"submitted")
     }
     this.removeAllItem();
     this.props.clearProductArray();
     this.setState({isSaveDesign: false, isDesignForm:false})
}

submitSaveDesignDataApi(bestTime,fileName,imageUrl,designType)
{
    uploadDesignType = "Draft";
    if(this.state.getDesignByIDData && this.state.getDesignByIDData.length>0)
    {
      this.callUpdateDesignApi(myStringArray,fileName,imageUrl,bestTime,designType)
    }
    else {
      this.ca(myStringArray,fileName,imageUrl,bestTime,"submitted")
     }
     this.removeAllItem();
     this.props.clearProductArray();
     this.setState({isSaveDesign: false, isDesignForm:false})
}

closeDesignForm()
{
  this.props.clearProductArray();
  this.setState ({ isDesignForm: false,saveDesignForm:false,designForm:false})
}
closeSaveDesignForm()
{
  this.props.clearProductArray();
  this.setState ({ isSaveDesign: false,saveDesignForm:false,designForm:false})
}

productClose()
{
  this.props.clearProductArray();

  this.setState({ onBottomTap:false })
}
eraseClose()
{

    // this.props.clearProductArray();

    this.setState({ onEraseTap:false })
}
penClose()
{

    // this.props.clearProductArray();

    this.setState({ drawBackgroundImage:false })
}

updateEraseImage(file)
{
    console.log("hshshhshshshDatattatFile",file)
    let filename = file.replace(/^.*[\\\/]/, '')
    if( !filename.includes('jpg')  )
    {
        filename=filename+'.jpg';
    }

    var body = new FormData();
    body.append('imageData', {
        uri: "file:///"+file, // your file path string
        name: filename,
        type: 'image/jpg'
    })


    if(this.state.drawBackgroundImage)
    {
      this.getImageUrlApi(body)
    
    }else {
      this.getImageUrlApi(body)
    }

    this.setState({ drawBackgroundImage:false })
}

updatePenImage(file)
{
    console.log("hshshhshshshDatattatFile",file)
    let filename = file.replace(/^.*[\\\/]/, '')
    if( !filename.includes('jpg')  )
    {
        filename=filename+'.jpg';
    }

    var body = new FormData();
    body.append('imageData', {
        uri: "file:///"+file, // your file path string
        name: filename,
        type: 'image/jpg'
    })
    body.append(
      "action","getImageUrl")
    this.getImageUrlApi(body)
    this.setState({ onEraseTap:false })
}

showImageRow(item)
{
    return(
        <View style={{marginTop:responsiveHeight(1),flexDirection: 'row',alignItems:'center',
            backgroundColor:'#d1d1d1',justifyContent: 'space-between',
            height: responsiveHeight(10)}}>

            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:responsiveFontSize(1.8),color:'#3b3b3b',textAlign: 'center'}}>{item.name}</Text>
            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:responsiveFontSize(1.8),color:'#3b3b3b',textAlign: 'center'}}>{item.botnical_name}
                    </Text>
            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:responsiveFontSize(1.8),color:'#3b3b3b',textAlign: 'center'}}>{item.quantity}</Text>
            </View>

        </View>
    )
}

removeAllItem()
{

  myCount=0;
  AsyncStorage.setItem('MyDesignImageId','')


  this.Details=[];
  this.ProductArray=[];
  this.state.lastImageDetails=[];
  this.forceUpdate();


  this.props.removeFieldData();

  // this.props.updateBackground('');

}

parentMethod(data)
{
    console.log("ChildData",data)

    this.ProductArray.push(data.product_id)
    // this.setState({selectedImage:data.image})

    // this.setState({ selectedMenuImage: data.image,showDesignView:true,visibleModal:null,selectedMenuText:'Image1'});

    this.setState({ selectedProductId:data.product_id,selectedMenuImage: data.image,showDesignView:true,visibleModal:null,inImageEditMode:true});

}




_renderPhotoTypes() {
    console.log("in renderPhotoTypes",this.Details);
   let type = [];


      this.Details.map( ( item,index )=> {
            console.log("item id ====",item.productId);
            var tranX = JSON.parse(JSON.stringify(item.left));
                var tranY = JSON.parse(JSON.stringify(item.top));
           type.push(

       
       <Animated.View key={item.key} style={{
        width: item.width, height: item.height,top:item.top,left:item.left,zIndex:item.zindex,
        position:"absolute", marginTop:125, marginLeft:125,  } }  >
    <TapGestureHandler
                    //id={"handler_tap" + item.key + index}
                    // simultaneousHandlers={['long_press' + item.key + index]}
                    numberOfTaps={1}
                    onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                        if(!this.state.onEraseTap){
                            this._imagePress("press",item.key,"edit");
                        }
                    }
                    }}
                    key={item.key}
                >
                    <LongPressGestureHandler
                        //id={'long_press' + item.key + index}
                        // simultaneousHandlers={["handler_tap" + item.key + index]}
                        onHandlerStateChange={({ nativeEvent }) => {
                         if (nativeEvent.state === State.ACTIVE) {
                            if(this.state.showDesignView) {
                                this._updateEditImage();
                            }
                                 

                            if(!this.state.onEraseTap){
                                this.setState({
                                    showDesignImageMenu:true,
                                    selectedImage:item.key,selectedImageItem:item,
                                    selectedImagePosition:index
                                })
                            }
                           
                             }
                            }}
                        minDurationMs={300}
                        maxDist={5}
                        key={item.key}
                    >
             <Animated.Image


                 source={{uri:item.image}}   style={
                 [
                     this.state.showDesignImageMenu && item.key===this.state.selectedImage ?styles.dvImageItemPress: styles.dvImageItem,
                     {
                         width: item.width,
                         height: item.height,
                         resizeMode: "contain",
                         transform:[
                             {scale:item.scale},
                             {rotate:item.rotate},
                         ]
                     }
                 ]}

             />
         </LongPressGestureHandler>
                </TapGestureHandler>


    </Animated.View>
);
} 
       );

    return type;
};


_removeImagefromList = (item,value) => {
    console.log("LasteImagegkeyjsjjsjsj",value)

    var array = [...this.Details]; // make a separate copy of the array
    //index = a.findIndex(x => x.prop2=="yutu");
    var index = array.findIndex(x => x.key===item.key);
    if (index !== -1) {
        array.splice(index, 1);
        //this.setState({people: array});
        this.Details=array;

        this.forceUpdate();
    }else{
        console.log("key not found")
    }

    if(value===1)
    {
        console.log("product id ===",item.productId);
        var pIndex = -1;
        this.ProductArray = this.ProductArray.filter(function(x) {
            if (x !== item.productId || pIndex == x) {
                console.log("index ===1 = ", pIndex)
                return x;
            } else {
                console.log("index ===", pIndex)
                pIndex = x; 
            }
        });
    }

    console.log("ProductArrayRemove",this.ProductArray)

}


_cloneImage(key){

    var index =this.Details.findIndex(x => x.key===key)
    //DO NOT pass value by Reference and use pure function
    const newData=JSON.parse(JSON.stringify(this.Details[index]));
    //this.state.lastImageKey++;
    let nextKey=this._getMaxKey()+1
    this.setState({lastImageKey:nextKey})
    console.log("MaxKey",this.Details,this._getKeys(),nextKey)
    this.Details.push({
        productId:newData.productId,
        key:nextKey,
        type: newData.type,
        image: newData.image,
        viewWidth:newData.viewWidth,
        viewHeight:newData.viewHeight,
        width:newData.width,
        height:newData.height,
        scale:newData.scale,
        lastScale:newData.lastScale,
        lastRotate: newData.lastRotate,
        rotate:newData.rotate,
        top:newData.top+50,
        left:newData.left+50,
        lastOffsetX: newData.lastOffsetX + 50,
        lastOffsetY: newData.lastOffsetY + 50
    });
    this.ProductArray.push(newData.productId)
    this.forceUpdate();
    console.log("ProductArrayCloneImage",this.ProductArray)
}


_imagePress = (event,key,action) => {
    console.log("_imagePress:",event,key,action)
    var index =this.Details.findIndex(x => x.key===key)
    var item=this.Details[index]

    this.setState({showDesignImageMenu:false })

    if(this.state.showDesignView){
        this._updateEditImage();
        if(this.state.lastImageKey===key){
            return;
        }
        
    }       
     if(event=="press" ){

        switch (action){
            case 'delete':{
                this._removeImagefromList(item,1);
                break;
            }
            case 'edit':{

                myCount=1;
                var tranX = JSON.parse(JSON.stringify(item.left));
                var tranY = JSON.parse(JSON.stringify(item.top));

                //"0.093rad".split("rad")[0]
                //returns 0.093 as float
                var rotateValue=JSON.parse(JSON.stringify(item.rotate));
                rotateValue = parseFloat(rotateValue.split("rad")[0]);
                //var itemScale =JSON.parse(JSON.stringify(item.scale));
                //save old
                this.state.lastImageDetails=this.Details;
                

                //below value remains same when in edit mode
                //this.scale=1;
                //this.scale=item.scale;
                //this.rotateStr=item.rotate;
                // //this.lastOffset = { x: 0, y: 0 };
                // this.translateY= new Animated.Value(item.top);
                // this.translateX= new Animated.Value(item.left);
                try{
                    this.baseScale.setValue(item.scale);
                    this.pinchScale.setValue(1)
                    this.lastScale = item.lastScale;
                    this.rotate.setOffset(rotateValue)
                    this.rotate.setValue(0);
                    this.lastRotate = item.lastRotate
                    //this.scale.setValue(0);
                    this.translateX.setOffset(tranX);
                    this.translateX.setValue(0);
                    this.translateY.setOffset(tranY);
                    this.translateY.setValue(0);
                    this.lastOffset.x = item.lastOffsetX;
                    this.lastOffset.y = item.lastOffsetY;
                    console.log("edit mode:Scale-"+ JSON.stringify(this.pinchScale)+ " Rotate-"+rotateValue+">>"+JSON.stringify(this.rotate));

                 }
                 catch(e) { console.error(e); }
                this._removeImagefromList(item,0);
               
                this.setState({
                    selectedMenuText:item.title,
                    selectedMenuImage: item.image,
                    selectedProductId:item.productId,
                    showDesignView:true,visibleModal:null,
                    inImageEditMode:true,
                });
                break;
            }
            case 'clone':
            this._cloneImage(item.key);
            break
        case 'crop':

            this.setState({ visibleModal: 0,
                selectedMenuImage: item.image,
                selectedProductId: item.productId,
                showCropView:true,
                showDesignView:false,
                showActionIcons:false })
            break;
            case 'eraser':

                this._removeImagefromList(item,0);
                this.setState({ onEraseTap:true })
                break
            default:
        }

    }
}


_saveSnap = () => {
    myStringArray='';

    for (let i = 0; i < this.ProductArray.length; i++) {
        if(myStringArray==='')
        {
            myStringArray=this.ProductArray[i];

        }
        else
        {
            myStringArray=myStringArray+','+this.ProductArray[i];
        }

    }


    if(myStringArray!=='')
    {
      this.getProductArrayApi(myStringArray)
    } else {
        Alert.alert(ErrorHandling.alertTitle, ErrorHandling.selectProduct);
    }
};


_previewShap =() => {
    console.log("Mehshshshhs","Capture")
    captureScreen({
        format: "jpg",
        quality: 0.8
    })
        .then(
            res => {
                
                console.log("SnapImageSource",res)

                var filename = res.replace(/^.*[\\\/]/, '')

                var body = new FormData();
                body.append('imageData', {
                    uri: res, // your file path string
                    name: filename,
                    type: 'image/jpg'
                })
                this.getSnapImageUrlApi(body)
                this.setState({viewDesignImage:{uri:res},showActionIcons:true});
            },
            error => console.error("Oops, snapshot failed", error)
        )
}

getSnapImageUrlApi = async(body)=>{
  this.setState({loading : true})
  var result  = await POSTApiAuth({
    action:"getSnapImageUrl",
    body:body,
    params:{
        body :{}
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
      this.setState({loading : false})
    }
}
}


    render() {

      const {width, top, left, height, rotateAngle} = this.state
      let imageSource='',thumbnailImage='';
      if(this.state.getDesignByIDData.length===0 && this.state.imageURL==='')
      {
          this.ProductArray=[]

          this.Details=[];
          productTitle = ''
      }
      if(this.state.imageURL !='')
      {
           imageSource=this.state.imageURL;
           console.log("imageSource : "+imageSource)
      }
      else if(this.state.getDesignByIDData && this.state.getDesignByIDData.length>0)
      {
          imageSource=this.state.getDesignByIDData[0].background_image;
      }
       console.log("imageSource : "+imageSource)
        return (
          <View style={{flex:1}}>
          <SafeAreaView style={{ flex: 1 }}>
        <ProgressiveImage
                forwardedRef={(ref) => this.progressiveValue = ref}
                     thumbnailSource={(imageSource == "" ||imageSource == undefined  )
                         ? images.registerBG
                        : { uri: imageSource }}

                    source={(imageSource == "" ||imageSource == undefined  )
                    ? images.registerBG
                   : { uri: imageSource }}
                    style={{ flex:1 }}
                    onLoadStart = {() => {
                        if(imageSource != ""){
                            this.setState({ imageLoader : true})
                        }
                    }}
                    onLoadEnd = {(e) => {
                        this.setState({ imageLoader : false})
                    }} 
                >
 {!this.state.drawBackgroundImage &&  Platform.OS == "android" &&(
                    <Animated.View style={{position:'absolute'}} >

                        {this._renderPhotoTypes()}

                    </Animated.View>
                ) }


                    <Loader visible={this.props.loading || this.state.imageLoader}/>

                    {this.state.drawBackgroundImage && (

                        <View>
                            <View style={{left:5,top:5,position:"absolute",zIndex:10}}>
                                {this._renderButton('','times',  () => this.penClose())}
                            </View>

                            <View style={{right:5,top:5,position:"absolute",zIndex:10}}>
                                {this._renderButton('','check', () =>
                                    this.refs.sketchRef.saveSketch()
                                )}
                            </View>

                            <View
                                style={{ backgroundColor:'transparent', }}
                                collapsable={false}
                            >

                                <SketchView
                                    style={{
                                        height:'100%',
                                        width:'100%',
                                        alignItems: "center",
                                        justifyContent: "center", backgroundColor: 'transparent'}}
                                    ref="sketchRef"
                                    toolColor={'#FFFA38'}
                                    onSaveSketch={this.onSketchSave.bind(this)}
                                    selectedTool={sketchViewConstants.toolType.pen.id}
                                    imageUrl={imageSource}
                                    eraseView={false}
                                />
                            </View>
                        </View>
                  ) }
                    {this.handleDashboardView()}


                    {!this.state.showSnapView &&  !this.state.onEraseTap &&
                    !this.state.drawBackgroundImage &&
                    !this.state.designForm && !this.state.saveDesignForm &&
                    !this.state.showCropView && !this.state.showDesignImageMenu &&
                    !this.state.inImageEditMode &&
                    <TouchableOpacity
                        style={{position: "absolute",height: 50,
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
                          Actions.drawerOpen()
                       }}
                    >
                        <Menu1 iconColor={"white"} onPress={() => {
                           Actions.drawerOpen()
                        }}/>
                    </TouchableOpacity>
                    }


                    <Modal
                        animationType="slide"
                        transparent
                        visible={this.state.bottomShow}
                        onRequestClose={() => {
                          this.setState({
                            bottomShow :!this.state.bottomShow
                          })
                        }}
                        supportedOrientations={["portrait", "landscape"]}
                    >
                        <View style={styles.bottomDrawerContainer}>
                            <DashBottomDrawer
                                savedToken={this.props.token}
                                userId={userId}
                                parentReference = {this.parentMethod.bind(this)}
                            />
                        </View>
                    </Modal>

                    {this.state.isLoading && (
                        <View style={styles.fullScreenLoader}>
                            <ActivityIndicator
                                size="large"
                                color={Colors.ActivityIndicatorColor}
                            />
                        </View>
                    )}
                    
                </ProgressiveImage>
            
          </SafeAreaView>
        
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
          </View>
    
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
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

  dvImageItem:{
    transform: [
      {perspective: 200},
    ]
  },
  snapImageStyle:{
    margin:responsiveHeight(2),
    borderColor:'red',borderWidth:1,width:"90%",height:"90%"
  },
  buttonClose:{
    position:'absolute',
    top:0,
    right:0,
    //backgroundColor:'black',
    zIndex:100,
    width:35,
    height:35,
    color:'gray',
  },
  buttonSave:{
    position:'absolute',
    top:0,
    right:50,
    //backgroundColor:'black',
    zIndex:100,
    width:35,
    height:35,
    color:'gray',
  },

  stickerContainer: {
    height:200,
    width:200,
    backgroundColor:'transparent',
    top:100,
    left:100,
    alignItems:"center",
    justifyContent:"center"
  },
  cropStickerContainer: {
    height:200,
    width:200,
    backgroundColor:'rgba(255, 255, 52, 0.25)',
    top:100,
    left:100,

  },
  pinchableImage: {
    height:150,
    width:150,
    borderWidth: 2,
    borderColor: '#000',
    resizeMode: "contain",
    transform: [
      { perspective: 200 },
          // { translateX: this.translateX },
          //  { translateY: this.translateY },
  ],
  },

  blurContainer: {
    width:"100%",
    height:"100%",
    alignItems: "center",
    justifyContent: "center",
  },

  uploadViewContainer: {
    width: "50%",
    height: HEIGHT() * 0.25,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dotted",
    borderColor: "black",
    borderWidth: 2
  },

  uploadContainerText: {
    position: "absolute",
    bottom: moderateScale(5),
    right: moderateScale(10),
    fontSize: moderateScale(16),
    color: "black"
  },
  
  shadowButtonstyle: {
    height: 50,
    width: 50,
    marginLeft: 10,
    marginBottom: 10,
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
  shadowButtonstyleLeft: {
    position:'absolute',
    zIndex:1,

    height: 50,
    width: 50,
    marginLeft: 10,
    bottom:20,
    // margin: 20,
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
  shadowButtonstyleRight: {
    position:'absolute',
    right:20,
    zIndex:1,

    height: 50,
    width: 50,
    marginLeft: 10,
    bottom:20,
    // margin: 20,
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
  dvImageItemPress : {
    borderColor: "#000066",
    borderWidth: 1,
    borderRadius: 10,
    transform: [
      {perspective: 200},
    ]
  },

  bottomDrawerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  fullScreenLoader: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.7)"
  },

  closeBtn: {
    height: 40,
    width: 40,
    margin: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 6,
    shadowColor: "#000",
    shadowRadius: 20,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 6
    }
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

  FloatingLabelMainInput: {
    color: Colors.themeGray,
  },

  input: {
    borderWidth: 0,
    color: Colors.themeDark,
    fontSize: moderateScale(16),
    height: moderateScale(28),
  },
  topFormInput: {
    marginTop:responsiveHeight(5),

    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    flex: 1,
    borderColor: Colors.themeGray,
    marginVertical: HEIGHT() * 0.0075
  },

  formInput: { 
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    flex: 1,
    borderColor: Colors.themeGray,
    marginVertical: HEIGHT() * 0.0075
  },
  emailFormInput: {
    marginTop:responsiveHeight(5),
   
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    flex: 1,
    borderColor: Colors.themeGray,
    marginVertical: HEIGHT() * 0.0075
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
});