import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { string, func, object, number, any } from 'prop-types';
import { TextInput } from 'react-native-paper';
import Colors from '../../assets/Colors.js'
export class FloatingTextInput extends Component {
  static propTypes = {
    attrName: string.isRequired,
    title: string.isRequired,
    value: string,
    isSecure: any,
    updateMasterState: func.isRequired,
    keyboardType: string.isRequired,
  }


  constructor(props) {
    super(props);

  }
  _onChangeText = (updatedValue) => {
    const { attrName, updateMasterState } = this.props; 
    updateMasterState(attrName, updatedValue);
  }
  render() {
    return (
        <TextInput
          label = {this.props.title}
          value = {this.props.value}
          style = {Styles.textInput}
          mode = "outlined"
          secureTextEntry={this.props.isSecure == 'true' ? true :false}
          numberOfLines = {1}
          scrollEnabled = {false}
          onChangeText = {this._onChangeText}
          keyboardType = {this.props.keyboardType}
      
        />
    )
  }
}

const Styles = StyleSheet.create({
  textInput: {
    fontSize: 15,
    width: '98%',
    justifyContent : 'center',
    backgroundColor : Colors.base_color2,
    color: 'black',
  },
})