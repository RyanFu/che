/**
 * @author LiaoPeng
 *
 */
'use strict';
import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
    AlertIOS,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    RefreshControl,
    AsyncStorage,
    DeviceEventEmitter,

} from 'react-native'
import LocalImg from '../images'
import NavBar from '../component/NavBar'
import Item from '../component/Item'
import Setting from './Setting'
import UserProfile from './UserProfile'
import Carlist from './Carlist'
import px2dp from '../util/index'
import Icon from 'react-native-vector-icons/Ionicons'
import Login from './Login'
import request from '../lib/request';
import set from '../config/config';
import Device from 'react-native-device-info';
import Sendmsg from './SendMsg'
import Order from './Order'
import Account from './Account'
import Coupon from './Coupon'
import CardBag from './CardBag'
let {width, height} = Dimensions.get('window')
export default class My extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRefreshing: false,
            isLogin: false,
            token: null,
            photo:set.baseurl+set.interface.default_photo,
            name:"请登陆",
            mobile:"",
            money:0,
        }
        this.config = [
            {icon: "md-images", name: "我的爱车", onPress: this.goPage.bind(this, "carlist")},
            {icon: "logo-usd", name: "推荐有奖", subName: "5元现金", color: "#fc7b53"},
            {icon: "ios-cart", name: "保养年卡", subName: "仅需388元起", color: "#94d94a"},
            {icon: "md-flower", name: "客服帮助"},
            {icon: "md-contacts", name: "加盟合作"},
        ]
    }

    goPage(key, data = {}) {
        let pages = {
            "carlist": Carlist
        }
        if (pages[key]) {
            let jump = {};
            this.state.isLogin ? jump = pages[key] : jump = Login;

            this.props.navigator.push({
                component: jump,
                args: {data}
            })
        }
    }
    leftPress() {
        this.props.navigator.push({
            component:Sendmsg,
            args:{
                type:'regster'
            }
        })
    }

    rightPress() {
        let jump = {};
        this.state.isLogin ? jump = Setting : jump = Login;

        this.props.navigator.push({
            component: jump,
            args: {}
        });


    }

    goProfile() {
        let jump = {};
        this.state.isLogin ? jump = UserProfile : jump = Login;
        this.props.navigator.push({
            component: jump,
            args: {}
        });
    }

    componentDidMount() {
        this._onRefresh();
        this.subscription = DeviceEventEmitter.addListener('changeAvatar',(data)=>{
            this._onRefresh();
        });
        this.changenickname = DeviceEventEmitter.addListener('changenickname',(data)=>{
            this._onRefresh();
        });
        this.login = DeviceEventEmitter.addListener('login',(data)=>{
            this._onRefresh();
        });
        this.outlogin = DeviceEventEmitter.addListener('outlogin',(data)=>{
            this._onRefresh();
        });


    }
    jumporder(args)
    {
        this.props.navigator.push({
            component:Order,
            args:{
                type:args
            },
            type:'bottom'
        })

    }

    componentWillUnmount(){
        this.subscription.remove();
        this.changenickname.remove();
        this.login.remove();
        this.outlogin.remove();
    };
    _onRefresh() {
        AsyncStorage.getItem("token")
            .then((data) => {
                if (data) {
                    let token=data;
                    let databody={
                        token:token,
                        device_token:Device.getUniqueID()
                    }
                    request.post(set.baseurl+set.interface.userinfo,databody).then((data)=>{
                        if(parseInt(data.status)==0)
                        {
                            this.setState({
                                isRefreshing: false,
                                isLogin:true,
                                token:token,
                                name:data.data.name,
                                mobile:data.data.mobile,
                                photo:set.baseurl+data.data.photo,
                                money:data.data.money,
                            });

                            AsyncStorage.setItem("userinfo",JSON.stringify(data.data));
                        }else{
                            this.setState({isRefreshing: false});
                        }
                    })

                }else{
                    this.setState({
                        isRefreshing: false,
                        isLogin: false,
                        token: null,
                        photo:set.baseurl+set.interface.default_photo,
                        name:"请登陆",
                        mobile:"",
                    });
                }

            })
            .catch((error) => {
                this.setState({isRefreshing: false});
            });



    }

    _renderListItem() {
        return this.config.map((item, i) => {
            if (i % 3 == 0) {
                item.first = true
            }
            return (<Item key={i} {...item}/>)
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="用户中心"
                    leftIcon="md-person-add"
                    leftPress={this.leftPress.bind(this)}
                    rightIcon="ios-settings-outline"
                    rightPress={this.rightPress.bind(this)}
                />
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#fff"
                            colors={['#ddd', '#e83e41']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    <View style={{minHeight: height - 64 - px2dp(46), paddingBottom: 100, backgroundColor: "#f3f3f3"}}>
                        <TouchableWithoutFeedback onPress={this.goProfile.bind(this)}>
                            <View style={styles.userHead}>
                                <View style={{flex: 1, flexDirection: "row"}}>
                                    <Image source={{uri:this.state.photo}}
                                           style={{width: px2dp(60), height: px2dp(60), borderRadius: px2dp(30)}}/>
                                    {this.state.isLogin?<View style={{flex: 1, marginLeft: 10, paddingVertical: 5}}>
                                        <Text style={{color: "#fff", fontSize: px2dp(18)}}>{this.state.name}</Text>
                                        <View style={{marginTop: px2dp(10), flexDirection: "row"}}>
                                            <Icon name="ios-phone-portrait-outline" size={px2dp(14)} color="#fff"/>
                                            <Text
                                                style={{color: "#fff", fontSize: 13, paddingLeft: 5}}>{this.state.mobile}</Text>
                                        </View></View>:
                                            <View style={{flex: 1, marginLeft: 10, paddingVertical: 5}}>
                                                <Text style={{color: "#fff", fontSize: px2dp(18)}}>{this.state.name}</Text>
                                                <View style={{marginTop: px2dp(10), flexDirection: "row"}}>
                                                    <Icon name="ios-phone-portrait-outline" size={px2dp(14)} color="#fff"/>
                                                    <Text
                                                        style={{color: "#fff", fontSize: 13, paddingLeft: 5}}>{this.state.mobile}</Text>
                                                </View></View>

                                            }

                                </View>
                                <Icon name="ios-arrow-forward-outline" size={px2dp(22)} color="#fff"/>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.numbers}>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.props.navigator.push({
                                    component:Account

                                })
                            }}>
                                <View style={styles.numItem}>
                                    <Text style={{
                                        color: "#f90",
                                        fontSize: 18,
                                        textAlign: "center",
                                        fontWeight: "bold"
                                    }}>{this.state.money}</Text>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"余额"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.props.navigator.push({
                                    component:CardBag

                                })
                            }}>
                                <View style={[styles.numItem, {
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#f5f5f5",
                                    borderRightWidth: 1,
                                    borderRightColor: "#f5f5f5"
                                }]}>
                                    <Text style={{
                                        color: "#ff5f3e",
                                        fontSize: 18,
                                        textAlign: "center",
                                        fontWeight: "bold"
                                    }}>{"0"}</Text>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"卡包"}</Text>
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={()=>{
                                this.props.navigator.push({
                                    component:Coupon

                                })
                            }}>
                             <View style={styles.numItem}>
                                    <Text style={{
                                        color: "#6ac20b",
                                        fontSize: 18,
                                        textAlign: "center",
                                        fontWeight: "bold"
                                    }}>{"0"}</Text>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"优惠劵"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <View style={{height:px2dp(30),paddingLeft:px2dp(15),marginTop:px2dp(10),backgroundColor:"#ffffff"}}>
                            <View style={{flexDirection:'row',flex:1,justifyContent:'space-between', alignItems:'center',borderBottomWidth:1,borderBottomColor:'#eeeeee'}}>
                                <Text style={{fontSize:px2dp(11)}}>
                                    我的订单
                                </Text>
                                <TouchableWithoutFeedback onPress={()=>{this.jumporder("finished")}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                                    <Text style={{marginRight:px2dp(5),fontSize:px2dp(11),color:"#aaaaaa"}}>全部订单</Text>
                                    <Icon name="ios-arrow-forward-outline" size={px2dp(18)} color="#bbbbbb" style={{marginRight:px2dp(10)}}/>
                                </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={styles.orders}>
                            <TouchableWithoutFeedback onPress={()=>{this.jumporder("finished")}}>
                                <View style={styles.numItem}>
                                    <Icon name="ios-basket-outline" size={px2dp(18)}/>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"待付款"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.jumporder("finished")}}>
                                <View style={[styles.numItem, {
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#f5f5f5",
                                    borderRightWidth: 1,
                                    borderRightColor: "#f5f5f5"
                                }]}>
                                    <Icon name="ios-mail-open-outline" size={px2dp(18)}/>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"待收货"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.jumporder("finished")}}>
                                <View style={[styles.numItem, {
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#f5f5f5",
                                    borderRightWidth: 1,
                                    borderRightColor: "#f5f5f5"
                                }]}>
                                    <Icon name="ios-car-outline" size={px2dp(18)}/>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"待使用"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.jumporder("finished")}}>
                                <View style={[styles.numItem, {
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#f5f5f5",
                                    borderRightWidth: 1,
                                    borderRightColor: "#f5f5f5"
                                }]}>
                                    <Icon name="ios-text-outline" size={px2dp(18)}/>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"待评价"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.jumporder("finished")}}>
                                <View style={[styles.numItem, {
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#f5f5f5",
                                    borderRightWidth: 1,
                                    borderRightColor: "#f5f5f5"
                                }]}>
                                    <Icon name="ios-albums-outline" size={px2dp(18)}/>
                                    <Text style={{
                                        color: "#333",
                                        fontSize: 12,
                                        textAlign: "center",
                                        paddingTop: 5
                                    }}>{"己完成"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View>
                            {this._renderListItem()}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    scrollView: {
        marginBottom: px2dp(46),
        backgroundColor: "#e83e41"
    },
    userHead: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#e83e41"
    },
    numbers: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 55
    },
    orders: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 55,
    },
    numItem: {
        flex: 1,
        height: 55,
        justifyContent: "center",
        alignItems: "center"
    }
})
