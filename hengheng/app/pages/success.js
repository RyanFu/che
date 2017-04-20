/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
} from 'react-native'
import NavBar from '../component/NavBar'
import set from '../config/config';
import request from '../lib/request';
import px2dp from '../util/index';
import Device from 'react-native-device-info';
import Toast from 'react-native-root-toast';
import order from './Order'
//FontAwesome
export default class success extends Component{
  constructor(props){
      super(props);
      this.state={
          token: '',
          nickname:'',
          device_token:'',
          userinfo:null
      }


  }
    componentDidMount() {

    }

    componentWillUnmount() {
    }
    backindex()
    {
        this.props.navigator.popToTop()
    }
    jumptoorder()
    {
        this.props.navigator.push({
            component:order
        })
    }


  render(){
    return (
      <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
        <NavBar
          title="下单成功"
        />
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <View style={{marginTop:px2dp(30)}}>
                <Text style={{fontSize:px2dp(25),fontWeight:'bold'}}>下单成功</Text>

            </View>
            <View style={{flexDirection: 'row',padding:px2dp(20)}}>
                <Text onPress={this.backindex.bind(this)} style={{margin:px2dp(10),borderWidth:1,borderColor:"#ea3524",borderRadius:px2dp(5), padding:px2dp(5),
                    color:"#ea3524"
                }}>
                    返回
                </Text>
                <Text onPress={this.jumptoorder.bind(this)} style={{margin:px2dp(10),borderWidth:1,borderColor:"#ea3524",borderRadius:px2dp(5), padding:px2dp(5),
                    color:"#ea3524"
                }}>
                    查看订单
                </Text>
            </View>
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
