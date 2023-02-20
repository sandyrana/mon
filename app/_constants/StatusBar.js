import React from 'react';

import {Text, View, Dimensions,
    Image,Platform,StyleSheet,
    TouchableOpacity, AsyncStorage,
    StatusBar,
    TouchableWithoutFeedback} from 'react-native';
import {responsiveHeight,responsiveWidth,responsiveFontSize} from "./dimensions";
import Colors from "../utils/Colors";









const StatusBarHeader = ({ ...props}) => (
    <View style={styles.statusBar}>
        <StatusBar translucent backgroundColor={styles.statusBar.backgroundColor} barStyle={"light-content"} {...props} />
    </View>
);
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? responsiveHeight(3.2) : responsiveHeight(4);
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {

        height: STATUSBAR_HEIGHT,
        backgroundColor: Colors.themeDark
        // backgroundColor:'#303030',

    },
    appBar: {
        backgroundColor:'#B1B1B1',
        height: APPBAR_HEIGHT,
    },
    content: {
        flex: 1,
        backgroundColor: '#33373B',
    },
});
export default StatusBarHeader;
