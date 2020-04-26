/*
 * @Author: your name
 * @Date: 2020-04-26 14:00:32
 * @LastEditTime: 2020-04-27 04:34:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ReactNativeVideoPlugin/src/video-plugin/index.js
 */
import React,{Component} from 'react';
import Video from '../plugin/react-native-video-plugin'

import FullScrren from '../plugin/react-native-video-plugin/fullScreen'

import { View, Text ,Dimensions,StyleSheet,Button} from 'react-native';
const {width,height} = Dimensions.get("window")
const VideoSource = require("../aseets/video/1988.mp4")

export default class VideoControlsScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            bridgeDataForFullScreen:{},
            bridgeDataForVideoScreen:{}
        }
        this.buildBridgeForFullScreen = this.buildBridgeForFullScreen.bind(this)
        this.buildBridgeForVideoScreen = this.buildBridgeForVideoScreen.bind(this)

    }

    buildBridgeForFullScreen(data){
        console.log("in buildBridgeForFullScreen",data)
        this.setState({
            bridgeDataForVideoScreen:data
        })
    }

    buildBridgeForVideoScreen(data){
        console.log("in buildBridgeForVideoScreen",data)
        this.setState({
            bridgeDataForFullScreen:data
        })
    }

    render(){
        return(
            <>
                <FullScrren 
                    videoScreenData = {this.state.bridgeDataForFullScreen}
                    videoBridge = {(data)=>this.buildBridgeForFullScreen(data)}
                />
                <View style={styles.container}>
                    <View style={styles.videoArea}>
                        <Video source={VideoSource}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.player = ref
                        }}                                      // Store reference
                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        onError={this.videoError}               // Callback when video cannot be loaded
                        style={styles.backgroundVideo} 
                        fullscreen={true}
                        resizeMode="cover"
                        poster={require("../aseets/images/1988.jpeg")}
                        posterResizeMode="cover"
                        title="请回答1988,你是最棒的韩剧，竟然看了好几遍"
                        playAmount = "3万次播放"
                        videoTime="00:16"
                        fullScreenData = {this.state.bridgeDataForVideoScreen}
                        fullBridge = {(data)=>this.buildBridgeForVideoScreen(data)}
                        />
                    </View>
                    <View style={styles.navArea}>
                    <Button title="Go To Video Controls" onPress={()=>{ this.props.navigation.navigate("VideoControls")}} />
                        <Button title="Go To Video" onPress={()=>{ this.props.navigation.navigate("Video")}} />
                        <Button title="Go To Video Plugin" onPress={()=>{ this.props.navigation.navigate("VideoPlugin")}} />
                    </View>
                    
                </View>
            </>
            
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"column",
        marginTop:100
    },
    videoArea:{
        position: "relative",
        width:width,
        height:width*9/16,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
})