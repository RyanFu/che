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
    BackAndroid,
    DeviceEventEmitter,
    AsyncStorage
} from 'react-native'
import NavBar from '../component/NavBar'
import Item from '../component/Item'
import UserProfile from './UserProfile'
import UserBackPage from '../lib/UserBackPage'
import Toast from 'react-native-root-toast';

//FontAwesome
export default class Setting extends UserBackPage {
  constructor(props){
      super(props)
  }

  back(){
    this.props.navigator.pop()
  }
  goProfile(){
    this.props.navigator.push({
        component: UserProfile,
        args: {}
    });
  }
  outlogin()
  {
      this.toast = Toast.show('退出成功', {
          duration: 20000,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: false,
          delay: 0,
      });
    setTimeout(()=>{
        AsyncStorage.removeItem("token",()=>{
            AsyncStorage.removeItem("userinfo");
            DeviceEventEmitter.emit('outlogin','');
            this.props.navigator.pop()
            Toast.hide(this.toast);
        })

    },500);

  }

  render(){
    return (
      <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
        <NavBar
          title="设置"
          leftIcon="ios-arrow-back"
          leftPress={this.back.bind(this)}
        />
        <ScrollView>
          <Item name="账户安全" first={true} onPress={this.goProfile.bind(this)}/>
          <Item name="通用"/>
          <Item name="关于享享" first={true}/>
          <Item.Button name="退出登录" first={true} onPress={this.outlogin.bind(this)}/>

        </ScrollView>
      </View>
    )
  }
}
