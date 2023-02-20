import React from 'react';
import {View, Text, Alert, TouchableOpacity,  TouchableHighlight,  TouchableWithoutFeedback, ScrollView, ActivityIndicator,  UIManager,
  LayoutAnimation, TextInput,InputAccessoryView, Keyboard,  StyleSheet} from "react-native";
import { WIDTH, HEIGHT, fontStyle,KEYBOARDOFFSET } from "../Utils/theme.js";
import { moderateScale } from "../Utils/fontScaling";
import {responsiveHeight, responsiveWidth,responsiveFontSize} from "../_constants/dimensions";
import AsyncStorage from '@react-native-community/async-storage';
import images from "../Utils/images";
import Colors from '../../assets/Colors.js'
import { Actions } from 'react-native-router-flux';  
import AntDesign from "react-native-vector-icons/AntDesign";
import { FloatingTextInput } from './FloatingTextInput.js';
import InfoCard from "./InfoCard.js";
import Card from "./Card";
import {  Search, Star,Close, Arrow } from "../../assets/icons";
import {sortJsonArray} from "../_constants/sortJsonArray";
import ErrorHandling from "../Utils/ErrorHandling";
import {POSTApiAuth} from '../Utils/ApiCall.js';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
let favItem = {}

export default class DashBottomDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
           loading :false,
          userId :'',
          selected: false, showInfo: false,
          isShowFav:false, item:{},sortByValue:'',
          isSearch:false, isPickerOpen: false, isShowSearch: false,
      searchValue:'',
      searchType: '',
      searchOrder: "",
      sortByLabel: "Sort By",
      arrayCategoryData: [],
      arrayProductData: [],
      arrayFavData: [],
      arraySort: [
        {
            label: "A-Z By Name",
            value: "A-Z",
            type: "name",
            order: "ASC"
        },
        {
            label: "Z-A By  Name",
            value: "Z-A",
            type: "name",
            order: "DESC"
        },
        {
            label: "A-Z By Scientific Name",
            value: "A-ZS",
            type: "botnical_name",
            order: "ASC"
        },
        {
            label: "Z-A By Scientific Name",
            value: "Z-AS",
            type: "botnical_name",
            order: "DESC"
        },
      ]
        };
        UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
     componentDidMount = async()=>{
      await   AsyncStorage.getItem("token").then((value) => {
        console.log('token :'+value)
        if(value!=null){
          this.setState({token : value});
          this.callCategory(value)
        }
    });
    await   AsyncStorage.getItem("id").then((value) => {
      if(value!=null){
        this.setState({userId : value});
      }
  });
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

     handleBack = async() =>{
      if (this.state.showInfo) {
        this.setState({ showInfo: false});
      } else if (this.state.selected) {
        this.setState({ selected: !this.state.selected,searchValue:'', arrayProductData:[]});
      } else {
        this.props.handleBottomView();
       
      }
    }
  
    handleSearch() {
  
      this.setState({
        isSearch:!this.state.isSearch,
        sortByLabel: "Sort By",
        sortByValue: "",
        isPickerOpen: false,
        searchValue: "",
        isShowSearch: false,
        searchType: this.state.arraySort[0].type,
        searchOrder: this.state.arraySort[0].order
      })
    }
  
    openFavouriteItems = async()=> {
      this.setState({loading : true})
      var result  = await POSTApiAuth({
        'action': 'getFavourite',
        params: {
          user_id: this.state.userId,
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
              backgroundColor : Colors.base_color
            });
          }, 100);
        }else {
          this.setState({loading : false})
          if(result.data.DATA.length > 0){
            this.setState({ arrayFavData : result.data.DATA });
          }
          setTimeout(function(){
            Snackbar.show({
              text:result.message,
              duration: Snackbar.LENGTH_SHORT,
              textColor :Colors.headerBg,
              backgroundColor : Colors.base_color
            });
          }, 100);
        
        }
      }
    
    }
  
    handleFavourite() {
      Alert.alert(ErrorHandling.alertTitle, ErrorHandling.addToFavourite);
    }
  
    handleSubFavourite = async(item)=> {
  
      console.log(" item is_favourite == ", item.is_favourite)
  
      if(item.is_favourite ==='1')
      {
        this.setState({loading : true})
        var result  = await POSTApiAuth({
          'action': 'unsetFavourite',
          params: {
            product_id:item.product_id,
            user_id: this.state.userId,
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
                backgroundColor : Colors.base_color
              });
            }, 100);
          }else {
            this.setState({loading : false})
            setTimeout(function(){
              Snackbar.show({
                text:result.message,
                duration: Snackbar.LENGTH_SHORT,
                textColor :Colors.headerBg,
                backgroundColor : Colors.base_color
              });
            }, 100);
          
          }
        }
      }else
      {
        this.setState({loading : true})
          var result  = await POSTApiAuth({
            'action': 'setFavourite',
            params: {
              product_id:item.product_id,
              user_id: this.state.userId,
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
                  backgroundColor : Colors.base_color
                });
              }, 100);
            }else {
              this.setState({loading : false})
              setTimeout(function(){
                Snackbar.show({
                  text:result.message,
                  duration: Snackbar.LENGTH_SHORT,
                  textColor :Colors.headerBg,
                  backgroundColor : Colors.base_color
                });
              }, 100);
            
            }
          }
      }
  
  
      if (this.state.showInfo){
          if(item.is_favourite ==='1'){
              item.is_favourite = "0"
          } else {
              item.is_favourite = '1'
          }
          favItem = item
      }
    }
  
    handleAddPlant(item) {
        this.props.handleBottomView();
        this.props.parentReference(item);
    }
  
    callSubCategory= async(item)=> {
      categoryId=item.cat_id
      this.setState({loading : true})
      var result  = await POSTApiAuth({
        action:"getCategoriesIdByProduct",
        params: {
          category_id:item.cat_id,
           user_id: this.state.userId,
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
              backgroundColor : Colors.base_color
            });
          }, 100);
        }else {
          this.setState({loading : false,
            arrayProductData :result.data.DATA})
        }
      }

    }
  
    handleInfoButton(item) {
      this.setState({ showInfo: true, item: item })
      // if(this.state.isSearch){
      //     this.handleSearch()
      // }
    }
  
    callAgainSubCategory = async()=>
    {
      this.setState({loading : true})
      var result  = await POSTApiAuth({
        action:"getCategoriesIdByProduct",
              params:{
                category_id:categoryId,
          user_id: this.state.userId,
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
              backgroundColor : Colors.base_color
            });
          }, 100);
        }else {
          this.setState({loading : false,
            arrayProductData :result.data.DATA})
        }
      }
    }
    callCategory = async(token)=>
    {
      this.setState({loading : true})
      var result  = await POSTApiAuth({
        action:"getAllCategories",
              params:{
          token: token
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
              backgroundColor : Colors.base_color
            });
          }, 100);
        }else {
          console.log("result :"+JSON.stringify(result))
          this.setState({loading : false,
           arrayCategoryData :result.data.DATA})
         
        
        }
      }
    }
    noProductsRender() {
      return(
        <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
          <Text style={{textAlign: 'center',fontSize:responsiveFontSize(2), }}>No Products</Text>
        </View>
      )
    }
  
  
    handleBottomViewContent() {
  
      var steps = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  
  
      if(this.state.loading ) {
        return(
            <ActivityIndicator size={"large"}/>
        )
      }
  
      else if (this.state.selected && !this.state.showInfo && !this.state.isShowSearch) {
  
        if(this.state.arrayProductData.length>0)
        {
          let newData = [...this.state.arrayProductData];
  
            if(this.state.sortByValue !=='')
            {
              if(this.state.sortByValue==='A-Z')
              {
              newData=sortJsonArray(newData,'name','asc')
              }
              else if(this.state.sortByValue==='Z-A') {
                newData=sortJsonArray(newData,'name','des')
              }
              else if(this.state.sortByValue==='Z-AS') {
                newData=sortJsonArray(newData,'botnical_name','des')
              }
              else if(this.state.sortByValue==='A-ZS') {
                newData=sortJsonArray(newData,'botnical_name','asc')
              } else {
                Alert.alert(ErrorHandling.alertTitle,ErrorHandling.underProcess);
              }
            } else{
              console.log("Sub category ======",this.state.arrayProductData);
            }
  
            return (
                <ScrollView
                    ref={ref => this.scrollViewProduct = ref}
                    horizontal
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.contentContainerStyle}
                >
                    {newData.map((item, index) => {
                        return (
                            <Card
                                key={index}
                                item={item}
                                optionBtn={true}
                                onPressInfo={() => this.handleInfoButton(item)}
                                onAdd={() => this.handleAddPlant(item)}
                                onFavourite={() => this.handleSubFavourite(item)}
                            />
                        );
                    })}
                </ScrollView>
            );
        }
        else {
          console.log("else : 3")
          return(
              this.noProductsRender()
          )
  
        }
      }
      else if (this.state.showInfo && this.state.item != null) {
        return (
            <InfoCard
                item = {this.state.item}
                onAdd={() => this.handleAddPlant(this.state.item)}
                onFavourite={() => this.handleSubFavourite(this.state.item)}
            />
        );
      }
      else if(this.state.isShowFav && !this.state.isShowSearch)
      {
        if(this.state.arrayFavData.length>0)
        {
  
          let newData = [...this.state.arrayFavData]
  
          if(this.state.sortByValue !=='')
          {
            if(this.state.sortByValue==='A-Z')
            {
            newData=sortJsonArray(newData,'name','asc')
            }
            else if(this.state.sortByValue==='Z-A') {
              newData=sortJsonArray(newData,'name','des')
            }
            else if(this.state.sortByValue==='Z-AS') {
              newData=sortJsonArray(newData,'botnical_name','des')
            }
            else if(this.state.sortByValue==='A-ZS') {
              newData=sortJsonArray(newData,'botnical_name','asc')
            } else {
              Alert.alert(ErrorHandling.alertTitle,ErrorHandling.underProcess);
            }
          } else{
            console.log("Sub category ======",this.state.arrayFavData);
          }
  
  
            return (
                <ScrollView
                    ref={ref => this.scrollViewFavourite = ref}
                    horizontal
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.contentContainerStyle}
                >
                    {newData.map((item, index) => {
                        return (
                            <Card
                                key={index}
                                item={item}
                                optionBtn={true}
                                onPressInfo={() => this.handleInfoButton(item)}
                                onAdd={() => this.handleAddPlant(item)}
                                onFavourite={() => this.handleSubFavourite(item)}
                            />
                        );
                    })}
                </ScrollView>
            );
  
        }
        else {
          console.log("else :2 ")
            return(
                this.noProductsRender()
            )
        }
      }
  
      else if(this.state.isShowSearch){
  
          if(this.arraySearchData.length > 0){
  
            return (
              <ScrollView
                  ref={ref => this.scrollViewSearch = ref}
                  horizontal
                  style={{ flex: 1 }}
                  contentContainerStyle={styles.contentContainerStyle}
              >
                  {this.arraySearchData.map((item, index) => {
                      return (
                          <Card
                              key={index}
                              item={item}
                              optionBtn={true}
                              onPressInfo={() => this.handleInfoButton(item)}
                              onAdd={() => this.handleAddPlant(item)}
                              onFavourite={() => this.handleSubFavourite(item)}
                          />
                      );
                  })}
              </ScrollView>
          );
  
  
          } else{
            console.log("else : ")
            return(
              this.noProductsRender()
          )
          }
      }
  
      else {
          let newData = [...this.state.arrayCategoryData];
  
          console.log("category list ====")
            if(this.state.sortByValue !=='')
            {
              if(this.state.sortByValue==='A-Z')
              {
                newData=sortJsonArray(newData,'name','asc')
              }
              else if(this.state.sortByValue==='Z-A') {
                newData=sortJsonArray(newData,'name','des')
              }
              else{
                  Alert.alert(ErrorHandling.alertTitle,ErrorHandling.categoryNotSorting);
                  this.setState({
                   sortByValue: "",
                   sortByLabel: "",
                   searchType: "",
                   searchOrder: ""
                 })
            }
  
          }
  
              if(newData && newData.length===0)
              {
                console.log("afdafd : "+JSON.stringify(newData))
                  return(
                     this.noProductsRender()
                  )
              }
  
              return (
                  <ScrollView
                      horizontal
                      style={{ flex: 1 }}
                      contentContainerStyle={styles.contentContainerStyle}
                     
                  >
                      {newData.map((item, index) => {
                          return (
                              <Card
                                  item={item}
                                  key={index}
                                  optionBtn={false}
                                  onPressCategory={() =>{
                                      this.callSubCategory(item)
                                      this.setState({ selected: !this.state.selected,searchValue:'' })
                                  }}
                              />
                          );
                      })}
                  </ScrollView>
              );
      }
    }
  
    searchProduct = async()=> {
  
      const {
        searchValue,
        searchType,
        searchOrder
      } = this.state
  
  
      if(searchValue.trim() == ""){
          Alert.alert(ErrorHandling.alertTitle,ErrorHandling.searchProductFirst);
      } else {
        this.setState({loading : true})
        var result  = await POSTApiAuth({
          action: "searchProduct",
              params: {
                keyword: searchValue,
                type:searchType,
                order:searchOrder,
            user_id: this.state.userId,
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
                backgroundColor : Colors.base_color
              });
            }, 100);
          }else {
            this.setState({loading : false,
              arrayProductData :result.data.DATA})
            
          
          }
        }
      }
    }
  
    sortProductList(item){
      this.setState({
        sortByLabel: item.label,
        searchType: item.type,
        searchOrder: item.order,
        isPickerOpen: false,
      });
  
      if(this.state.searchValue.trim() != "" && this.state.isShowSearch){
        setTimeout(() => {
          this.searchProduct()
        }, 5);
      } else {
        this.setState({ sortByValue: item.value })
      }
    }
  
    getSortedData = (events) => {
  
          events.sort(function (a, b) {
              return a.name - b.name
  
          })
          return events
    }
     render() {

      const {
        searchValue
      } = this.state
  
  
        let height=30
        if(this.state.showInfo && this.state.item != null)
        {
            height=50
        }
  
        if(this.state.isSearch && !this.state.showInfo)
        {
            return (
  
                <View style={styles.drawerContainer}>
                    <View style={styles.searchViewStyle}>
                        <TouchableOpacity
                            style={styles.closeBtnBg}
                            onPress={() => this.handleSearch()}
                        >
                            <Close
                                iconColor={"white"}
                                onPress={() => this.handleSearch()}
                            />
                        </TouchableOpacity>
  
                        <TextInput
                            style = {styles.textInputStyle}
                            value={searchValue}
                            placeholder="Search"
                            ref={ref => this.inputMy = ref}
                            placeholderTextColor={Colors.themeGray}
                            keyboardType="default"
                            returnKeyType="search"
                            underlineColorAndroid={"transparent"}
                            onChangeText={searchValue => this.setState({searchValue})}
                            onEndEditing={() =>  {
                              Keyboard.dismiss()
                              this.searchProduct()
                            }}
                        />
  
                        <View style={styles.inputRowContainer}>
  
                          {/* { !this.state.isPickerOpen && */}
                          {/* ( */}
                          <TouchableOpacity
                              style = {styles.PickerContainer}
                               onPress = {() => {this.setState({ isPickerOpen: true })}}
                          >
                          <View style={{ height:"100%", width:"100%",flexDirection:"row",alignItems:"center",
                              justifyContent:"space-between"}}
                              pointerEvents="none"
                            >
                          <FloatingTextInput
                              labelStyle={styles.FloatingLabelMainInput}
                              inputStyle={styles.input}
                              style={styles.dropDownStyle}
                              editable={false}
                              isSecure = {false}
                              placeHolder="Sort By"
                              value={this.state.sortByLabel}
                          />
                          <AntDesign
                              name="caretdown"
                              size={moderateScale(10)}
                              color={Colors.themeGray}
                              style={{ marginTop: moderateScale(10),marginLeft :moderateScale(3) }}
                          />
                          </View>
                          </TouchableOpacity>
                          {/* )
  
                          } */}
                        </View>
                    </View>
  
  
                    <View style={styles.drawerShadow}>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity
                                style={styles.redBtnBg}
                                onPress={() => this.handleBack()}
                            >
                              <Arrow
                                iconColor={"white"}
                                onPress={() => this.handleBack()}
                              />
                            </TouchableOpacity>
  
                           
                                <TouchableOpacity
                                    style={styles.redBtnBg}
                                    onPress={() => {
                                      this.handleSearch()
                                    }}
                                >
                                    <Search
                                        iconColor={"white"}
                                        onPress={() => this.handleSearch()}
                                    />
                                </TouchableOpacity>
                            
                            {!this.state.showInfo && (
                            <TouchableOpacity
                                style={styles.redBtnBg}
                                onPress={() => {
                                  if(this.state.isSearch){
                                    this.handleSearch()
                                  }
                                  this.setState({selected:false,isShowFav:true, showInfo: false})
                                  this.openFavouriteItems()
                                }}
                            >
                                <Star
                                    iconColor={"white"}
                                    onPress={() => {
                                      if(this.state.isSearch){
                                        this.handleSearch()
                                      }
                                      this.setState({selected:false,isShowFav:true, showInfo: false})
                                      this.openFavouriteItems()
                                    }}
                                />
                            </TouchableOpacity>)}
                        </View>
  
                        <View style={{ flex: 1,height: responsiveHeight(height),alignItems:"center", justifyContent: "center" }}>{this.handleBottomViewContent()}</View>
                    </View>
  
                    { this.state.isPickerOpen &&
                    (
                      <View style={styles.pickerViewStyle}>
                          <ScrollView
                              ref={ref => this.scrollViewPicker = ref}
                              keyboardShouldPersistTaps={"always"}
                              contentContainerStyle={{
                              paddingVertical: HEIGHT() * 0.02
                              }}
                          >
                          {this.state.arraySort.map((item, index) => {
                          return (
                          <TouchableOpacity
                              style={styles.itemContainer}
                              key={index}
                              onPress={() => {
                                  this.sortProductList(item);
                              }}
                          >
                              <Text style={styles.modalItemText}>{item.label}</Text>
                          </TouchableOpacity>
                          );
                          })}
                      </ScrollView>
                      </View>
                  )
  
                    }
                </View>
            );
        }
        else
        {
            return (
                <View style={styles.drawerContainer}>
  
                    <View style={styles.drawerShadow}>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity
                                style={styles.redBtnBg}
                                onPress={() => this.handleBack()}
                            >
                               <Arrow
                                  iconColor={"white"}
                                  onPress={() => this.handleBack()}
                                />
                            </TouchableOpacity>
  
                           
                                <TouchableOpacity
                                    style={styles.redBtnBg}
                                    onPress={() => this.handleSearch()}
                                >
                                  <Search
                                    iconColor={"white"}
                                    onPress={() => this.handleSearch()}
                                  />
                                </TouchableOpacity>
                          
                            {!this.state.showInfo && (
                            <TouchableOpacity
                                style={styles.redBtnBg}
                                onPress={() => {
                                  if(this.state.isSearch){
                                    this.handleSearch()
                                  }
                                  this.setState({selected:false,isShowFav:true, showInfo: false})
                                  this.openFavouriteItems()
                                }}
                            >
                                <Star
                                    iconColor={"white"}
                                    onPress={() => {
                                      if(this.state.isSearch){
                                        this.handleSearch()
                                    }
                                      this.setState({selected:false,isShowFav:true, showInfo: false})
                                      this.openFavouriteItems()
                                    }}
                                />
                            </TouchableOpacity>  )}
                        </View>
  
                        <View style={{ flex: 1,height: responsiveHeight(height),alignItems:"center", justifyContent: "center" }}>{this.handleBottomViewContent()}</View>
                    </View>
                </View>
            );
        }
    }
  }
const styles = StyleSheet.create({
  drawerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  
  formInput: {
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 1.5,
    flex: 1,
    borderColor: Colors.themeGray,
    marginVertical: HEIGHT() * 0.0075
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
  input: {
    borderWidth: 0,
    color: Colors.themeDark,
    fontSize: moderateScale(16),
    height: moderateScale(28),
    
  },
  FloatingLabelMainInput: {
    color: Colors.themeGray,
   
  },

  menuContainer: {
    justifyContent:'space-between',
    backgroundColor: "white",
    height:responsiveHeight(50),
    alignItems: "center",
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

  textInputStyle: {
    color: Colors.themeDark, 
    marginVertical: moderateScale(10),
    height: '80%', 
    width: "40%", 
    fontSize: moderateScale(13), 
    borderBottomWidth: 1.5, 
    borderBottomColor: Colors.themeGray
  },

  searchViewStyle: {
    width:'100%',
    paddingVertical: moderateScale(5),
    backgroundColor: "white",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3.0,
    borderBottomColor: Colors.lightGray,
  },

  inputRowContainer: {
    width: "40%",
    height: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20
  },

  dropDownStyle: {
    borderWidth: 0,
    borderRadius: 0,
    flex: 1,
    marginVertical: HEIGHT() * 0.0075
  },

  PickerContainer: {
    flex: 1,
    height: "100%",
    borderColor: Colors.themeGray,
    borderBottomWidth: 1.5,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  pickerViewStyle: {
    flex: 1, 
    width: "40%", 
    backgroundColor: "white", 
    alignSelf: "flex-end",
    right:20, 
    position: "absolute",
    elevation: 6,
    borderRadius: 5,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: -6
    }
  },

  itemContainer: {
    width: WIDTH() * 0.92,
    paddingHorizontal: WIDTH() * 0.03,
    paddingVertical: HEIGHT() * 0.01,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  modalItemText: {
    color: Colors.themeDark,
    fontSize: moderateScale(13),
    
  },

  closeBtnBg: {
    height: 50,
    width: 50,
    marginLeft: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    elevation: 6,
    shadowColor: "#000",
    shadowRadius: 25,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 6
    }
  },

  redBtnBg: {
    height: responsiveHeight(6.5),
    width: responsiveHeight(6.5),
    margin: 20,
    borderRadius: responsiveHeight(6.5)/2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    elevation: 6,
    shadowColor: "#000",
    shadowRadius: responsiveHeight(6.5)/2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 6
    }
  },
});
