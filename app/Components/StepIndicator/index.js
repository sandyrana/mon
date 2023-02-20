import React, { Component } from "react";
import { Platform, View, Text, FlatList } from "react-native";
import { Check } from "../../../assets/icons";
import stylesCard from "./stylesCard";
import {responsiveWidth} from "../../_constants/dimensions";

class StepIndicator extends Component {
  constructor() {
    super();

    this.state = {
      separatorWidth: 0,
      marginHorizontalSep: 0
    };
  }

  componentWillMount() {}

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    var header = "Registration";
    if(this.props.headerValue)
    {
      header = this.props.headerValue;
    }
    else if (this.props.steps.length !== 0) {
      header = this.props.steps[this.props.step].header;
    } else {
      header = "please provide an array";
    }
    return (
      <View style={stylesCard.CardHeader}>
        <Text style={stylesCard.headerStyle}>{header}</Text>
        {!this.props.fromSaveDesignDraft && 
        <View
            style={stylesCard.contentContainerStyle}>
          <View style={ stylesCard.baseViewStyle}>
          {this.props.steps.map((item, index) => {
            return (
                <View key={index} 
                  style={[stylesCard.stepContainer,
                    {
                       width:this.props.steps.length - 1 !== index ? "37%": "15%",
                   // marginLeft: index == 0 ? responsiveWidth(3) :0,
                    //marginRight: this.props.steps.length - 1 !== index ? 0 : responsiveWidth(3)
                  }]}
                >
                  <View
                      style={[
                        stylesCard.stepNumber,
                        {
                          backgroundColor:
                              item.active || item.completed ? "red" : "gray"
                        }
                      ]}
                  >
                    {item.completed ? (
                        <Check iconColor={"white"} />
                    ) : (
                        <Text style={stylesCard.stepNumberStyle}>{item.id}</Text>
                    )}
                  </View>
                  <View style={{flexDirection: 'row', 
                        width: this.props.steps.length - 1 !== index ? responsiveWidth(18): responsiveWidth(8)
                  }}>
                    <Text

                        style={stylesCard.stepNameStyle}
                    >
                      {item.stepName}
                    </Text>
                    {
                      this.props.steps.length - 1 !== index ? (
                          <View
                              style={stylesCard.separator}
                          />
                      ) : null}
                  </View>

                </View>
            );
          })}
          </View>
        </View>}

      </View>
    );
  }
}

export default StepIndicator;
