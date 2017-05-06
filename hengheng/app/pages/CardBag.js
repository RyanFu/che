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
import CardList from '../component/CardList'
export default class CardBag extends Component {
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
                    title='卡包'
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <ScrollableTabView renderTabBar={() => <TabViewBar/>}>
                    <CardList tabLabel="服务" status={0} type={1}/>
                    <CardList tabLabel="商品" status={0} type={2}/>
                    <CardList tabLabel="己用完" status={1}/>
                    {/*  <ScrollView tabLabel="可使用">
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                margin: px2dp(10),
                                borderRadius: px2dp(10),
                                backgroundColor: "#ffffff",
                                padding: px2dp(10),
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1}}>
                                        <Image
                                            source={{uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'}}
                                            style={{width: px2dp(80), height: px2dp(80), borderRadius: px2dp(10)}}>

                                        </Image>

                                    </View>
                                    <View style={{flex: 2,}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡</Text>
                                        <Text style={{fontSize:px2dp(11),marginTop:px2dp(10),color:"#aaaaaa"}}>使用者：湘J74110</Text>
                                    </View>
                                </View>
                                <View style={{flex: 1,marginTop:px2dp(15),alignItems:'flex-start',justifyContent:"flex-start"}}>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>有效期：2016年02月04日-2017年02月04日</Text>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>总次数：1000次 己使用365次</Text>

                                </View>

                            </View>


                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                margin: px2dp(10),
                                borderRadius: px2dp(10),
                                backgroundColor: "#ffffff",
                                padding: px2dp(10),
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1}}>
                                        <Image
                                            source={{uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'}}
                                            style={{width: px2dp(80), height: px2dp(80), borderRadius: px2dp(10)}}>

                                        </Image>

                                    </View>
                                    <View style={{flex: 2,}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡</Text>
                                        <Text style={{fontSize:px2dp(11),marginTop:px2dp(10),color:"#aaaaaa"}}>使用者：湘J74110</Text>
                                    </View>
                                </View>
                                <View style={{flex: 1,marginTop:px2dp(15),alignItems:'flex-start',justifyContent:"flex-start"}}>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>有效期：2016年02月04日-2017年02月04日</Text>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>总次数：1000次 己使用365次</Text>

                                </View>

                            </View>


                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                margin: px2dp(10),
                                borderRadius: px2dp(10),
                                backgroundColor: "#ffffff",
                                padding: px2dp(10),
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1}}>
                                        <Image
                                            source={{uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'}}
                                            style={{width: px2dp(80), height: px2dp(80), borderRadius: px2dp(10)}}>

                                        </Image>

                                    </View>
                                    <View style={{flex: 2,}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡</Text>
                                        <Text style={{fontSize:px2dp(11),marginTop:px2dp(10),color:"#aaaaaa"}}>使用者：湘J74110</Text>
                                    </View>
                                </View>
                                <View style={{flex: 1,marginTop:px2dp(15),alignItems:'flex-start',justifyContent:"flex-start"}}>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>有效期：2016年02月04日-2017年02月04日</Text>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>总次数：1000次 己使用365次</Text>

                                </View>

                            </View>


                        </View>
                        <View>
                            <View style={{
                                justifyContent: 'space-between',
                                margin: px2dp(10),
                                borderRadius: px2dp(10),
                                backgroundColor: "#ffffff",
                                padding: px2dp(10),
                            }}>
                                <View style={{flex: 1, flexDirection: 'row',}}>
                                    <View style={{flex: 1}}>
                                        <Image
                                            source={{uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'}}
                                            style={{width: px2dp(80), height: px2dp(80), borderRadius: px2dp(10)}}>

                                        </Image>

                                    </View>
                                    <View style={{flex: 2,}}>
                                        <Text style={{fontSize:px2dp(16)}}>享享养车包年卡</Text>
                                        <Text style={{fontSize:px2dp(11),marginTop:px2dp(10),color:"#aaaaaa"}}>使用者：湘J74110</Text>
                                    </View>
                                </View>
                                <View style={{flex: 1,marginTop:px2dp(15),alignItems:'flex-start',justifyContent:"flex-start"}}>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>有效期：2016年02月04日-2017年02月04日</Text>
                                    <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>总次数：1000次 己使用365次</Text>

                                </View>

                            </View>


                        </View>

                    </ScrollView>  */}

                </ScrollableTabView>
            </View>
        )
    }
}
