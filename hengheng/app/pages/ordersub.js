/**
 * Created by liaopeng on 17/3/10.
 */
/**
 * @author LiaoPeng
 *
 */


import React, {Component} from 'react'
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    AsyncStorage,
    Image,
    BackAndroid,
    DeviceEventEmitter,
    TouchableOpacity,
    TextInput,
    Switch,


} from 'react-native'
import NavBar from '../component/NavBar'
import set from '../config/config';
import request from '../lib/request';
import Icon from 'react-native-vector-icons/Ionicons'
import px2dp from '../util/index';
import Device from 'react-native-device-info';
import Toast from 'react-native-root-toast';
//FontAwesome
export default class ordersub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            nickname: '',
            device_token: '',
            userinfo: null,

        }
        this.handleBack = this._handleBack.bind(this);
    }

    componentDidMount() {
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

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#fafafa", position: 'relative'}}>
                <NavBar
                    title="确认订单"
                    leftIcon="ios-arrow-back"
                    leftPress={this._handleBack.bind(this)}
                />
                <ScrollView>
                    <View style={{
                        height: px2dp(30), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
                        paddingLeft: px2dp(10), backgroundColor: '#ffffff'
                    }}>
                        <Text>哼哼商城</Text>

                    </View>
                    <View style={{
                        flexDirection: 'row',
                        height: px2dp(120),
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: px2dp(10),
                        backgroundColor: "#ffffff", marginTop: px2dp(5), marginBottom: px2dp(5)
                    }}>
                        <View style={{flex: 2}}>
                            <Image
                                source={{uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'}}
                                style={{width: px2dp(90), height: px2dp(90)}}/>
                        </View>
                        <View style={{flex: 5}}>
                            <Text numberOfLines={2} style={{fontSize: px2dp(12), flex: 1}}>外星人准系统X991 桌面级CPU
                                I7 7700K
                                有钱人必备神器有钱人必备神器有钱人必备神器</Text>
                            <Text numberOfLines={2}
                                  style={{fontSize: px2dp(12), flex: 1, color: "#bcbcbc",}}>外星人准系统X991
                                桌面级CPU，I7 7700K
                                有钱人必备神器</Text>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{fontSize: px2dp(11), color: "#e83e41"}}>￥<Text
                                    style={{fontSize: px2dp(12)}}>599.00</Text></Text>
                                <Text style={{
                                    fontSize: px2dp(12),
                                    textDecorationLine: "line-through",
                                    color: "#bcbcbc",
                                    marginLeft: px2dp(5)
                                }}>￥2109.00</Text>
                                <Text style={{fontSize: px2dp(11), color: "#333333",}}>x<Text
                                    style={{fontSize: px2dp(12)}}>5</Text></Text>

                            </View>
                        </View>
                    </View>
                    <View style={{
                        height: px2dp(40),
                        backgroundColor: '#ffffff',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: px2dp(10),
                        paddingRight: px2dp(10),
                        marginBottom: px2dp(5)
                    }}>
                        <View style={{justifyContent: 'center', alignItems: 'flex-start', flex: 5}}>
                            <Text style={{marginRight: px2dp(5)}}>优惠劵</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            flex: 20,
                            justifyContent: 'flex-end',
                            overflow: "hidden",
                            alignItems: 'center',
                            marginRight: px2dp(10),

                        }}>
                            <Text numberOfLines={1} style={{color: "#cccccc", fontSize: px2dp(11)}}>共有3张可用，己选择1张</Text>


                        </View>
                        <View style={{flex: 6, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{marginRight: px2dp(3), color: '#bbbbbb', fontSize: px2dp(12)}}>105.00元</Text>
                            <Icon name="ios-arrow-forward" size={px2dp(24)} color="#cccccc"/>
                        </View>
                    </View>
                    <View style={{
                        height: px2dp(40),
                        backgroundColor: '#ffffff',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: px2dp(10),
                        paddingRight: px2dp(10),
                        marginBottom: px2dp(5)
                    }}>
                        <View style={{justifyContent: 'center', alignItems: 'flex-start', flex: 5}}>
                            <Text style={{marginRight: px2dp(5)}}>余额</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            flex: 20,
                            justifyContent: 'flex-end',
                            overflow: "hidden",
                            alignItems: 'center',
                            marginRight: px2dp(10),

                        }}>
                            <Text numberOfLines={1} style={{color: "#cccccc", fontSize: px2dp(12)}}>5000.00元</Text>


                        </View>
                        <View style={{flex: 4, alignItems: 'flex-end'}}>
                            <Switch


                            />
                        </View>
                    </View>
                    <View style={{
                        height: px2dp(40),
                        backgroundColor: '#ffffff',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: px2dp(10),
                        paddingRight: px2dp(10),
                        marginBottom: px2dp(5)
                    }}>
                        <View style={{justifyContent: 'center', alignItems: 'flex-start', flex: 5}}>
                            <Text style={{marginRight: px2dp(5)}}>支付方式</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            flex: 20,
                            justifyContent: 'flex-end',
                            overflow: "hidden",
                            alignItems: 'center',
                            marginRight: px2dp(10),

                        }}>
                            <Text numberOfLines={1} style={{color: "#cccccc", fontSize: px2dp(12)}}>支付宝</Text>


                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                            <Icon name="ios-arrow-forward" size={px2dp(24)} color="#cccccc"/>
                        </View>
                    </View>
                    <View style={{backgroundColor: '#ffffff', padding: px2dp(10)}}>
                        <Text>买家留言</Text>
                        <TextInput style={{
                            height: px2dp(100),
                            borderColor: '#cccccc',
                            borderWidth: 1,
                            marginTop: px2dp(10),
                            padding: 5
                        }} multiline={true}>


                        </TextInput>
                    </View>
                </ScrollView>
                <View style={{
                    height: px2dp(40),
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View style={{flex: 1,}}></View>
                    <View
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingRight: px2dp(5)}}><Text>合计：<Text
                        style={{fontSize: px2dp(11), color: '#e83e41'}}>￥</Text><Text
                        style={{color: "#e83e41"}}>2598.00</Text></Text></View>
                    <TouchableOpacity style={{
                        flex: 1,
                        height: px2dp(40),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e83e41',

                    }}><Text style={{color: "#ffffff"}}>提交订单</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({})
