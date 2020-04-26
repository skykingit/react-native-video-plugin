/*
 * @Author: your name
 * @Date: 2020-04-27 01:43:29
 * @LastEditTime: 2020-04-27 02:56:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ReactNativeVideoPlugin/src/animation/index.js
 */
/*
 * @Author: your name
 * @Date: 2020-04-27 01:43:29
 * @LastEditTime: 2020-04-27 01:55:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ReactNativeVideoPlugin/src/animation/index.js
 */


import React, {Component} from 'react';
import { StyleSheet, View, Animated, Easing,Text,Dimensions } from 'react-native';
 
const circle = require('./play.png');

import Video from 'react-native-video';
const VideoSource = require("../aseets/video/1988.mp4")

const {width,height} = Dimensions.get("window")
class Index extends Component {
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0)
        this.state = {
            screenWidth:50,
            screenHeight:100
        };
        this.fullScreen = this.fullScreen.bind(this)
    }
    componentDidMount(){
        this.spin();
    }
    fullScreen(){
        this.setState({
            screenWidth:height,
            screenHeight:width
        })
    }
    //旋转方法
    spin = () => {
        this.spinValue.setValue(0)
        Animated.timing(this.spinValue,{
          toValue: 0.25, // 最终值 为1，这里表示最大旋转 360度
          duration: 5000,
          easing: Easing.linear
       }).start(
            // this.fullScreen()
       )
    }
    render() {
        const { user, pwd, fadeAnim} = this.state;
        //映射 0-1的值 映射 成 0 - 360 度  
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '360deg'] //输出值
          })
        return(
            <View style={styles.container}>

                    {/* <Animated.Image style={[styles.circle,{transform:[{rotate: spin }]}]} source={circle}/> */}
                    <Animated.View 
                    style={[
                        styles.screen,
                        {transform:[{rotate: spin }]}
                    ]}
                    >
                         <Video source={VideoSource}   // Can be a URL or a local file.
                                ref={(ref) => {
                                    this.player = ref
                                }}                                      // Store reference
                                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                onError={this.videoError}               // Callback when video cannot be loaded
                                style={styles.backgroundVideo} 
                                fullscreen={true}
                                resizeMode="cover"
                                controls={true}
                                />
                    </Animated.View>
                    {/* <View style={[styles.screen,
                        {width:this.state.screenWidth,
                            height:this.state.screenHeight
                        }
                    ]}>
                        <Text style={styles.word}>
                            hi world
                        </Text>
                    </View> */}
                    
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        position:"absolute",
        top:0,
        left:0,
        width:width,
        height:height,
        backgroundColor:"blue"
    },
    circle:{
        position:'absolute',
        width: 300,
        height: 306
    },
    screen:{
        position:"absolute",
        top:-(width - height)/2,
        left:(width - height)/2,
        width:height,
        height:width,
        alignItems:"center",
        justifyContent:"center"
    },
    word:{
        fontSize:20,
        color:"white"
    },
    center:{
        position:"absolute",
        top:37,
        left:17,
        backgroundColor:"yellow",
        width:6,
        height:6
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }
});
export default Index;