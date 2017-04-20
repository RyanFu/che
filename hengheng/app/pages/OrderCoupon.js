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
    InteractionManager,
    AsyncStorage,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    ScrollView
} from 'react-native'
import NavBar from '../component/NavBar'
import px2dp from '../util/index'
import set from '../config/config'
import request from '../lib/request';

import Icon from 'react-native-vector-icons/Ionicons'
import TabViewBar from '../component/TabViewBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
export default class OrderCoupon extends Component {
    constructor(props) {
        super(props);
        this.state={
            isRefreshing:false,
            datasource:{}
        }
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

        InteractionManager.runAfterInteractions(()=>{

            this.setState({
                datasource:this.props.coupon,
            });

        });

        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }
    _onRefresh()
    {

        if(!this.state.isRefreshing)
        {
            this.setState({
                isRefreshing:true
            })
            this._fetchdata()





        }
    }
    _fetchdata()
    {
        var databody={
            token:this.props.token,
            device_token:this.props.device_token,
            goods:JSON.stringify(this.props.goods)
        }
        request.post(set.baseurl+set.mall.usercoupon,databody).then((data)=>{
                if(parseInt(data.status)==0)
                {
                    this.setState({
                       datasource:data.data.list,
                    });


                }
            this.setState({
                isRefreshing:false
            })




        }).catch((err)=>{
            alert("网络错误");
            this.setState({
                isRefreshing:false
            })
        })
    }
    onselect(i)
    {
        var temparr=this.state.datasource;
        temparr[i].select_id=this.state.datasource[i].select?-1:this.props.goods_id;
        temparr[i].select_attr=this.state.datasource[i].select?-1:this.props.attr_id
        temparr[i].select=this.state.datasource[i].select?false:true;

        this.setState({
            datasource:temparr
        })
    }
    _renderrow()
    {
        console.log(this.state.datasource);
        var re=[];
        for(var i in this.state.datasource) {
            if (this.state.datasource[i].goods.indexOf(this.props.goods_id) == -1) {
                continue;
            }
            if ((this.state.datasource[i].select_id == this.props.goods_id || this.state.datasource[i].select_id == -1) && (this.state.datasource[i].select_attr == -1 || this.state.datasource[i].select_attr == this.props.attr_id)) {
                re.push(<TouchableOpacity key={i} onPress={this.onselect.bind(this, i)}>

                    <View style={{
                        justifyContent: 'space-between',
                        marginTop: px2dp(10),
                        marginLeft: px2dp(10),
                        marginRight: px2dp(10),
                        backgroundColor: "#ffffff",
                        flexDirection: "row"
                    }}>
                        <View style={{justifyContent: "center", alignItems: "center", padding: px2dp(5)}}>
                            {this.state.datasource[i].select ?
                                <Icon name={"ios-checkmark-circle"} size={px2dp(26)} color="#e83e41"/> :
                                <View style={{
                                    height: px2dp(22),
                                    width: px2dp(22),
                                    borderColor: "#cccccc",
                                    borderRadius: px2dp(11),
                                    borderWidth: 1
                                }}>

                                </View>}
                        </View>


                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{
                                flex: 1,
                                backgroundColor: "#2c9c2c",
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{paddingTop: px2dp(5), paddingBottom: px2dp(5)}}>
                                    <Text style={{fontSize: px2dp(11), color: "#ffffff"}}><Text style={{
                                        fontSize: px2dp(18),
                                        fontWeight: 'bold'
                                    }}>{this.state.datasource[i].worth_title}{this.state.datasource[i].worth}</Text></Text>
                                    <Text style={{
                                        fontSize: px2dp(11),
                                        color: "#ffffff"
                                    }}>{this.state.datasource[i].worth_man_title}{this.state.datasource[i].worth_man}可用</Text>
                                </View>

                            </View>
                            <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(16)}}>{this.state.datasource[i].name}</Text>
                                <Text style={{
                                    color: "#bbbbbb",
                                    fontSize: px2dp(11),
                                    marginTop: px2dp(5)
                                }}>{this.state.datasource[i].effective}-{this.state.datasource[i].expiration}</Text>
                            </View>
                        </View>
                    </View>

                </TouchableOpacity>)


            }else{
                re.push(<View key={i}>

                    <View style={{
                        justifyContent: 'space-between',
                        marginTop: px2dp(10),
                        marginLeft: px2dp(10),
                        marginRight: px2dp(10),
                        backgroundColor: "#ffffff",
                        flexDirection: "row"
                    }}>
                        <View style={{justifyContent: "center", alignItems: "center", padding: px2dp(5)}}>

                                <Icon name={"ios-checkmark-circle"} size={px2dp(26)} color="#cccccc"/>

                        </View>


                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{
                                flex: 1,
                                backgroundColor: "#cccccc",
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{paddingTop: px2dp(5), paddingBottom: px2dp(5)}}>
                                    <Text style={{fontSize: px2dp(11), color: "#ffffff"}}><Text style={{
                                        fontSize: px2dp(18),
                                        fontWeight: 'bold'
                                    }}>{this.state.datasource[i].worth_title}{this.state.datasource[i].worth}</Text></Text>
                                    <Text style={{
                                        fontSize: px2dp(11),
                                        color: "#ffffff"
                                    }}>{this.state.datasource[i].worth_man_title}{this.state.datasource[i].worth_man}可用</Text>
                                </View>

                            </View>
                            <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: px2dp(16)}}>{this.state.datasource[i].name}</Text>
                                <Text style={{
                                    color: "#bbbbbb",
                                    fontSize: px2dp(11),
                                    marginTop: px2dp(5)
                                }}>{this.state.datasource[i].effective}-{this.state.datasource[i].expiration}</Text>
                            </View>
                        </View>
                    </View>

                </View>)

            }
        }
        return re;
    }
    selectedcoupon()
    {
        var choosenum=0;
        var total=0;
        var couponlist=[]
        for(var i in this.state.datasource)
        {
            if(this.state.datasource[i].select)
            {
                if ((this.state.datasource[i].select_id == this.props.goods_id || this.state.datasource[i].select_id == -1) && (this.state.datasource[i].select_attr == -1 || this.state.datasource[i].select_attr == this.props.attr_id)) {
                    choosenum++;
                    total += parseFloat(this.state.datasource[i].worth);
                    couponlist.push(this.state.datasource[i]);
                }
            }
        }
        DeviceEventEmitter.emit('choosecoupon',{couponlist:couponlist,id:this.props.goods_id,attr_id:this.props.attr_id,num:choosenum,total:total,list:this.state.datasource});
        this.props.navigator.pop();
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3",position:"relative"}}>
                <NavBar
                    title='优惠劵'
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        tintColor="#ea3524"
                        colors={['#ddd', '#e83e41']}
                        progressBackgroundColor="#ffffff"
                    />}>

                    {this._renderrow()}
                </ScrollView>
                <TouchableOpacity onPress={this.selectedcoupon.bind(this)} style={{position:"absolute",
                    justifyContent: "center",height:px2dp(40), bottom:0,left:0,right:0,backgroundColor:"#ea3524",
                    alignItems:"center"
                }}>
                    <Text style={{color:"#ffffff"}}>
                        确定
                    </Text>

                </TouchableOpacity>
            </View>
        )
    }
}
