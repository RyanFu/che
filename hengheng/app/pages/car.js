/**
 * Created by liaopeng on 17/3/15.
 */
'use strict';

import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    Platform,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ListView,
    DeviceEventEmitter,
    ActivityIndicator,
    BackAndroid,
    Dimensions
} from 'react-native'
import px2dp from '../util'
const {width, height} = Dimensions.get('window')
import set from '../config/config';
import request from '../lib/request'
import NavBar from '../component/NavBar'
export default class car extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showmask:true,
            hascar:false,
            slists: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            nocar:""
        }
        this.handleBack = this._handleBack.bind(this);
    }

    componentDidMount() {
        let intface=set.baseurl+set.interface.getcarlist;
        let databody={
            id:this.props.id
        }
        request.get(intface,databody).then((data)=>
        {
            if (data.length ==0)
            {
                this.setState({
                    hascar:false,
                    showmask: false,
                    nocar:"该品牌下没有车型"
                })

            }else{
            this.setState({
                slists: this.state.slists.cloneWithRows(data),
                showmask: false,
                hascar:true,

            })}

        }).catch((err)=>{
            this.setState({
                hascar:false,
                showmask: false,
            })
        })






        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
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
    renderlist(rowData)
    {
        return(
            <TouchableWithoutFeedback onPress={()=>{
                DeviceEventEmitter.emit('changecar',rowData);
                this.handleBack()

            }}>
            <View style={{justifyContent:"center", alignItems:"flex-start",
                borderBottomWidth:1,borderBottomColor:"#eeeeee",paddingHorizontal:px2dp(10), paddingVertical:px2dp(5)
            }}>
                <Text>{rowData.carname}</Text>
            </View>
            </TouchableWithoutFeedback>
        )
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#ffffff", position:"relative"}}>
                <NavBar
                    title="选择车型"
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}
                />
                {this.state.hascar?<ListView
                    contentContainerStyle={{padding:px2dp(10)}}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.slists}
                    renderRow={this.renderlist.bind(this)}
                    initialListSize={30}
                    enableEmptySections = {true}
                    />:<View style={{flex:1,justifyContent:'center', alignItems:"center"}}><Text>{this.state.nocar}</Text></View>}

                {this.state.showmask &&
                <View style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: "center",
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: "center", height: px2dp(100), width: px2dp(100), borderRadius: px2dp(10),
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}>
                        <ActivityIndicator style={{flex:2}}/>
                        <Text style={{color:"#ffffff",flex:1,fontSize:px2dp(12)}}>加载中...</Text>
                    </View>
                </View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({})
