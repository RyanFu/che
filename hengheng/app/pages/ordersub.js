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
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    AsyncStorage,
    Image,
    BackAndroid,
    DeviceEventEmitter,
    TouchableOpacity,
    InteractionManager,
    TextInput,
    Switch,
    RefreshControl

} from 'react-native'
import NavBar from '../component/NavBar'
import set from '../config/config';
import request from '../lib/request';
import Icon from 'react-native-vector-icons/Ionicons'
import px2dp from '../util/index';
import success from './success';
import Device from 'react-native-device-info';
import Toast from 'react-native-root-toast';
import OrderCoupon from './OrderCoupon'
import Modal from 'react-native-modalbox';

//FontAwesome
export default class ordersub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            nickname: '',
            device_token: '',
            userinfo: null,
            usemoney: true,
            isRefreshing: false,
            coupon_length: 0,
            coupon_choose: 0,
            coupon_total: 0.00,
            paymenu: [],
            showmask: false,
            coupon: [],
            goods: [],
            total: this.props.sum,
            sheng:0,
            usermoneysum:0,
            pay:0,
        }
        this.handleBack = this._handleBack.bind(this);
    }
    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {
        //    alert(this.props.sum)
            this._onRefresh();
            this.props.list.map((itme, i) => {
                this.props.list[i].choosenum = 0;
                this.props.list[i].choosetotal = 0;
                this.props.list[i].sum = this.props.list[i].total;
                this.props.list[i].sumcoupon=0;
                this.props.list[i].couponlist=[];
            })
            this.setState({
                goods: this.props.list,
                usermoneysum:this.props.user.money>this.props.sum?this.props.sum:this.props.user.money,
                pay:this.props.sum-(this.props.user.money>this.props.sum?this.props.sum:this.props.user.money)
            })
        })
        this.choosecoupon = DeviceEventEmitter.addListener('choosecoupon', (data) => {

            this.state.goods.map((item, i) => {

                if (item.id == data.id && item.attr.id == data.attr_id) {

                    this.state.goods[i].choosenum = data.num;
                     this.state.goods[i].choosetotal = data.total;
                    var sum=this.state.goods[i].total-data.total;
                    this.state.goods[i].sum=sum>0?sum:0,
                        this.state.goods[i].sumcoupon=sum>0?data.total:this.state.goods[i].total
                    this.state.goods[i].couponlist=data.couponlist


                }

            })
            var sumcoupon=0;
            this.state.goods.map((item, i) => {
                sumcoupon+=item.sumcoupon;
            })
            var usesum=0
            if(this.state.usemoney)
            {
                usesum=this.props.user.money>(this.state.total-sumcoupon)?this.state.total-sumcoupon:this.props.user.money

            }
            this.setState({
                coupon: data.list,
                goods: this.state.goods,
                coupon_total:sumcoupon,
                sheng:this.state.total-sumcoupon,
                usermoneysum:usesum,
                pay:this.state.total-sumcoupon-usesum

            })
        });
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }
    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
        this.choosecoupon.remove();
    }
    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }
    selectcoupon(id, att) {
        this.props.navigator.push({
            component: OrderCoupon,
            args: {
                token: this.state.token,
                device_token: this.state.device_token,
                goods: this.props.list,
                coupon: this.state.coupon,
                goods_id: id,
                attr_id: att,
            }
        })
    }
    _rendergoods() {
        var data = [];
        this.state.goods.map((item, i) => {
            data.push(<View key={i} style={{
                    flexDirection: 'row',
                    height: px2dp(120),
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: px2dp(10),
                    backgroundColor: "#ffffff", marginTop: px2dp(5), marginBottom: px2dp(5)
                }}>
                    <View style={{flex: 2}}>
                        <Image
                            source={{uri: set.baseurl + 'data/upload/' + item.goods.thumb}}
                            style={{width: px2dp(90), height: px2dp(90)}}/>
                    </View>
                    <View style={{flex: 5}}>
                        <Text numberOfLines={2} style={{
                            fontSize: px2dp(12),
                            flex: 1
                        }}>【{item.goods.class_name}】{item.goods.name} {item.attr.f_name}</Text>
                        <Text numberOfLines={2}
                              style={{fontSize: px2dp(12), flex: 1, color: "#bcbcbc",}}>{item.goods.title}</Text>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{fontSize: px2dp(11), color: "#e83e41"}}>￥<Text
                                style={{fontSize: px2dp(12)}}>{item.price}</Text></Text>
                            <Text style={{
                                fontSize: px2dp(12),
                                color: "#bcbcbc",
                                marginLeft: px2dp(5)
                            }}>￥{item.total}</Text>
                            <Text style={{fontSize: px2dp(11), color: "#333333",}}>x<Text
                                style={{fontSize: px2dp(12)}}>{item.num}</Text></Text>

                        </View>
                        <TouchableOpacity onPress={this.selectcoupon.bind(this, item.id, item.attr.id)} style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingVertical: px2dp(5)
                        }}>
                            <Text style={{fontSize: px2dp(11)}}>- 己选择{item.choosenum}张 共{item.choosetotal}元优惠劵 ></Text>

                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}>
                            <Text>
                                小计：
                            </Text>
                            <Text style={{
                                fontSize: px2dp(12),
                                color: "#ea3524",
                                marginLeft: px2dp(5),
                                fontWeight: "bold"
                            }}>￥{item.sum}</Text>

                        </View>

                    </View>
                </View>
            )
        })
        return data
    }
    selectpay() {
        this.refs.modal.open();
    }
    closebtn() {
        this.refs.modal.close();
    }
    _fetchdata() {
        AsyncStorage.getItem("token")
            .then((data) => {
                if (data) {
                    let token = JSON.parse(data);
                    let databody = {
                        token: token.token,
                        device_token: Device.getUniqueID(),
                        goods: JSON.stringify(this.props.list),
                    }
                    this.setState({
                        token: databody.token,
                        device_token: databody.device_token
                    })

                    //获取支付方式,获取优惠卷,获取余额

                    request.post(set.baseurl + set.mall.getordersubinfo, databody).then((redata) => {
                        var payment = [];
                        if (parseInt(redata.status) == 0) {
                            for (var key in redata.data.pay) {
                                payment.push(redata.data.pay[key])
                            }
                            this.setState({
                                paymenu: payment,
                                coupon_length: redata.data.coupon_length,
                                coupon_choose: 0,
                                coupon_total: 0.00,
                                coupon: redata.data.coupon
                            })
                        }
                        this.setState({
                            isRefreshing: false
                        })

                    })

                } else {
                    this.setState({
                        isRefreshing: false
                    })

                }

            })
            .catch((error) => {
                this.setState({
                    isRefreshing: false
                })
            });


    }
    _onRefresh() {
        if (!this.state.isRefreshing) {
            this.setState({
                isRefreshing: true
            })
            this._fetchdata();

        }
    }

    suborder() {
        this.setState({
            showmask: true,
        })

        let databody = {
            goods: JSON.stringify(this.props.list),
            coupon: JSON.stringify(this.state.coupon),
            balance: this.state.usermoneysum,
            token: this.state.token,
            pay:this.state.pay,
            device_token: this.state.device_token,
            order_id:this.props.order_id,
            order_sn:this.props.order_sn
        }
        request.post(set.baseurl + set.mall.checkorder, databody).then((data) => {
                if(parseInt(data.status)==0)
                {
                    this.props.navigator.push({
                        component:success
                    })
                }else{
                    alert(data.message)
                }



            this.setState({
                showmask: false
            })
        }).catch((err) => {
            alert("网络错误");
            this.setState({
                showmask: false
            })
        })


    }

    renderpay() {
        var temp = [];
        this.state.paymenu.map((item, i) => {
            temp.push(<TouchableOpacity key={i} onPress={() => {
                alert("a")
            }} style={{justifyContent: "center", alignItems: "center", margin: px2dp(5)}}>
                <Image source={{uri: item.thumb}} style={{width: px2dp(50), height: px2dp(50)}}/>
                <Text>{item.pay_name}</Text>
            </TouchableOpacity>)
        })
        return temp

    }
    setmoney(value)
    {
        var usesum=0;
        var pay=0;
        if(value)
        {
            usesum=this.props.user.money>this.state.sheng?this.state.sheng:this.props.user.money;

        }
        this.setState({
            usemoney:value,
            usermoneysum:usesum,
            sheng:this.state.total-this.state.coupon_total,
            pay:this.state.total-this.state.coupon_total-usesum

        })

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#fafafa", position: 'relative'}}>
                <NavBar
                    title="确认付款"
                    leftIcon="ios-arrow-back"
                    leftPress={this._handleBack.bind(this)}
                />
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        tintColor="#ea3524"
                        colors={['#ddd', '#e83e41']}
                        progressBackgroundColor="#ffffff"
                    />}>
                    <View style={{
                        height: px2dp(30), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
                        paddingLeft: px2dp(10), backgroundColor: '#ffffff'
                    }}>
                        <Text>商品列表({this.props.num})</Text>

                    </View>
                    <ScrollView style={{height: px2dp(240)}}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                    >
                        {this._rendergoods()}

                    </ScrollView>
                    <View>
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
                                <Text numberOfLines={1}
                                      style={{color: "#cccccc", fontSize: px2dp(11)}}>己优惠{this.state.coupon_total}元</Text>


                            </View>
                            <View
                                style={{flex: 6, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{
                                    marginRight: px2dp(3),
                                    color: '#bbbbbb',
                                    fontSize: px2dp(12)
                                }}> </Text>
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
                            <Text numberOfLines={1}
                                  style={{color: "#cccccc", fontSize: px2dp(12)}}>{this.props.user.money}元  支付{this.state.usermoneysum}元 </Text>


                        </View>
                        <View style={{flex: 4, alignItems: 'flex-end'}}>
                            <Switch
                                onValueChange={(value)=>this.setmoney(value)}
                                value={this.state.usemoney}/>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.selectpay.bind(this)}>
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
                                <Text numberOfLines={1} style={{color: "#cccccc", fontSize: px2dp(12)}}>支付{this.state.pay}元  </Text>
                                <Text numberOfLines={1} style={{color: "#cccccc", fontSize: px2dp(12)}}>支付宝</Text>


                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Icon name="ios-arrow-forward" size={px2dp(24)} color="#cccccc"/>
                            </View>
                        </View>
                    </TouchableOpacity>
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
                        style={{color: "#e83e41"}}>{this.props.sum}</Text></Text></View>
                    <TouchableOpacity onPress={this.suborder.bind(this)} style={{
                        flex: 1,
                        height: px2dp(40),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e83e41',

                    }}><Text style={{color: "#ffffff"}}>支付订单</Text>
                    </TouchableOpacity>
                </View>
                <Modal style={styles.modal} position={"bottom"} backdropOpacity={0.8} ref={"modal"} swipeToClose={false}
                       onbackClose={this.closebtn.bind(this)}>
                    <ScrollView contentContainerStyle={{
                        flexDirection: 'row',
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                        padding: px2dp(10)
                    }}
                                showsHorizontalScrollIndicator={false}
                                initialListSize={40}
                                horizontal={true}>
                        {this.renderpay()}


                    </ScrollView>
                </Modal>
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
                        <ActivityIndicator style={{flex: 2}} color="#ea3524"/>
                        <Text style={{color: "#ffffff", flex: 1, fontSize: px2dp(12)}}>正在提交...</Text>
                    </View>
                </View>
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    modal: {
        height: px2dp(100),
        position: 'relative',
        backgroundColor: "#ffffff"

    },
})
