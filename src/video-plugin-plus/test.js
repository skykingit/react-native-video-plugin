/*
 * @Author: your name
 * @Date: 2020-04-27 16:17:28
 * @LastEditTime: 2020-04-27 16:17:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ReactNativeVideoPlugin/src/video-plugin-plus/test.js
 */
/*
 * @Author: your name
 * @Date: 2020-04-26 14:00:32
 * @LastEditTime: 2020-04-27 16:11:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ReactNativeVideoPlugin/src/video-plugin/index.js
 */
import React,{Component} from 'react';
// import Video from '../plugin/react-native-video-plugin-plus'

// import FullScrren from '../plugin/react-native-video-plugin-plugin/fullScreen'

import { View, Text ,Dimensions,StyleSheet,Button,TouchableOpacity,ScrollView} from 'react-native';
const {width,height} = Dimensions.get("window")
// const VideoSource = require("../aseets/video/1988.mp4")

export default class VideoControlsScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            trackView:{}
        }
        this.getTargetLayout = this.getTargetLayout.bind(this)
        this.containerScroll = this.containerScroll.bind(this)
        this.clickVideoArea = this.clickVideoArea.bind(this)
        this.beginDrag = this.beginDrag.bind(this)
        console.log(this.state)
    }

    componentDidMount(){
    }

    clickVideoArea(){
        this/this.getTargetLayout()
    }
    getTargetLayout(e = null){
        if(this.target){
            this.target.measure( (fx, fy, width, height, px, py) => {
                console.log('Component width is: ' + width)
                console.log('Component height is: ' + height)
                console.log('X offset to frame: ' + fx)
                console.log('Y offset to frame: ' + fy)
                console.log('X offset to page: ' + px)
                console.log('Y offset to page: ' + py)
                let newTrackView ={
                    width:width,
                    height:height,
                    x:px,
                    y:py
                }
                this.setState({
                    trackView:newTrackView
                })
            }) 
        }
    }

    containerScroll(e){
        // this.getTargetLayout()
    }
    endDrag(){
        this.getTargetLayout()
    }
    beginDrag(){
        this.setState({
            trackView:{}
        })
    }
    render(){
        return(
            <>
                <View style={[styles.trackView,
                {
                    top:this.state.trackView.y,
                    left:this.state.trackView.x,
                    width:this.state.trackView.width,
                    height:this.state.trackView.height,
                    zIndex:this.state.trackView?9999:-1
                }]}

                >
                   <Text>
                       Ha ha hahahahahha
                   </Text>

                </View>
                <ScrollView style={styles.container} 
                onScroll={(e)=>this.containerScroll(e)}
                onScrollBeginDrag={()=>{
                    this.beginDrag()
                }}
                >
                <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    
                    <TouchableOpacity style={styles.poster} 
                    onPress={(e)=>this.clickVideoArea(e)}
                    ref={ref=>this.target=ref}
                    >
                        
                    </TouchableOpacity>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                    <View style={styles.block}></View>
                </ScrollView>
            </>
            
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"column",
        backgroundColor:"red"
    },
    poster:{
        width:width,
        height:width*9/16,
        backgroundColor:"green"
    },
    block:{
        height:99,
        backgroundColor:"yellow",
        borderBottomColor:"red",
        borderBottomWidth:1
    },
    trackView:{
        position:"absolute",
        backgroundColor:"white"
    }
})