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
    ActivityIndicator,
    InteractionManager,
    ScrollView,
    Image
} from 'react-native'
import NavBar from '../component/NavBar'
import data from '../data'
import Bz from '../component/Bz'
import set from '../config/config'
import request from '../lib/request'
import px2dp from '../util/index'
import MyWebView from '../component/MyWebView'


export default class Store extends Component {
    constructor(props){
        super(props)
        this.state = {
            listLoading: false,
            storelist:{}
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            request.get(set.baseurl+set.interface.storelist,{}).then((data)=>{
                this.setState({
                    storelist:data.data
                })
            })
        })
    }
    _renderheader()
    {
        return(<View><Text>1111</Text></View>)
    }
    render(){
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar title="门店"/>
                <MyWebView style={{flex:1}}
                 source={{uri: set.baseurl+"index.php?g=app&m=public&a=mapview"}}
                 domStorageEnabled={true}
                 javaScriptEnabled={true}
                 />

                <ScrollView style={{flex:1}}
                            renderHeader={this._renderheader()}
                >

                    {this._renderBZ()}

                </ScrollView>
            </View>
        )
    }
    _renderBZ(){
        var temp=[];
        for(var i in this.state.storelist)
        {
            var tt=this.state.storelist[i]
            temp.push(
                <View key={i} style={{backgroundColor:"#ffffff",padding:px2dp(8),marginBottom:px2dp(2),flexDirection:'row'}}>
                   <View>
                       <Image source={{uri:set.baseurl+"data/upload/"+tt.thumb}} style={{width:px2dp(50),height:px2dp(50)}}/>
                   </View>
                    <View style={{paddingLeft:px2dp(10)}}>
                    <Text>{tt.name}</Text>
                    <Text style={{color:"#cccccc"}}>{tt.desc}</Text>
                        <Text style={{color:"#cccccc"}}>地址:{tt.address}</Text>
                    </View>
                </View>
            )
        }
        return temp;
    }
}


const styles = StyleSheet.create({
    webview_style: {
        flex: 1
    }
})
