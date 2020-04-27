/*
 * @Author: your name
 * @Date: 2020-04-26 13:37:48
 * @LastEditTime: 2020-04-27 18:28:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ReactNativeVideoPlugin/src/plugin/react-native-video-plugin/index.js
 */
import React, { Component } from 'react';
import Video from 'react-native-video';
import {
    TouchableWithoutFeedback,
    TouchableHighlight,
    ImageBackground,
    PanResponder,
    StyleSheet,
    SafeAreaView,
    Easing,
    Image,
    View,
    Text,
    Dimensions
} from 'react-native';

const {width,height} = Dimensions.get("window")
console.log(width,height)
console.log(Dimensions.get("screen").width,Dimensions.get("screen").height)
class VideoPlayer extends Component{

    constructor(props){
        super(props)
        console.log(props,"this fullscreen props")
        let videoProps = {...props,poster:""}
        this.state = {
            containerWidth:0,
            containerHeight:0,
            controlOpacity:this.props.poster?1:0,
            posterOpacity:1,
            controlShow:false,
            VideoProps:videoProps,
            poster:"",
            posterResizeMode:this.props.posterResizeMode?this.props.posterResizeMode:"cover",
            playStatus:true,
            posterClickFlag:false,
            duration:0,
            progressBarFillWidth:0,
            seeking:false,
            seekerOffset:0,
            seekerFillWidth:0,
            seekerPosition:0,
            currentTime: 0,
            loadFlag:false,
            barDiameter:14,
            fullScreenSwitch:false
        }
        this.player={
            ref: Video,
            controlTimeout:null,
            seekerWidth:0,
            seekPanResponder:PanResponder,
            fullScreenInterval:null
        }
        this.onLoad = this.onLoad.bind(this)
        this.onVideoAreaTouch = this.onVideoAreaTouch.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
        this.onProgress = this.onProgress.bind(this)
        this.setSeekerPosition = this.setSeekerPosition.bind(this)
        this.setControlTimeout = this.setControlTimeout.bind(this)
        this.seekTo = this.seekTo.bind(this)
        this.hideControls = this.hideControls.bind(this)
        this.videPlayEnd = this.videPlayEnd.bind(this)
        this.toggleFullScreen = this.toggleFullScreen.bind(this)
        this.checkFullScreen = this.checkFullScreen.bind(this)
    }


    toggleFullScreen(){
        console.log("in toggleFullScreen")
        console.log(this.state)
        this.setState({
            fullScreenSwitch:!this.state.fullScreenSwitch
        })
    }

    UNSAFE_componentWillMount(){
        this.initSeekPanResponder()
    }

    componentDidMount(){
        // let self = this
        // this.player.fullScreenInterval =  setInterval(this.checkFullScreen,100)
    }

    checkFullScreen(){
        console.log("检测全屏事件.....")
        if(this.props.hasOwnProperty("videoScreenData")  && this.props.videoScreenData.fullScreenOpenFlag){
            this.toggleFullScreen(this.props)
            clearInterval(this.player.fullScreenInterval)
            console.log("检测到全屏事件")
        }
    }

    /**
     * Get our seekbar responder going
     */
    initSeekPanResponder() {
        this.player.seekPanResponder = PanResponder.create({

            // Ask to be the responder.
            onStartShouldSetPanResponder: ( evt, gestureState ) => true,
            onMoveShouldSetPanResponder: ( evt, gestureState ) => true,

            /**
             * When we start the pan tell the machine that we're
             * seeking. This stops it from updating the seekbar
             * position in the onProgress listener.
             */
            onPanResponderGrant: ( evt, gestureState ) => {
                let state = this.state;
                this.clearControlTimeout();
                state.seeking = true;
                state.barDiameter = 20;
                this.setState( state );
            },

            /**
             * When panning, update the seekbar position, duh.
             */
            onPanResponderMove: ( evt, gestureState ) => {
                let accumulatedDistance= gestureState.dx;
                if(this.state.fullScreenSwitch)
                accumulatedDistance = gestureState.dy
                const position = this.state.seekerOffset + accumulatedDistance;
                this.setSeekerPosition( position );
            },

            /**
             * On release we update the time and seek to it in the video.
             * If you seek to the end of the video we fire the
             * onEnd callback
             */
            onPanResponderRelease: ( evt, gestureState ) => {
                const time = this.calculateTimeFromSeekerPosition();
                let state = this.state;
                state.barDiameter = 14;
                if ( time >= state.duration) {
                    state.playStatus = false;
                } else {
                    this.seekTo( time );
                    this.setControlTimeout();
                    state.seeking = false;
                }
                this.setState( state );
            }
        });
    }

    calculateTimeFromSeekerPosition() {
        const percent = this.state.seekerPosition / this.player.seekerWidth;
        return this.state.duration * percent;
    }


    seekTo( time = 0 ) {
        let state = this.state;
        state.currentTime = time;
        this.player.ref.seek( time );
        this.setState( state );
    }

    setSeekerPosition( position = 0 ) {
        let state = this.state;
        position = this.constrainToSeekerMinMax( position );

        state.seekerFillWidth = position;
        state.seekerPosition = position;

        if ( ! state.seeking ) {
            state.seekerOffset = position
        };
        this.setState( state );
    }
    constrainToSeekerMinMax( val = 0 ) {
        if ( val <= 0 ) {
            return 0;
        }
        else if ( val >= this.player.seekerWidth ) {
            return this.player.seekerWidth;
        }
        return val;
    }

    calculateSeekerPosition() {
        const percent = this.state.currentTime / this.state.duration;
        return this.player.seekerWidth * percent;
    }

    setSeekerPosition( position = 0 ) {
        let state = this.state;
        position = this.constrainToSeekerMinMax( position );

        state.seekerFillWidth = position;
        state.seekerPosition = position ;

        if ( ! state.seeking ) {
            state.seekerOffset = position
        };

        this.setState( state );
    }

    onLoad(payload){
        this.setState({
            duration:payload.duration,
            loadFlag:true
        })

    }

    onProgress( data = {} ) {
        let state = this.state;
        state.currentTime = data.currentTime;

        if ( ! state.seeking ) {
            const position = this.calculateSeekerPosition();
            this.setSeekerPosition( position );
        }

        if ( typeof this.props.onProgress === 'function' ) {
            this.props.onProgress(...arguments);
        }

        this.setState( state );

        if(data.playableDuration - data.currentTime < 0.2 ){
            console.log("播放结束")
            this.videPlayEnd()
        }
    }

    videPlayEnd(){
        this.setState({
            playStatus:false,
            controlOpacity:1
        })
        console.log(this.state)
    }

    togglePlay(e){
        if(this.state.poster&& !this.state.posterClickFlag){
            this.onVideoAreaTouch()
        }else{
            this.setState({
                playStatus:!this.state.playStatus
            })
            if(this.state.playStatus)
            setTimeout(this.toggleControl,this.props.controlDuration)
        }
    }

    onVideoAreaTouch(){
        this.toggleControl()
    }

    toggleControl(){
        if(this.state.controlOpacity == 1){
            this.setState({
                controlOpacity:0
            })
        }else{
            this.setState({
                controlOpacity:1
            })
            this.setControlTimeout()
        }
    }

    setControlTimeout(){
        this.player.controlTimeout = setTimeout(this.hideControls,this.props.controlDuration)
    }

    hideControls() {
        if(this.state.playStatus)
        this.setState({
            controlOpacity:0
        })
    }



    clearControlTimeout() {
        clearTimeout( this.player.controlTimeout );
    }

    resetControlTimeout() {
        this.clearControlTimeout();
        this.setControlTimeout();
    }


    setProgressBarPosition(position =0){
        this.setState({
            progressBarFillWidth:position
        })
    }

    renderPlayButton({containerWidth,containerHeight}){
        return(
            <TouchableWithoutFeedback onPress={(e)=>this.togglePlay(e)} >
                <View 
                style={[styles.centerArea,
                {left:containerWidth/2 - this.props.playIconWidth/2,
                top:containerHeight/2 - this.props.playIconHeight/2,
                borderRadius: this.props.playIconWidth/2+10
                }]}
                >
                    <Image 
                    style={{width:this.props.playIconWidth,height:this.props.playIconHeight}}
                    resizeMode="contain" 
                    source={!this.state.playStatus?require("./assets/img/play.png"):require("./assets/img/pause.png")} />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderBottomArea(){
        return(
            <View style={styles.bottom} >
                <View style={styles.botttomArea}>
                    <View style={styles.progressArea}>
                        <View style={styles.playTime}>
                            <Text style={styles.timeWord}>
                                {this.formatTime(this.state.currentTime)}
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={styles.bar}
                            onLayout={ event => this.player.seekerWidth = event.nativeEvent.layout.width }
                            >
                                <View 
                                style={[styles.barFill,{
                                    width:this.state.seekerFillWidth-this.state.barDiameter/2
                                }]}>

                                </View>
                            </View>
                            <View style={[styles.barHand,{
                                left:this.state.seekerPosition-this.state.barDiameter/2,
                                width:this.state.barDiameter,
                                height:this.state.barDiameter,
                                borderRadius:this.state.barDiameter/2
                            }]}
                            { ...this.player.seekPanResponder.panHandlers }
                            >

                            </View>
                        </View>
                        <View style={styles.videoTime}>
                            <Text style={styles.timeWord}>
                                 {this.formatTime(this.state.duration)}
                            </Text>
                        </View>
                    </View>
                    <TouchableWithoutFeedback style={styles.fullScreenIconArea} onPress={()=>this.toggleFullScreen()}>
                        <View style={styles.fullScreenIconArea}> 
                            <Image source={require("./assets/img/fullscreen.png")} style={styles.fullScreenIcon} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    render(){
        let videoLayout = {
            top:this.props.videoData.y,
            left:this.props.videoData.x,
            width:this.props.videoData.width,
            height:this.props.videoData.height,
            zIndex:9999,
            position:"absolute"  
        }
        let containerWidth = this.props.videoData.width
        let containerHeight = this.props.videoData.height
        if(this.state.fullScreenSwitch){
           containerWidth = height
           containerHeight = width
            videoLayout = {
                width:height,
                height:width,
                transform:[{rotate: "90deg" }],
                top:-(width - height)/2,
                left:(width-height)/2,
                position:"absolute",
                zIndex:9999
            }
        }
        return(
            <TouchableWithoutFeedback 
            onPress={ this.onVideoAreaTouch }
            >
                <View style={[styles.container,videoLayout
                   ]}>
                    <Video
                        {...this.state.VideoProps}
                        style={styles.video}
                        paused = {!this.state.playStatus}
                        ref={v=>this.player.ref = v}
                        onLoad={PayLoad=>this.onLoad(PayLoad)}
                        onProgress={ this.onProgress }
                        repeat={false}
                        resizeMode="cover"
                    />
                    <View style={[styles.controlArea,{opacity:this.state.controlOpacity}]}>
                        <View style={styles.top}>
                            <Text style={styles.titleWord}>
                                {this.props.title}
                            </Text>
                            {this.state.posterClickFlag&& this.props.playAmount?<Text style={styles.littleWord}>
                                {this.props.playAmount}
                            </Text>:<Text></Text>}
                        </View>
                        {this.renderPlayButton({containerWidth,containerHeight})}
                        {this.renderBottomArea()}
                    </View>
                    
                </View>
            </TouchableWithoutFeedback>
        )        
    }

    formatTime( time = 0 ) {
        time = Math.ceil(time);
        let minutes = Math.floor(time/60);
        let seconds = time%60;
        let minuteStr=minutes,secondStr=seconds;
        if(minutes < 10)
        minuteStr = "0"+minutes
        if(seconds< 10)
        secondStr = "0"+secondStr

        return minuteStr+":"+secondStr
    }

}

VideoPlayer.defaultProps = {
    controlDuration:50000,
    playIconWidth:30,
    playIconHeight:30
}
export default VideoPlayer


const styles = StyleSheet.create({
    container:{
        flexDirection:"column"
    },
    video: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    controlArea:{
        position:"relative",
        width:"100%",
        height:"100%",
        backgroundColor:"rgba(0,0,0,0.3)"
    },
    top:{
        position:"absolute",
        top:0,
        left:0,
        zIndex:10,
        paddingTop:10,
        paddingLeft:20,
        paddingRight:20
    },
    centerArea:{
        position:"absolute",
        zIndex:10,
        backgroundColor:"rgba(0,0,0,0.3)",
        padding:10
    },
    titleWord:{
        fontSize:20,
        fontWeight:"bold",
        color:"white"
    },
    littleWord:{
        fontSize:12,
        color:"white"
    },
    posterArea:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        zIndex:9
    },
    posterBottom:{
        position:"absolute",
        bottom:0,
        left:0,
        flexDirection:"row",
        padding:10
    },
    posterBottomLeft:{
        flex:1,
        alignItems:"flex-start",
        justifyContent:"center"
    },
    posterBottomRight:{
        flex:1,
        alignItems:"flex-end",
        justifyContent:"center"
    },
    posterWord:{
        color:"white",
        fontSize:12
    },
    wordBg:{
        padding:5,
        borderRadius:10,
        backgroundColor:"rgba(0,0,0,0.3)"
    },
    bottom:{
        position:"absolute",
        bottom:0,
        left:0,
        width:"100%",
        padding:10,
        zIndex:2
    },
    botttomArea:{
        flexDirection:"row",
        justifyContent:"center",
        width:"100%"
    },
    progressArea:{
        flex:1,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    },
    playTime:{
        width:50,
        alignItems:"center",
        justifyContent:"center"
    },
    progressBar:{
        flex:1,
        alignItems:"flex-start",
        justifyContent:"center"
    },
    bar:{
        width:"100%",
        height:2,
        backgroundColor:"rgba(240,240,240,0.3)"
    },
    barFill:{
        position:"absolute",
        left:0,
        top:0,
        width:0,
        height:1,
        backgroundColor:"red"
    },
    barHand:{
        position:"absolute",
        top:-7,
        left:0,
        width:14,
        height:14,
        backgroundColor:"white",
        borderRadius:7
    },
    videoTime:{
        width:50,
        alignItems:"flex-end",
        justifyContent:"center"
    },
    timeWord:{
        fontSize:10,
        color:"white"
    },
    fullScreenIconArea:{
        width:50,
        alignItems:"flex-end",
        justifyContent:"center"
    },
    fullScreenIcon:{
        width:30,
        height:30
    }
})