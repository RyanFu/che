/**
 * Created by liaopeng on 17/3/3.
 */

'use strict';

import React, {Component} from 'react';
import {Text, View, StyleSheet, PixelRatio, Platform, TouchableOpacity, AsyncStorage, Image, TextInput, BackAndroid} from 'react-native';
import ImageButton from '../component/ImageButtonWithText';
import Button from '../component/LoginButton';
import px2dp from '../util/index';
import NavBar from '../component/NavBar';
import Toast from 'react-native-root-toast';
import Register from './register';
import set from '../config/config';
import request from '../lib/request'
export default class SendMsg extends Component {
    constructor(props){
        super(props);
        this.handleBack = this._handleBack.bind(this);
        this.state={
            seconds:0,
            issend:false,
            mobile:'',
            msgcode:'',
            witetime:60,
            type:'',
            title:'用户注册手机验证',
        }
    }

    componentDidMount() {
        if(this.props.type)
        {
            this.setState({
               type:this.props.type
            });
            if(this.props.type=="forgetpass")
            {
                this.setState({
                    title:"重置密码手机验证"
                })
            }
        }
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        AsyncStorage.getItem("verify_time").then((data)=>{
            if(data){
                let endtime=(parseInt(data)+this.state.witetime)-(parseInt((new Date()).valueOf()/1000));
                if(endtime>0)
                {
                    this.setState({
                        seconds:endtime,
                        issend:true
                    });
                    this.interval=setInterval(()=>{
                        if(this.state.seconds<=0)
                        {
                            return clearInterval(this.interval);
                        }else{
                            this.setState({
                                seconds:this.state.seconds-1
                            })
                        }
                    },1000)
                }
            }
        }).catch((err)=>{
            alert("出错啦！");
        });
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
        clearInterval(this.interval)
    }

    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }
    sendmsg()
    {
        clearInterval(this.interval);
        this.toast = Toast.show('验证码发送中，请稍后', {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });

        if(this.state.mobile)
        {

            if(!(/^1[34578]\d{9}$/.test(this.state.mobile))){
                alert("手机号码有误，请重填");
                Toast.hide(this.toast);
                return false;
            }


        }else{
            Toast.hide(this.toast);
            alert("请输放您的手机号码");
            return;
        }
        let databody={
            mobile:this.state.mobile,
            type:this.state.type
        };


        request.post(set.baseurl+set.interface.sendsns,databody).then((data)=>{
            Toast.hide(this.toast);

            if(parseInt(data.status)==0)
            {
                Toast.show('发送成功', {
                    duration: 2000,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0,
                });
                let nowtime=parseInt(((new Date).valueOf())/1000);
                AsyncStorage.setItem("verify_time",nowtime.toString());
                this.setState({
                    seconds:this.state.witetime,
                    issend:true

                })

                this.interval=setInterval(()=>{
                    if(this.state.seconds<=0)
                    {
                        return clearInterval(this.interval);
                    }else{
                        this.setState({
                            seconds:this.state.seconds-1
                        })
                    }
                },1000)

            }else{
                alert(data.message);
            }

        })


    }
    _signupCallback(){
        if(!this.state.mobile||!this.state.msgcode)
        {
            alert("请完收取短信验证码");
            return;
        }
        this.toast = Toast.show('正在验证，请稍后', {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });
        let databody={
            mobile:this.state.mobile,
            code:this.state.msgcode,
            type:this.state.type
        }
        request.post(set.baseurl+set.interface.checksns,databody).then((data)=>{
            Toast.hide(this.toast);
            if(parseInt(data.status)==0){
                this.props.navigator.push({
                    component:Register,
                    args:{
                        mobile:this.state.mobile,
                        code:this.state.msgcode,
                        type:this.state.type
                    }
                })
            }else{
                alert(data.message);
            }

        })

    }
    nosend(){

    }
    render(){
        return(
            <View style={styles.view}>
                <NavBar
                    title={this.state.title}
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <View style={styles.editGroup}>
                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="请输入手机号"
                            placeholderTextColor="#c4c4c4"

                            onChangeText={ (text) => this.setState({
                                mobile:text

                            }) }
                            value={this.state.mobile}
                        />
                    </View>
                    <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.verify}
                            underlineColorAndroid="transparent"
                            placeholder="短信验证码"
                            placeholderTextColor="#c4c4c4"

                            onChangeText={ (text) => this.setState({
                                msgcode:text
                            }) }
                            value={this.state.msgcode}
                        />
                        {this.state.seconds>0?
                            <View style={styles.verify_btn_disiable}>
                                <Text style={styles.verify_btn_text}>
                                    剩余{this.state.seconds}秒
                                </Text>
                            </View>
                            :
                            <TouchableOpacity onPress={this.sendmsg.bind(this)}>
                            <View style={styles.verify_btn}>
                            <Text style={styles.verify_btn_text}>
                            获取
                            </Text>
                            </View>
                            </TouchableOpacity>}
                    </View>
                    {this.state.issend?
                        <View style={{marginTop: px2dp(15)}}>
                            <Button text="验证" onPress={this._signupCallback.bind(this)}/>
                        </View>
                        :<View style={{marginTop: px2dp(15)}}>
                            <Button text="验证" onPress={this.nosend.bind(this)}/>
                        </View>
                    }

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#f3f3f3'
    },
    actionBar:{
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    editGroup:{
        padding: px2dp(20)
    },
    edit:{
        flex: 1,
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: 'white',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    verify:{
        flex: 3,
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: 'white',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    verify_btn:{
        flex: 1,
        height: px2dp(40),
        margin:px2dp(4),
        backgroundColor: '#ea3524',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        borderWidth:1,
        borderColor:"#c4c4c4",
        borderRadius:px2dp(4),
        justifyContent:'center',
        alignItems:'center'


    },
    verify_btn_disiable:{
                        flex: 1,
                        height: px2dp(40),
                        margin:px2dp(4),
                        backgroundColor: '#cccccc',
                        paddingLeft: px2dp(15),
                        paddingRight: px2dp(15),
                        borderWidth:1,
                        borderColor:"#cccccc",
                        borderRadius:px2dp(4),
                        justifyContent:'center',
                        alignItems:'center'
                    },
    verify_btn_text:{
        color:"#ffffff",

        fontSize: px2dp(14),


    },
    editView1:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        flexDirection:'row',
    },
    editView2:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        flexDirection:'row'
    },
    editView3:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
});