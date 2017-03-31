/**
 * Created by liaopeng on 17/3/2.
 */
'use strict';

import React, {Component} from 'react';
import {Text, View, StyleSheet,DeviceEventEmitter, AsyncStorage, PixelRatio, Platform, TouchableOpacity, Image, TextInput, BackAndroid} from 'react-native';
import ImageButton from '../component/ImageButtonWithText';
import Button from '../component/LoginButton';
import px2dp from '../util/index';
import NavBar from '../component/NavBar'
import request from '../lib/request';
import Toast from 'react-native-root-toast';
import set from '../config/config';
import TabView from '../component/TabView';
import Device from 'react-native-device-info';
export default class SignUpPage extends Component {
    constructor(props){
        super(props);
        this.handleBack = this._handleBack.bind(this);
        this.state={
            pass1:'',
            pass2:'',
            title:'新用户设置密码',
            btn_title:'注册',
            toast_title:"注册中，请稍等"
        }
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        if(this.props.type);
        {
            if(this.props.type=="forgetpass")
            {
                this.setState({
                    title:"重置密码",
                    btn_title:'修改',
                    toast_title:"修改中，请稍等"
                })
            }
        }
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }

    _signupCallback(){
        if(!this.state.pass1||!this.state.pass2)
        {
            alert("两次密码不能有空项")
            return
        }
        if(this.state.pass2!=this.state.pass1)
        {
            alert("两次密码不一至，请重新输入")
            return
        }
        this.toast = Toast.show(this.state.toast_title, {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });
        let url=set.baseurl+set.interface.register;
        let databody={
            mobile:this.props.mobile,
            code:this.props.code,
            type:this.props.type,
            pass1:this.state.pass1,
            pass2:this.state.pass2,
            client:Platform.OS,
            device_token:Device.getUniqueID()
        }
        request.post(url,databody).then((data)=>{
            Toast.hide(this.toast);
            if(parseInt(data.status)==0){
                AsyncStorage.setItem("token",JSON.stringify(data.data),()=>{
                    DeviceEventEmitter.emit('login','');
                    this.toast = Toast.show(data.message, {
                        duration: 20000,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: false,
                        delay: 0,
                    });
                    setTimeout(()=>{
                        Toast.hide(this.toast);
                        this.props.navigator.popToTop();
                    },500)

                });

            }else{
                alert(data.message);
                return;
            }
        })
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
                            placeholder="输入密码"
                            secureTextEntry={true}
                            onChangeText={(text)=>{
                                this.setState({
                                    pass1:text
                                })
                            }}
                            value={this.state.pass1}
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>

                    <View style={styles.editView3}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="请再次输入密码"
                            secureTextEntry={true}
                            onChangeText={(text)=>{this.setState({
                                pass2:text
                            });}}
                            value={this.state.pass2}
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{marginTop: px2dp(15)}}>
                        <Button text={this.state.btn_title} onPress={this._signupCallback.bind(this)}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#e83e41'
    },
    actionBar:{
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    editGroup:{
        padding: px2dp(20)
    },
    edit:{
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: 'white',
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
        justifyContent: 'center'
    },
    editView3:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
});