/**
 * @author LiaoPeng
 *
 */
'use strict';
import React, {Component} from 'react';
import {Text, View, StyleSheet, AsyncStorage,DeviceEventEmitter, PixelRatio, Platform, TouchableOpacity, Image, TextInput, BackAndroid} from 'react-native';
import LoginButton from '../component/LoginButton';
import TextButton from '../component/TextButton';
import ImageButton from '../component/ImageButtonWithText';
import TextDivider from '../component/TextDivider';
import Sendmsg from './SendMsg'
import px2dp from '../util/index';
import NavBar from '../component/NavBar'
import TabView from '../component/TabView';
import Toast from 'react-native-root-toast';
import Device from 'react-native-device-info';
import request from '../lib/request';
import set from '../config/config';
export default class SignInPage extends Component{
    constructor(props){
        super(props);
        this.state={
            mobile:'',
            password:''
        }
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);

    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    handleBack=()=>{
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }

    _signupCallback(){
        this.props.navigator.push({
            component:Sendmsg,
            args:{
                type:'regster'
            }
        })
    }

    _forgetPassword(){
        this.props.navigator.push({
            component:Sendmsg,
            args:{
                type:'forgetpass'
            }
        })
    }
    login(){
        if(!this.state.mobile)
        {
            alert("手机号码不能为空");
            return;
        }
        if(!this.state.password)
        {
            alert("密码不能为空");
            return;
        }
        this.toast = Toast.show('登陆中，请稍后', {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });
        let databody={
            device_token:Device.getUniqueID(),
            client:Platform.OS,
            mobile:this.state.mobile,
            password:this.state.password
        }
        request.post(set.baseurl+set.interface.login,databody).then((data)=>{
            Toast.hide(this.toast);
           if(parseInt(data.status)==0){
               this.toast = Toast.show('登陆成功', {
                   duration: 20000,
                   position: Toast.positions.CENTER,
                   shadow: true,
                   animation: true,
                   hideOnPress: false,
                   delay: 0,
               });
               setTimeout(()=>{
                   AsyncStorage.setItem("token",JSON.stringify(data.data));
                   DeviceEventEmitter.emit('login','');
                   Toast.hide(this.toast);
                   this.props.navigator.pop()

               },600);


           }else{
               alert(data.message);
               return;
           }
        }).catch((error)=>{
            Toast.hide(this.toast);
            this.toast = Toast.show('网络连接失败，请重试', {
                duration: 4000,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: false,
                delay: 0,
            });
        })
    }

    render(){
        return(
            <View style={styles.view}>
                <NavBar
                    title="登陆"
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                    rightIcon="md-person-add"
                    rightPress={this._signupCallback.bind(this)}


                />
                <View style={styles.editGroup}>
                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="手机号/邮箱"
                            placeholderTextColor="#c4c4c4"
                            onChangeText={(text)=>{
                                this.setState({
                                    mobile:text
                                })
                            }}
                            value={this.state.mobile}
                        />
                    </View>
                    <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.editView2}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="密码"
                            secureTextEntry={true}
                            placeholderTextColor="#c4c4c4"
                            onChangeText={(text)=>{
                                this.setState({
                                    password:text
                                })
                            }}
                            value={this.state.password}
                        />
                    </View>
                    <View style={{marginTop: px2dp(10),height:px2dp(45)}}>
                        <LoginButton text="登录" onPress={this.login.bind(this)}/>
                    </View>
                    <View style={styles.textButtonLine}>
                        <TextButton text="忘记密码?" onPress={this._forgetPassword.bind(this)} color="rgba(0,0,0,0.7)"/>
                        <TextButton text="注册账号" onPress={this._signupCallback.bind(this)} color="rgba(0,0,0,0.7)"/>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'flex-end', marginLeft: px2dp(20), marginRight: px2dp(20)}}>
                        <TextDivider text="其他账号登录"/>
                    </View>
                    <View style={styles.thirdPartyView}>
                        <ImageButton text="微博" image={require('../images/weibo_login.png')} color="rgba(0,0,0,0.7)"/>
                        <ImageButton text="微信" image={require('../images/wechat_login.png')} color="rgba(0,0,0,0.7)"/>
                        <ImageButton text="Github" image={require('../images/github_login.png')} color="rgba(0,0,0,0.7)"/>
                    </View>
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
    logo:{
        alignItems: 'center',
        marginTop: px2dp(40)
    },
    edit:{
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: '#fff',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    editView1:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    editView2:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    editGroup:{
        margin: px2dp(20)
    },
    textButtonLine:{
        marginTop: px2dp(12),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thirdPartyView:{
        flex: 1,
        marginTop: px2dp(10),
        flexDirection:'row',
        alignItems: 'flex-start',
        justifyContent:'space-around'
    }

});