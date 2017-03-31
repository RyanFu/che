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
    BackAndroid,
    Dimensions
} from 'react-native'
import px2dp from '../util'
const {width, height} = Dimensions.get('window')
import set from '../config/config';
import request from '../lib/request'
import NavBar from '../component/NavBar'
export default class plate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showmask:true,
            slists: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
        this.handleBack = this._handleBack.bind(this);
    }

    componentDidMount() {
        this.setState({
            slists: this.state.slists.cloneWithRows(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']),
            showmask: false,

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
                DeviceEventEmitter.emit('changeletter',rowData);
                this.handleBack()

            }}>
            <View style={{width:(width-22)/3,height:px2dp(30),justifyContent:"center", alignItems:"center",
                borderBottomWidth:1,borderBottomColor:"#eeeeee"
            }}>
                <Text>{rowData}</Text>
            </View>
            </TouchableWithoutFeedback>
        )
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#ffffff", position:"relative"}}>
                <NavBar
                    title="选择车牌"
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}
                />
                <ListView
                    contentContainerStyle={{flexDirection:'row',justifyContent:"flex-start",flexWrap:"wrap",padding:px2dp(10)}}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.slists}
                    renderRow={this.renderlist.bind(this)}
                    initialListSize={30}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({})
