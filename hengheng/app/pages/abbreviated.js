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
export default class abbreviated extends Component {
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
            slists: this.state.slists.cloneWithRows(
                [
                     {
                        abbreviated: "京",
                        province: "京(北京)"
                    },
                     {
                        abbreviated: "沪",
                        province: "沪(上海)"
                    },
                     {
                        abbreviated: "粤",
                        province: "粤(广东)"
                    },
                     {
                        abbreviated: "浙",
                        province: "浙(浙江)"
                    },
                     {
                        abbreviated: "津",
                        province: "津(天津)"
                    },
                     {
                        abbreviated: "川",
                        province: "川(四川)"
                    },
                     {
                        abbreviated: "黑",
                        province: "黑(黑龙江)"
                    },
                     {
                        abbreviated: "吉",
                        province: "吉(吉林)"
                    },
                     {
                        abbreviated: "辽",
                        province: "辽(辽宁)"
                    },
                     {
                        abbreviated: "鲁",
                        province: "鲁(山东)"
                    },
                     {
                        abbreviated: "湘",
                        province: "湘(湖南)"
                    },
                     {
                        abbreviated: "蒙",
                        province: "蒙(内蒙古)"
                    },
                     {
                        abbreviated: "冀",
                        province: "冀(河北)"
                    },
                     {
                        abbreviated: "新",
                        province: "新(新疆)"
                    },
                     {
                        abbreviated: "甘",
                        province: "甘(甘肃)"
                    },
                     {
                        abbreviated: "青",
                        province: "青(青海)"
                    },
                     {
                        abbreviated: "陕",
                        province: "陕(陕西)"
                    },
                     {
                        abbreviated: "宁",
                        province: "宁(宁夏)"
                    },
                     {
                        abbreviated: "豫",
                        province: "豫(河南)"
                    },
                     {
                        abbreviated: "晋",
                        province: "晋(山西)"
                    },
                     {
                        abbreviated: "皖",
                        province: "皖(安徽)"
                    },
                     {
                        abbreviated: "鄂",
                        province: "鄂(湖北)"
                    },
                     {
                        abbreviated: "苏",
                        province: "苏(江苏)"
                    },
                     {
                        abbreviated: "贵",
                        province: "贵(贵州)"
                    },
                     {
                        abbreviated: "黔",
                        province: "黔(贵州)"
                    },
                     {
                        abbreviated: "云",
                        province: "云(云南)"
                    },
                     {
                        abbreviated: "桂",
                        province: "桂(广西)"
                    },
                     {
                        abbreviated: "藏",
                        province: "藏(西藏)"
                    },
                     {
                        abbreviated: "赣",
                        province: "赣(江西)"
                    },
                     {
                        abbreviated: "闽",
                        province: "闽(福建)"
                    },
                     {
                        abbreviated: "琼",
                        province: "琼(海南)"
                    },
                     {
                        abbreviated: "渝",
                        province: "渝(重庆)"
                    },
                     {
                        abbreviated: "使",
                        province: "使(大使馆)"
                    }
                ]
            ),
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
                DeviceEventEmitter.emit('changeaddress',rowData);
                this.handleBack()

            }}>
            <View style={{width:(width-22)/3,height:px2dp(30),justifyContent:"center", alignItems:"center",
                borderBottomWidth:1,borderBottomColor:"#eeeeee"
            }}>
                <Text>{rowData.province}</Text>
            </View>
            </TouchableWithoutFeedback>
        )
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#ffffff", position:"relative"}}>
                <NavBar
                    title="选择省份"
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}
                />
                <ListView
                    contentContainerStyle={{flexDirection:'row',justifyContent:"flex-start",flexWrap:"wrap",padding:px2dp(10)}}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.slists}
                    renderRow={this.renderlist.bind(this)}
                    initialListSize={40}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({})
