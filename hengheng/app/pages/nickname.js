/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
    AsyncStorage,
    BackAndroid,
    DeviceEventEmitter,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import NavBar from '../component/NavBar'
import set from '../config/config';
import request from '../lib/request';
import px2dp from '../util/index';
import Device from 'react-native-device-info';
import Toast from 'react-native-root-toast';
//FontAwesome
export default class nickname extends Component{
  constructor(props){
      super(props);
      this.state={
          token: '',
          nickname:'',
          device_token:'',
          userinfo:null
      }

    this.handleBack = this._handleBack.bind(this);


  }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        this.toast = Toast.show('加载中，请稍后', {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });
        AsyncStorage.getItem("userinfo").then((data)=>{
            if(data){
                let userinfo=JSON.parse(data);
                this.setState({
                    nickname:userinfo.name,
                    token:userinfo.token,
                    device_token:Device.getUniqueID(),
                    userinfo:userinfo
                })
                Toast.hide(this.toast);
            }else{
                Toast.hide(this.toast);
                alert("用户信息错误");
                this._handleBack();
            }

        })
    }
    changename(){
        this.toast = Toast.show('正在修改昵称，请稍后', {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });
      let databody={
          token:this.state.token,
          device_token:this.state.device_token,
          nicename:this.state.nickname
      }
      request.post(set.baseurl+set.interface.changename,databody).then((data)=>{
            Toast.hide(this.toast);
            if(parseInt(data.status)==0)
            {
                this.toast = Toast.show(data.message, {
                    duration: 2000,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0,
                });
                let userinfo = this.state.userinfo;
                userinfo.name=this.state.nickname;
                AsyncStorage.setItem('userinfo',JSON.stringify(userinfo));
                DeviceEventEmitter.emit('changenickname',this.state.nickname);
                setTimeout(()=>{
                    this.props.navigator.pop();
                },500)


            }else{

            }
      });
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


  render(){
    return (
      <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
        <NavBar
          title="修改昵称"
          leftIcon="ios-arrow-back"
          leftPress={this._handleBack.bind(this)}
        />
        <View style={{justifyContent:'center'}}>
            <View style={styles.inputtext}>
                <Text style={styles.label}>
                    昵称:
                </Text>
                <TextInput
                    style={styles.edit}
                    underlineColorAndroid="transparent"
                    placeholder={this.state.nickname}
                    placeholderTextColor="#c4c4c4"
                    onChangeText={(text)=>{
                        this.setState({
                            nickname:text
                        })
                    }}

                />
            </View>
            <TouchableOpacity onPress={this.changename.bind(this)}>
            <View style={styles.buttontext}>
                <Text style={styles.button}>
                    确定
                </Text>
            </View>
            </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    inputtext:{
      flexDirection:'row',
        padding: px2dp(15),
        justifyContent:'center',
        alignItems:'center',
    },
    buttontext:{
        flexDirection:'row',
        padding: px2dp(15),
        justifyContent:'center',
        alignItems:'center',
    },
    edit:{
        flex:4,
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: '#fff',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        justifyContent:'center',
    },
    label:{
        flex:1,
        fontSize:px2dp(16),

    },
    button:{
        flex:1,
        borderWidth:px2dp(1),
        borderColor:"#cccccc",
        height:px2dp(40),
        fontSize:px2dp(16),
        paddingTop:px2dp(12),
        backgroundColor:'#e83e41',
        textAlign:'center',
        color:'#ffffff'
    }

})
