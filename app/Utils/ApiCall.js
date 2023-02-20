/* eslint-disable no-trailing-spaces */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable space-infix-ops */
/* eslint-disable keyword-spacing */
/* eslint-disable eqeqeq */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import APIKit from '../Utils/APIKit.js';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
export const POSTApiAuth = async ( object) => {
  console.log("object"+ JSON.stringify(object))
  return APIKit.post("magentoapi.php", object)
  .then(function (response) {
    console.log("res" +JSON.stringify(response.data))
var resMeta = response.data.success

if (resMeta) {
  return { error : false,  message: response.data.message, data: response.data }
} else {
  return { error : true, message: response.data.message, data: '' }
}
})
.catch(function (error) {
  console.log("error" + JSON.stringify(error.response))
  if(error.response == undefined){
    return { error : true, message: "Something went wrong with api", data: '' }
  }else if(error.response.status == 440 || error.response.status == 401){
    return { error : true, message: "Session expire, Please login again", data: '' }
   }else {
    return { error : true, message: "Something went wrong with api", data: '' }
   }
});
}
export const POSTFormApiAuth = async ( object) => {
  console.log("object"+ JSON.stringify(object))
  return APIKit.post("magentoapi.php", object ,{
    method: "POST",
    body: object,
    headers : {
      Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
    } 
    })
  .then(function (response) {
    console.log("res" +JSON.stringify(response.data))
var resMeta = response.data.success

if (resMeta) {
  return { error : false,  message: response.data.message, data: response.data }
} else {
  return { error : true, message: response.data.message, data: '' }
}
})
.catch(function (error) {
  console.log("error" + JSON.stringify(error.response))
  if(error.response == undefined){
    return { error : true, message: "Something went wrong with api", data: '' }
  }else if(error.response.status == 440 || error.response.status == 401){
    return { error : true, message: "Session expire, Please login again", data: '' }
   }else {
    return { error : true, message: "Something went wrong with api", data: '' }
   }
});
}
