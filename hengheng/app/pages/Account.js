/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, {Component} from 'react'
import {
    Text,
    View,
    BackAndroid,
    ScrollView,
    InteractionManager,
    RefreshControl,
    Image
} from 'react-native'
import NavBar from '../component/NavBar'
import set from '../config/config'
import px2dp from '../util/index'
import request from '../lib/request'
export default class Order extends Component {
    constructor(props) {
        super(props)
        this.handleBack = this._handleBack.bind(this);
        this.state={
            isRefreshing:false,
        }
    }

    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            this._onRefresh();
        })
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }
    _onRefresh()
    {
        if(!this.state.isRefreshing)
        {
            this.setState({
                isRefreshing:true
            })
        }

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title='账单'
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ea3524"
                            colors={['#ddd', '#e83e41']}
                            progressBackgroundColor="#ffffff"
                        />}
                >
                    <View style={{paddingLeft: px2dp(5)}}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eeeeee',
                            paddingBottom: px2dp(10),
                            paddingTop: px2dp(10)
                        }}>
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(12), textAlign: 'center', color:"#aaaaaa"}}>
                                    2016-03-13 04:37
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderRadius:px2dp(15),height:px2dp(30),width:px2dp(30), backgroundColor:"#e83e41",justifyContent:'center',alignItems:"center"}}>
                                    <Text style={{fontSize:px2dp(16), color:"#ffffff",fontWeight:"bold"}}>购</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 6,
                                justifyContent: 'center',
                                paddingLeft: px2dp(8),
                                paddingRight: px2dp(5)
                            }}>
                                <Text style={{fontSize: px2dp(12),marginBottom:px2dp(5)}}>-139.00</Text>
                                <Text style={{fontSize: px2dp(11), color:"#5f5f5f"}}>洗车服务卡年包洗车服务卡年包洗车服务卡年包洗车服务卡年包</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingLeft: px2dp(5)}}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eeeeee',
                            paddingBottom: px2dp(10),
                            paddingTop: px2dp(10)
                        }}>
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(12), textAlign: 'center', color:"#aaaaaa"}}>
                                    2016-03-13 04:37
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderRadius:px2dp(15),height:px2dp(30),width:px2dp(30), backgroundColor:"#e83e41",justifyContent:'center',alignItems:"center"}}>
                                    <Text style={{fontSize:px2dp(16), color:"#ffffff",fontWeight:"bold"}}>享</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 6,
                                justifyContent: 'center',
                                paddingLeft: px2dp(8),
                                paddingRight: px2dp(5)
                            }}>
                                <Text style={{fontSize: px2dp(12),marginBottom:px2dp(5)}}>+1.00</Text>
                                <Text style={{fontSize: px2dp(11), color:"#5f5f5f"}}>推荐某某消费</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingLeft: px2dp(5)}}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eeeeee',
                            paddingBottom: px2dp(10),
                            paddingTop: px2dp(10)
                        }}>
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(12), textAlign: 'center', color:"#aaaaaa"}}>
                                    2016-03-13 04:37
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderRadius:px2dp(15),height:px2dp(30),width:px2dp(30), backgroundColor:"#e83e41",justifyContent:'center',alignItems:"center"}}>
                                    <Text style={{fontSize:px2dp(16), color:"#ffffff",fontWeight:"bold"}}>购</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 6,
                                justifyContent: 'center',
                                paddingLeft: px2dp(8),
                                paddingRight: px2dp(5)
                            }}>
                                <Text style={{fontSize: px2dp(12),marginBottom:px2dp(5)}}>-139.00</Text>
                                <Text style={{fontSize: px2dp(11), color:"#5f5f5f"}}>洗车服务卡年包洗车服务卡年包洗车服务卡年包洗车服务卡年包</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingLeft: px2dp(5)}}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eeeeee',
                            paddingBottom: px2dp(10),
                            paddingTop: px2dp(10)
                        }}>
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(12), textAlign: 'center', color:"#aaaaaa"}}>
                                    2016-03-13 04:37
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderRadius:px2dp(15),height:px2dp(30),width:px2dp(30), backgroundColor:"#e83e41",justifyContent:'center',alignItems:"center"}}>
                                    <Text style={{fontSize:px2dp(16), color:"#ffffff",fontWeight:"bold"}}>购</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 6,
                                justifyContent: 'center',
                                paddingLeft: px2dp(8),
                                paddingRight: px2dp(5)
                            }}>
                                <Text style={{fontSize: px2dp(12),marginBottom:px2dp(5)}}>-139.00</Text>
                                <Text style={{fontSize: px2dp(11), color:"#5f5f5f"}}>洗车服务卡年包洗车服务卡年包洗车服务卡年包洗车服务卡年包</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingLeft: px2dp(5)}}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eeeeee',
                            paddingBottom: px2dp(10),
                            paddingTop: px2dp(10)
                        }}>
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(12), textAlign: 'center', color:"#aaaaaa"}}>
                                    2016-03-13 04:37
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderRadius:px2dp(15),height:px2dp(30),width:px2dp(30), backgroundColor:"#e83e41",justifyContent:'center',alignItems:"center"}}>
                                    <Text style={{fontSize:px2dp(16), color:"#ffffff",fontWeight:"bold"}}>购</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 6,
                                justifyContent: 'center',
                                paddingLeft: px2dp(8),
                                paddingRight: px2dp(5)
                            }}>
                                <Text style={{fontSize: px2dp(12),marginBottom:px2dp(5)}}>-139.00</Text>
                                <Text style={{fontSize: px2dp(11), color:"#5f5f5f"}}>洗车服务卡年包洗车服务卡年包洗车服务卡年包洗车服务卡年包</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingLeft: px2dp(5)}}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eeeeee',
                            paddingBottom: px2dp(10),
                            paddingTop: px2dp(10)
                        }}>
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(12), textAlign: 'center', color:"#aaaaaa"}}>
                                    2016-03-13 04:37
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderRadius:px2dp(15),height:px2dp(30),width:px2dp(30), backgroundColor:"#e83e41",justifyContent:'center',alignItems:"center"}}>
                                    <Text style={{fontSize:px2dp(16), color:"#ffffff",fontWeight:"bold"}}>购</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 6,
                                justifyContent: 'center',
                                paddingLeft: px2dp(8),
                                paddingRight: px2dp(5)
                            }}>
                                <Text style={{fontSize: px2dp(12),marginBottom:px2dp(5)}}>-139.00</Text>
                                <Text style={{fontSize: px2dp(11), color:"#5f5f5f"}}>洗车服务卡年包洗车服务卡年包洗车服务卡年包洗车服务卡年包</Text>
                            </View>
                        </View>
                    </View>


                </ScrollView>

            </View>
        )
    }
}
