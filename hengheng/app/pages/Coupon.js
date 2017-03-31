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
    Image,
    ScrollView
} from 'react-native'
import NavBar from '../component/NavBar'
import px2dp from '../util/index'
import set from '../config/config'
import TabViewBar from '../component/TabViewBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
export default class Coupon extends Component {
    constructor(props) {
        super(props)
        this.handleBack = this._handleBack.bind(this);
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

        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title='优惠劵'
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <ScrollableTabView renderTabBar={() => <TabViewBar/>}>
                    <ScrollView tabLabel="可使用">
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                    <ScrollView tabLabel="己使用">
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                    <ScrollView tabLabel="己过期">
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                marginTop: px2dp(10),
                                marginLeft: px2dp(10),
                                marginRight: px2dp(10),
                                backgroundColor: "#ffffff",
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1, backgroundColor:"#2c9c2c",justifyContent:'center',alignItems:'center'}}>
                                        <View style={{paddingTop:px2dp(5),paddingBottom:px2dp(5)}}>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>￥<Text style={{fontSize:px2dp(18),fontWeight:'bold'}}>100</Text></Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>指定商品</Text>
                                            <Text style={{fontSize:px2dp(11), color:"#ffffff"}}>绑定车牌</Text>
                                        </View>

                                    </View>
                                    <View style={{flex: 3,justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡代金劵</Text>
                                        <Text style={{color:"#bbbbbb",fontSize:px2dp(11),marginTop:px2dp(5)}}>2016年02月04日-2017年02月04日</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </ScrollableTabView>
            </View>
        )
    }
}
