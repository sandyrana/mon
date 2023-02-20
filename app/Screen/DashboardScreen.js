/* eslint-disable no-trailing-spaces */
/* eslint-disable space-infix-ops */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {  SafeAreaView,NetInfo,BackHandler,ActivityIndicator,View,StatusBar, Alert, Text, Image,
  Modal, Animated, Dimensions, TouchableOpacity, FlatList,StyleSheet,Platform} from 'react-native';
import { HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import ViewShot,{ captureScreen  } from "react-native-view-shot";
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
import DashBottomDrawer from "../Components/DashBottomDrawer";
import DesignFormView from "../Components/DesignFormView";
import ErrorHandling from "../Utils/ErrorHandling";
let nextScreenToAppear='';
let myStringArray='';
const w = Dimensions.get('window');
import { PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State,TapGestureHandler,LongPressGestureHandler,NativeViewGestureHandler } from 'react-native-gesture-handler';
import SaveDesignDraft from "../Components/SaveDesignDraft";
const USE_NATIVE_DRIVER = false; // https://github.com/kmagiera/react-native-gesture-handler/issues/71
const MINIMUM_STICKER_SCALE = 0.5;
const MAXIMUM_STICKER_SCALE = 3.5;
let myCount=0;
let eraseImageCount = 0;
let uploadDesignType = "Draft";
import SketchView from '../_constants/SketchView.js';
import Spinner from 'react-native-loading-spinner-overlay/lib/index.js';
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
  function getCurrentDate() {

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var day = new Date().getDay(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds

    if(hours<10)
    {
        hours="0"+hours;
    }
    if(min<10)
    {
        min="0"+min;
    }
    if(sec<10)
    {
        sec="0"+sec;
    }
    if(date<10)
    {
        date="0"+date;
    }
    if(month<10)
    {
        month="0"+month;
    }

    let currentDate=year+'-'+month+'-'+date+' '+hours+':'+min+':'+sec;
    return currentDate;
}
export default class DashboardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          token :'',
          loading :false,
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
          productTitle:'faadfafd',
          imageURL : '',
          isLoading: false,
          showDesignDraft :false,
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
          draftDataArray: [],
          myDesignImageId  : this.props.MyDesignImageId,
          Email: "",
          userId : "",
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
    ProductArray=[]
    Details = []
    componentDidMount = async() =>{
      Actions.drawerClose()
        BackHandler.addEventListener("hardwareBackPress", backAction);
        await   AsyncStorage.getItem("token").then((value) => {
          console.log('token :'+value)
          if(value!=null){
            this.setState({token : value});
          }
        
      });
      await   AsyncStorage.getItem("id").then((value) => {
        console.log('id :'+value)
        if(value!=null){
          this.setState({userId : value});
        }
      
    });
      await   AsyncStorage.getItem("email").then((value) => {
        console.log('email :'+value)
        if(value!=null){
          this.setState({Email : value});
        }
      
    });
    await   AsyncStorage.getItem("fullName").then((value) => {
      console.log('fullName :'+value)
      if(value!=null){
        this.setState({Name : value});
      }
    
  });
  await   AsyncStorage.getItem("telephone").then((value) => {
    console.log('telephone :'+value)
    if(value!=null){
      this.setState({Phone : value});
    }
  
});
      await   AsyncStorage.getItem("MyDesignImageId").then((value) => {
        console.log('MyDesignImageId :'+value)
        if(value!=null){
          this.getDesignById(value)
        }
    });
      }
      componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", backAction); 
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
getDesignById = async(idd)=>{
  this.setState({loading : true})
  var result  = await POSTFormApiAuth({
    action:"getDesignByID",
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
       getDesignByIDData : result.data.DATA,
        })
       if(result.data.DATA.length != 0){
        this.setState({loading : false,
          imageURL :result.data.DATA[0].background_image })
       }
    }
}
}
_renderButton = (text,icon, onPress) => (
  <TouchableOpacity style={styles.shadowButtonstyle}
      onPress={onPress}
      >
       <Icon name={icon} size={25} color="white" style={{padding:2}}  />
  </TouchableOpacity>

);
parentMethod(data)
{
    console.log("ChildData",data)

    this.setState({selectedImage:data.image,selectedMenuText:'Image1'})
   this.setState({ selectedProductId:data.product_id,selectedMenuImage: data.image,showDesignView:true,showDesignImageMenu:true,visibleModal:null,inImageEditMode:true});
    this.updateSnapArray(
      {
          productId:data.product_id,
          type: "Image1",
          image: data.image,
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
  this.ProductArray.push(data.product_id)
  this._saveSnap()
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
handleBottomView = ()=>{
  this.setState({
    bottomShow :!this.state.bottomShow
  })
}
_imagePress = (event,key,action) => {
  console.log("_imagePress:",event,key,action)
  console.log("this.Details:"+JSON.stringify(this.Details))
  var index =this.Details.findIndex(x => x.key===key)
  console.log("index : "+index)
  var item=this.Details[index]
  this.setState({showDesignImageMenu:false })
   if(event=="press" ){
      switch (action){
          case 'delete':{
            this.setState({
              selectedMenuImage : "",
              showDesignView:false,
                        inImageEditMode:false,showDesignImageMenu:false
            })
              this._removeImagefromList(item,index);
              break;
          }
          case 'clone':
          this._cloneImage(key);
          break
          case 'save':
            this.setState({
              inImageEditMode:false,showDesignImageMenu:false});
            break
          default:
      }

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
      top:newData.top+100,
      left:newData.left+100,
      lastOffsetX: newData.lastOffsetX+100,
      lastOffsetY: newData.lastOffsetY+100,
  });
  console.log("ProductArrayUpdateSnap",this.ProductArray)
   this.ProductArray.push(newData.productId)
  console.log("ProductArrayUpdateSnap",this.ProductArray)

}
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
_removeImagefromList = (item,index) => {
 var array = [...this.Details]; // make a separate copy of the array
  if (index !== -1) {
      array.splice(index, 1);
      //this.setState({people: array});
      this.Details=array;
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
      console.log("ProductArrayRemove",this.ProductArray)
      this.forceUpdate();
     
  }else{
      console.log("key not found")
  }
 

}

_cloneImage(key){
debugger
  var index =this.Details.findIndex(x => x.key===key)
  //DO NOT pass value by Reference and use pure function
  console.log("index",index)
  if(index == -1){
    index = 0
  }
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
  console.log("ProductArrayCloneImage",this.ProductArray)
  this.ProductArray.push(newData.productId)
  console.log("ProductArrayCloneImage",this.ProductArray)
  this.forceUpdate();
  console.log("ProductArrayCloneImage",this.ProductArray)

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
  
  }
}
submitDesignData = async()=> {
  if(this.state.Phone == ''){
    Snackbar.show({
      text:"Please update your mobile number in profile",
      duration: Snackbar.LENGTH_SHORT,
      textColor :Colors.headerBg,
      backgroundColor : Colors.themeDark
    });
  }else if(this.state.Email == ''){
    Snackbar.show({
      text:"Please update your email in profile",
      duration: Snackbar.LENGTH_SHORT,
      textColor :Colors.headerBg,
      backgroundColor : Colors.themeDark
    });
  }else if(this.state.Name == ''){
    Snackbar.show({
      text:"Please update your name in profile",
      duration: Snackbar.LENGTH_SHORT,
      textColor :Colors.headerBg,
      backgroundColor : Colors.themeDark
    });
  }else  if(this.Details.length == 0 || this.ProductArray.length == 0){
    Snackbar.show({
      text:"Please select product",
      duration: Snackbar.LENGTH_SHORT,
      textColor :Colors.headerBg,
      backgroundColor : Colors.themeDark
    });
  }else {
    this.setState({
      productTitle :this.Details[0].title
    })
  myStringArray =''
  for (let i = 0; i < this.ProductArray.length; i++) {
      if(myStringArray =='')
      {
          myStringArray = this.ProductArray[i];
      } else
      {
          myStringArray = myStringArray+','+this.ProductArray[i];
      }

  }
  var dataBody = {};
  if(this.state.getDesignByIDData && this.state.getDesignByIDData.length>0){
    dataBody = {
      action:"updateDesign",
    params:{
        id:this.state.getDesignByIDData[0].id,
        data:this.Details,
        productsarray: myStringArray,
        title: this.state.productTitle,
        background_images: this.state.imageURL,
        snaps: this.state.imageSnapURL,
        preview_snaps: "http://cssent.com/t/rn1/r1.jpg",
        share_url: "https://www.facebook.com/moonvalleynursery/",
        comments: "Need to add more plant",
        search_key: "backyard,small plant,green",
        created_date: getCurrentDate(),
        token: this.state.token,
        user_name:this.state.Name,
        user_email :this.state.Email,
        user_phone:this.state.Phone,
        best_time_to_call:"Morning",
        designType:"Submitted",
        app_type: "mobile"
    }
    }
  }else {
    dataBody = {
      action:"setDesign",
      params:{
          user_id:this.state.userId,
          data:this.Details,
          productsarray: myStringArray,
          title: this.state.productTitle,
          background_images: this.state.imageURL,
          snaps: this.state.imageSnapURL,
          preview_snaps: "http://cssent.com/t/rn1/r1.jpg",
          share_url: "https://www.facebook.com/moonvalleynursery/",
          comments: "Need to add more plant",
          search_key: "backyard,small plant,green",
          created_date: getCurrentDate(),
          token: this.state.token,
          user_name:this.state.Name,
          user_email :this.state.Email,
          user_phone:this.state.Phone,
          best_time_to_call:"Morning",
          designType:"Submitted",
          app_type: "mobile"
      }
    }
  }
  this.setState({loading : true})
  var result  = await POSTApiAuth(dataBody);
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
        imageURL:""})
      setTimeout(function(){
        Snackbar.show({
          text:"Your design are saved now",
          duration: Snackbar.LENGTH_SHORT,
          textColor :Colors.headerBg,
          backgroundColor : Colors.themeDark
        });
      }, 100);
      this.setBackToMain()
    }
}
}
}
setBackToMain = ()=>{
  this.setState({
          loading :false,
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
          productTitle:'faadfafd',
          imageURL : '',
          isLoading: false,
          showDesignDraft :false,
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
          draftDataArray: [],
          myDesignImageId  : this.props.MyDesignImageId,
          onEraseTap:false,
          imageSnapURL : '',
          IsModelVisible:false,
          lastImageKey:2,
          lastImageDetails:[],
          visibleModal: 0,
          isModalVisible: false,
          selectedMenuImage:"",
          selectedMenuText:"",
          debugText:"",
  })
}

_saveSnap = () => {
 var  newAllProductId='';

  for (let i = 0; i < this.ProductArray.length; i++) {
      if(newAllProductId==='')
      {
        newAllProductId=this.ProductArray[i];

      }
      else
      {
        newAllProductId=newAllProductId+','+this.ProductArray[i];
      }

  }


  if(newAllProductId!=='')
  {
    this.getProductArrayApi(newAllProductId)
  } else {
      Alert.alert(ErrorHandling.alertTitle, ErrorHandling.selectProduct);
  }
};
getProductArrayApi = async(newAllProductId)=>{
  this.setState({loading : true})
  var result  = await POSTApiAuth({
    action:"productArray",
    params:{
        productArray:newAllProductId,
      token: this.state.token
    } 
  });
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
      console.log("result :"+JSON.stringify(result.data.DATA))
      this.setState({loading : false,
        draftDataArray : result.data.DATA
      })
      this._previewShap()
    }
}
}
penPressItem()
{
  this.setState({drawBackgroundImage:true})
}
_previewShap =() => {
  console.log("Mehshshshhs","Capture")
  captureScreen({
      format: "jpg",
      quality: 0.8
  })
      .then(
          res => {
          let filename = getNewOrderID()+'.jpg';
          var body = new FormData();
          body.append('imageData', {
              uri:res, // your file path string
              name: filename,
              type: 'image/jpg'
          })
          body.append(
            "action","getImageUrl")
           this.getSnapImageUrl(body)
              this.setState({viewDesignImage:{uri:res},showActionIcons:true});
          },
          error => console.error("Oops, snapshot failed", error)
      )
}
getSnapImageUrl = async(body)=>{
this.setState({loading : true})
var result  = await POSTFormApiAuth(body);
console.log("result :"+JSON.stringify(result))
if(result){
  if(result.error){
    this.setState({loading : false,
      imageSnapURL : 'https://moonvalleynurseries.com/pub/media/catalog/category/desert_willow_bloom_edited_2019_571x571.jpg'})
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
      imageSnapURL : result.data.DATA.imageUrl})
  }
}
}

    render() {
      const translateX = this.translateX;
      const translateY = this.translateY;
      const panStyle = {
        transform: [{ translateX }, { translateY }],
    };
        return (
          <View style={{flex:1}}>
            <Spinner
          visible={this.state.loading}
        />
          <SafeAreaView style={{ flex: 1 }}>
        <ProgressiveImage
                forwardedRef={(ref) => this.progressiveValue = ref}
                     thumbnailSource={(this.state.imageURL == "" ||this.state.imageURL == undefined  )
                         ? images.registerBG
                        : { uri: this.state.imageURL }}

                    source={(this.state.imageURL == "" ||this.state.imageURL == undefined  )
                    ? images.registerBG
                   : { uri: this.state.imageURL }}
                    style={{ flex:1 }}
                    onLoadStart = {() => {
                        if(this.state.imageURL != ""){
                            this.setState({ imageLoader : true})
                        }
                    }}
                    onLoadEnd = {(e) => {
                        this.setState({ imageLoader : false})
                    }} 
                >
                  <Loader visible={this.state.imageLoader}/>
                  <View style={{flexDirection : 'column',height :"100%",width : "100%"}}>
                 { (this.state.imageURL=='' || this.state.imageURL == undefined) && (<View style={styles.blurContainer}>
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
        {this.state.imageURL !='' && (  <View >
        
      {!this.state.showDesignImageMenu && (  <View style={{flexDirection : 'column',position : 'absolute',height : "100%",right :10,top :10,bottom :10}}>
        <TouchableOpacity
            style={{height: 50,
              width: 50,
              marginTop: 15,
              marginRight: 20,
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
            onPress={() => this.submitDesignData()}
        >
            <Check iconColor={"white"} onPress={() => this.submitDesignData()}/>
        </TouchableOpacity>
        {/* <TouchableOpacity
            style={{height: 50,
            width: 50,
            marginTop: 15,
            marginRight: 20,
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
         
        >
            <Save iconColor={"white"} />
        </TouchableOpacity> */}
      
                <TouchableOpacity onPress={() => {this.setState({showImagePicker :true})}}
                 style={{height: 50,
            width: 50,
            marginTop: 15,
            marginRight: 20,
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
            }>
                    <Icon name='edit' size={25} color="white"  />
                </TouchableOpacity>
              
          </View>)}
          {this.state.showDesignImageMenu && (  <View style={{flexDirection : 'column',position : 'absolute',height : "100%",right :10,top :10,bottom :10}}>
          
          {this._renderButton('','clone', () => {this._imagePress("press",this.state.selectedImage,"clone");})}
                {this._renderButton('','check-circle', () => {this._imagePress("press",this.state.selectedImage,"save");})}
                {this._renderButton('','trash', () => {this._imagePress("press",this.state.selectedImage,"delete");})}

            </View>)}
            {this.state.showDesignView && (  
          <View style={{flexDirection : 'column',position : 'absolute',height : "100%",left :200,top :50}}>
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
            </View>)}
        </View>)}
        </View>
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
                                savedToken={this.state.token}
                                userId={this.state.userId}
                                handleBottomView = {this.handleBottomView.bind(this)}
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
                    {(this.state.imageURL !='' && !this.state.showDesignImageMenu )&& (    <TouchableOpacity
            style={{height: 50,position: "absolute",right :20,bottom :20,
              width: 50,
              marginTop: 15,
              marginRight: 20,
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
            onPress={() => {
                if(this.state.showDesignView) {
                  this.setState({showDesignView:false,
                    inImageEditMode:false,showDesignImageMenu:false});
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
                      this.setState({showDesignView:false,
                        inImageEditMode:false,showDesignImageMenu:false});
                    }                        
                    this.setState({
                      bottomShow :!this.state.bottomShow
                    })
                }}
            />
        </TouchableOpacity>)}
       
       {this.state.showDesignImageMenu && (  <View
            style={{height: 50,position: "absolute",left :20,bottom :20,
              width: 50, }}>{this._renderButton('','file-text', () => this.setState({
                  showDesignDraft :true
                })
            )}
          </View>)}
          <Modal
            animationType="slide"
            transparent
            visible={this.state.showDesignDraft}
            onRequestClose={() => {
               this.setState({ showDesignDraft: false})
            }}
            supportedOrientations={["portrait", "landscape"]}
          >
         <View style={styles.optionsContainer}> 
         <View style={styles.optionsContainer3}> 
         <View style={{flexDirection : 'row',backgroundColor : 'red',height : 60,width : "100%"}}> 
         <View style={{height : 60,width : "33%",justifyContent : 'center',alignItems :'center'}}> 
         <Text style = {{fontSize : 18,fontWeight :'bold',color :'white'}}>Name</Text>
       </View>
       <View style={{height : 60,width : "34%",justifyContent : 'center',alignItems :'center'}}> 
         <Text style = {{fontSize : 18,fontWeight :'bold',color :'white'}}>Scientific</Text>
       </View>
       <View style={{height : 60,width : "33%",justifyContent : 'center',alignItems :'center'}}> 
         <Text style = {{fontSize : 18,fontWeight :'bold',color :'white'}}>Qty.</Text>
       </View>
         </View>
         <FlatList
                data={this.state.draftDataArray}
                renderItem={({ item, index }) => (
                  <View style={{flexDirection : 'row',height : 60,width : "100%"}}> 
                  <View style={{height : 60,width : "33%",justifyContent : 'center',alignItems :'center'}}> 
                  <Text style = {{fontSize : 15,color :'black'}}>{item.name}</Text>
                </View>
                <View style={{height : 60,width : "34%",justifyContent : 'center',alignItems :'center'}}> 
                  <Text style = {{fontSize : 15,color :'black'}}>{item.botnical_name}</Text>
                </View>
                <View style={{height : 60,width : "33%",justifyContent : 'center',alignItems :'center'}}> 
                  <Text style = {{fontSize : 15,color :'black'}}>{item.quantity}</Text>
                </View>
                  </View>
                )}
            />
               <View style={{flexDirection : 'row',height : 60,width : "100%",alignItems : 'center',justifyContent : 'center'}}> 
               <TouchableOpacity onPress={() =>      
                    this.setState({
                      showDesignDraft :false
                    })
                }style={{height : 60,width : 100,justifyContent : 'center',alignItems :'center'}}> 
                  <Text style = {{fontSize : 20,color :'red'}}>Close</Text>
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
    justifyContent:"center",
    // transform: [{ translateX }, { translateY }]
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
   optionsContainer3: {
    flexDirection : 'column',
     width: 750,
     height :650,
     backgroundColor: "white"
   },
});