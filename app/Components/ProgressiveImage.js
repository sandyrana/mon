import React from 'react';
import { View, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image'
import MyImageBackground from "./ImageBackground";
const styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    container: {
        flex:1,
        backgroundColor: "rgba(0,0,0,0.7)"
    },
});
class ProgressiveImage extends React.Component {

    render() {
        return (
            <View
                style={styles.container}>
                <MyImageBackground {...this.props} />
            </View>
        );
    }
}
export default ProgressiveImage;