/*
 * @Author: your name
 * @Date: 2020-04-26 14:00:32
 * @LastEditTime: 2020-04-30 15:00:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ReactNativeVideoPlugin/src/video-plugin/index.js
 */
import React,{Component} from 'react';
// import Video from '../plugin/react-native-video-plugin-plus'

import FullScrren from '../plugin/react-native-video-plugin-plus/fullScreen'

import { View, Text ,Dimensions,StyleSheet,Button,TouchableOpacity,ScrollView,FlatList} from 'react-native';
const {width,height} = Dimensions.get("window")
const VideoSource = require("../aseets/video/1988.mp4")
let videoListData = []
for(var i=0;i<10;i++)
videoListData.push({name:"index"+String((i+1))})
export default class VideoControlsScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            trackView:null,
            videoData:{ }
        }
        this.children = []
        this.getTargetLayout = this.getTargetLayout.bind(this)
        this.containerScroll = this.containerScroll.bind(this)
        this.clickVideoArea = this.clickVideoArea.bind(this)
        this.beginDrag = this.beginDrag.bind(this)
        this.renderItem = this.renderItem.bind(this)
        console.log(this.state,"this.state")
    }

    componentDidMount(){
        console.log(this.state,"this.state")
    }

    clickVideoArea(index){
        this.getTargetLayout(index)
    }
    getTargetLayout(index){
        if(this.children[index]){
            this.children[index].measure( (fx, fy, width, height, px, py) => {
                console.log(fx, fy, width, height, px, py)
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
               <View style={styles.container}>
                   <FlatList
                   data={videoListData}
                   renderItem={({item,index})=> <this.renderItem  item={item} index={index} />}
                   initialNumToRender={3}
                   onTouchStart={()=>{this.beginDrag()}}
                   keyExtractor={item=>item.name}
                   />

               </View>
               {/* <View
                style={{position:"absolute",
                top:100,
                left:0,
                width:100,
                height:100,
                backgroundColor:"red",
                zIndex:9999
            }}

                >

                </View> */}

                {this.state.trackView&& this.state.trackView.hasOwnProperty("x")?
                <FullScrren 
                source={VideoSource}
                style={styles.backgroundVideo} 
                fullscreen={true}
                resizeMode="cover"
                poster={require("../aseets/images/1988.jpeg")}
                posterResizeMode="cover"
                title="请回答1988,你是最棒的韩剧，竟然看了好几遍"
                playAmount = "3万次播放"
                videoTime="00:16"
                videoData={this.state.trackView}
                />:
                <View></View>}
            </>
            
        )
    }

    renderItem({item,index}) {
        return(
            <TouchableOpacity style={styles.poster}  ref={ref=>this.children.push(ref)} onPress={(e)=>this.clickVideoArea(index)}>
                <Text>
                    {item.name}
                </Text>
            </TouchableOpacity>
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
        alignItems:"center",
        backgroundColor:"yellow",
        borderBottomColor:"red",
        borderBottomWidth:1,
        justifyContent:"center"
    },
    trackView:{
        position:"absolute",
        backgroundColor:"white"
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }
})