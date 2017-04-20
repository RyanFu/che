/**
 * Created by liaopeng on 17/3/10.
 */
'use strict';

import React, {Component} from 'react'
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    ScrollView,
    Platform,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ListView,
    BackAndroid,
    PixelRatio,
    ActivityIndicator,
    AsyncStorage,
    InteractionManager,
    RefreshControl,
    Animated
} from 'react-native'
import px2dp from '../util/index'
import NavBar from '../component/NavBar'
import Icon from 'react-native-vector-icons/Ionicons'
import set from '../config/config'
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import orderSub from './ordersub'
import Device from 'react-native-device-info';
import login from './Login'
import request from '../lib/request';
let {width, height} = Dimensions.get('window')
let carlist = []
let sum = 0
let checknum = 0;
export default class cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            isRefreshing: false,
            allcheck: false,
            showlogin: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 != row2,
            }),
        }
    }
    emptycart() {
        AsyncStorage.removeItem("cartlist");
        this._onRefresh()
    }
    decreasenum(data) {
        if (data.num > 1) {
            carlist.map((item, i) => {
                if (item.id == data.id && item.attr.id == data.attr.id) {
                    carlist[i].num = carlist[i].num - 1;
                    carlist[i].total = carlist[i].num * carlist[i].price
                }
            })
            AsyncStorage.setItem("cartlist", JSON.stringify(carlist));
            this._fetchdata();

        }
    }
    componentDidMount() {

        InteractionManager.runAfterInteractions(this._onRefresh());
    }
    _onRefresh() {
        if (!this.state.isRefreshing) {
            this.setState({
                isRefreshing: true
            })
            this._fetchdata()

        }
    }
    _fetchdata() {
        carlist.splice(0, carlist.length);
        AsyncStorage.getItem("cartlist").then((data) => {
            var isall = true;
            if (data) {
                var temdata = JSON.parse(data);
                sum = 0;
                checknum = 0;
                for (var key in temdata) {
                    carlist.push(temdata[key]);
                    if (temdata[key].selected) {
                        sum += temdata[key].total
                        checknum++;
                    } else {
                        isall = false
                    }
                }
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(carlist.slice(0)),
                isRefreshing: false,
                allcheck: isall
            })

        }).catch((err) => {
            alert(err)
            this.setState({
                isRefreshing: false
            })
        });
    }
    addnum(data) {
        carlist.map((item, i) => {
            if (item.id == data.id && item.attr.id == data.attr.id) {
                carlist[i].num = carlist[i].num + 1;
                carlist[i].total = carlist[i].num * carlist[i].price
            }
        })
        AsyncStorage.setItem("cartlist", JSON.stringify(carlist));
        this._fetchdata();
    }
    delgoods(data) {
        var newlist = [];
        carlist.map((item, i) => {
            if (item.id != data.id && item.attr.id != data.attr.id) {
                newlist.push(item)
            }
        })
        carlist = newlist;
        AsyncStorage.setItem("cartlist", JSON.stringify(carlist));
        this._fetchdata();
    }
    checkgoods(data) {
        carlist.map((item, i) => {
            if (item.id == data.id && item.attr.id == data.attr.id) {
                carlist[i].selected = carlist[i].selected ? false : true
            }
        })
        AsyncStorage.setItem("cartlist", JSON.stringify(carlist));
        this._fetchdata();

    }
    checkall() {
        carlist.map((item, i) => {
            carlist[i].selected = !this.state.allcheck
        })
        AsyncStorage.setItem("cartlist", JSON.stringify(carlist));
        this._fetchdata();
    }

    ordersub() {
        AsyncStorage.getItem("token").then((userdata) => {
            if (userdata) {
                let token = userdata;
                var data = [];
                carlist.map((item, i) => {
                    if (item.selected) {
                        data.push(item)
                    }
                })
                //生成未付款订单
                var databody = {
                    list: JSON.stringify(data),
                    sum: sum,
                    num: checknum,
                    token: token,
                    device_token: Device.getUniqueID()
                }
                request.post(set.baseurl + set.mall.buildorder, databody).then((redata) => {
                    if (parseInt(redata.status) == 99) {
                        this.setState({
                            showlogin: true
                        })
                        setTimeout(() => {
                            this.setState({
                                showlogin: false
                            })
                            this.props.navigator.push({
                                component: login,

                            })

                        }, 800)
                    } else if (parseInt(redata.status) == 0) {
                        //删除购物车中己提交的商品
                        var newlist = [];
                        carlist.map((item, i) => {
                            if (!item.selected) {
                                newlist.push(item)
                            }
                        });
                        carlist = newlist;
                        AsyncStorage.setItem("cartlist", JSON.stringify(carlist));
                        this._fetchdata();
                        AsyncStorage.getItem("userinfo").then((userdata) => {
                            if(userdata) {
                                this.props.navigator.push({
                                    component: orderSub,
                                    args: {
                                        list: data,
                                        sum: databody.sum,
                                        num: databody.num,
                                        user: JSON.parse(userdata),
                                        order_id: redata.data.order_id,
                                        order_sn: redata.data.order_sn

                                    }
                                })
                            }else{
                                setTimeout(() => {
                                    this.setState({
                                        showlogin: false
                                    })
                                    this.props.navigator.push({
                                        component: login,

                                    })

                                }, 800)

                            }
                        })

                    } else {
                        //存在无法购买的商品，进行删除
                        alert(redata.message);


                    }
                })
            } else {
                this.setState({
                    showlogin: true
                })
                setTimeout(() => {
                    this.setState({
                        showlogin: false
                    })
                    this.props.navigator.push({
                        component: login,

                    })

                }, 800)
            }
        });
    }

    render() {
        let swipeoutBtns = [
            {
                text: 'Button'
            }
        ]
        return (
            <View style={styles.view}>
                <View style={styles.topbar}>
                    <View style={styles.btn}></View>
                    <Animated.Text numberOfLines={1} style={styles.title}>购物车</Animated.Text>
                    <TouchableOpacity style={styles.btn} onPress={this.emptycart.bind(this)}>
                        <Text style={{fontSize: 12, color: "#ffffff"}}>清空</Text>
                    </TouchableOpacity>
                </View>
                {carlist.length > 0 ? <SwipeListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ea3524"
                            colors={['#ddd', '#e83e41']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                    renderRow={ (data) => (
                        <SwipeRow
                            disableRightSwipe={true}
                            rightOpenValue={-60}
                            stopRightSwipe={-100}
                        >

                            <View style={styles.standaloneRowBack}>
                                <Text style={styles.backTextWhite} onPress={this.delgoods.bind(this, data)}>删除</Text>
                            </View>
                            <View style={styles.standaloneRowFront}>
                                <View style={{
                                    flexDirection: 'row',
                                    height: px2dp(120),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: px2dp(10),
                                    backgroundColor: "#fafafa"
                                }}>
                                    <TouchableWithoutFeedback onPress={this.checkgoods.bind(this, data)}>
                                        <View style={{
                                            height: px2dp(120), width: px2dp(30), justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <View style={{
                                                borderWidth: 1,
                                                borderColor: "#cccccc",
                                                borderRadius: px2dp(11),
                                                height: px2dp(22),
                                                width: px2dp(22),
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>

                                                {data.selected &&
                                                <Icon name={"ios-checkmark-circle"} size={px2dp(24)} color="#e83e41"/>}


                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>

                                    <View style={{width: px2dp(100), padding: px2dp(5)}}>
                                        <Image
                                            source={{uri: set.baseurl + 'data/upload/' + data.goods.thumb}}
                                            style={{width: px2dp(90), height: px2dp(90)}}/>
                                    </View>
                                    <View style={{flex: 6}}>
                                        <Text numberOfLines={2} style={{
                                            fontSize: px2dp(12),
                                            flex: 1
                                        }}>【{data.goods.class_name}】{data.goods.name} {data.attr.f_name}</Text>
                                        <Text numberOfLines={2}
                                              style={{
                                                  fontSize: px2dp(12),
                                                  flex: 1,
                                                  color: "#bcbcbc",
                                              }}>{data.goods.title}
                                        </Text>
                                        <View style={{
                                            flexDirection: 'row', flex: 1, alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{fontSize: px2dp(11), color: "#e83e41"}}>￥<Text
                                                style={{fontSize: px2dp(12)}}>{data.price}</Text></Text>
                                            <Text style={{
                                                fontSize: px2dp(12),
                                                color: "#bcbcbc",
                                                marginLeft: px2dp(5)
                                            }}>￥{data.total}</Text>
                                            <View
                                                style={{width: px2dp(80), flexDirection: 'row', marginLeft: px2dp(5)}}>
                                                <TouchableOpacity style={{
                                                    flex: 1,
                                                    borderWidth: 1,
                                                    borderColor: "#cccccc",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }} onPress={this.decreasenum.bind(this, data)}>
                                                    <Text style={{
                                                        fontSize: px2dp(16),
                                                    }}>
                                                        -
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={{
                                                    flex: 1,
                                                    borderTopWidth: 1,
                                                    height: px2dp(23),
                                                    width: px2dp(25),
                                                    borderColor: "#cccccc",
                                                    justifyContent: 'center',
                                                    alignItems: "center",
                                                    borderBottomWidth: 1
                                                }}>
                                                    <Text style={{
                                                        fontSize: px2dp(14),
                                                        color: '#333333'
                                                    }}>
                                                        {data.num}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity style={{
                                                    flex: 1,
                                                    borderWidth: 1,
                                                    height: px2dp(23),
                                                    width: px2dp(25),
                                                    borderColor: "#cccccc",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }} onPress={this.addnum.bind(this, data)}>
                                                    <Text style={{
                                                        fontSize: px2dp(16),
                                                    }}>
                                                        +
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </SwipeRow>
                    )}
                /> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>购物车里啥都没有</Text><Text
                    style={{
                        paddingHorizontal: px2dp(15), borderWidth: 1, borderColor: "#ea3524", color: "#ea3524",
                        paddingVertical: px2dp(3), borderRadius: 5, margin: px2dp(10)
                    }} onPress={this._onRefresh.bind(this)}>刷新</Text></View>}


                <View style={{
                    position: "absolute",
                    bottom: px2dp(45),
                    left: 0,
                    right: 0,
                    height: px2dp(40),
                    backgroundColor: "#f0f0f0",
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{flexDirection: "row", alignItems: 'center', flex: 1}}>
                        <TouchableWithoutFeedback onPress={this.checkall.bind(this)}>
                            <View style={{
                                height: px2dp(40), width: px2dp(30), justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    borderWidth: 1,
                                    borderColor: "#cccccc",
                                    borderRadius: px2dp(11),
                                    height: px2dp(22),
                                    width: px2dp(22),
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>

                                    {this.state.allcheck &&
                                    <Icon name={"ios-checkmark-circle"} size={px2dp(24)} color="#e83e41"/>}


                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <Text>全选</Text>
                    </View>
                    <View style={{flexDirection: "row", flex: 2, alignItems: 'center', justifyContent: 'flex-start'}}>

                        <Text style={{fontSize: px2dp(12)}}>合计：</Text>
                        <Text style={{fontSize: px2dp(11), color: "#e83e41"}}>￥<Text
                            style={{fontSize: px2dp(14)}}>{sum}</Text></Text>
                    </View>
                    {checknum == 0 ?
                        <View style={{
                            flex: 1,
                            backgroundColor: "#cccccc",
                            height: px2dp(40),
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>
                            <Text style={{color: '#ffffff'}}>结算（{checknum}）</Text>
                        </View> : <TouchableOpacity onPress={this.ordersub.bind(this)} style={{
                            flex: 1,
                            backgroundColor: "#e83e41",
                            height: px2dp(40),
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>
                            <Text style={{color: '#ffffff'}}>结算（{checknum}）</Text>
                        </TouchableOpacity>}

                </View>
                {this.state.showlogin &&

                <View style={{
                    position: "absolute",
                    top: height / 2 - px2dp(50),
                    left: width / 2 - px2dp(50),
                    justifyContent: 'center',
                    alignItems: "center", height: px2dp(100), width: px2dp(100), borderRadius: px2dp(10),
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                    <View style={{flex: 2, justifyContent: "center", alignItems: "center"}}>
                        <Icon name="ios-close-circle-outline" size={px2dp(50)} color="#ea3524"/>
                    </View>
                    <Text style={{color: "#ffffff", flex: 1, fontSize: px2dp(12)}}>请登陆</Text>
                </View>

                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    backTextWhite: {
        height: px2dp(120),
        lineHeight: px2dp(120),
        width: px2dp(60),
        marginRight: 0,
        textAlign: "center",
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        height: 120,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',


    },
    view: {
        flex: 1,
        backgroundColor: '#ffffff',
        position: "relative"
    },
    topbar: {
        height: NavBar.topbarHeight,
        backgroundColor: "#e83e41",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        paddingHorizontal: px2dp(10)
    },
    btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: px2dp(14),
        marginLeft: px2dp(5),
    }

});