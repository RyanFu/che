/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    BackAndroid,
    AsyncStorage,
    RefreshControl,
    DeviceEventEmitter,
} from 'react-native'
import px2dp from '../util'
import NavBar from '../component/NavBar'
import Button from '../component/Button'
import EditCar from './EditCar'
import set from '../config/config';
import request from "../lib/request";
import Toast from 'react-native-root-toast';
import Device from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons'
//FontAwesome
export default class Carlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRefreshing: false,
            address: [],
            token:"",
            device_token:""
        }
        this.handleBack = this._handleBack.bind(this);
    }

    componentDidMount() {
        this._onRefresh();
        this.editcar = DeviceEventEmitter.addListener('editcar', (data) => {
            this._onRefresh();
        });
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        //判断是否登陆
    }
    _onRefresh(){
        AsyncStorage.getItem("token")
            .then((data) => {
                if (data) {
                    let token = data;
                    this.setState({
                        token: token,
                        device_token: Device.getUniqueID()
                    })
                    request.post(set.baseurl+set.interface.usercarlist,this.state).then((data)=>{
                        if(parseInt(data.status)==0)
                        {
                            this.setState({
                                address:data.data,
                            })
                        }
                        if(parseInt(data.status)==1)
                        {
                            this.toast = Toast.show("请重新登陆", {
                                duration: 2000,
                                position: Toast.positions.CENTER,
                                shadow: true,
                                animation: true,
                                hideOnPress: false,
                                delay: 0,
                            });
                            setTimeout(()=>{
                                this.props.navigator.popToTop();
                            },500)
                        }



                    }).catch((err)=>{
                        this.toast = Toast.show("网络错误，请重试", {
                            duration: 2000,
                            position: Toast.positions.CENTER,
                            shadow: true,
                            animation: true,
                            hideOnPress: false,
                            delay: 0,
                        });

                    })
                }else{
                    this.toast = Toast.show("请重新登陆", {
                        duration: 2000,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: false,
                        delay: 0,
                    });
                    setTimeout(()=>{
                        this.props.navigator.popToTop();
                    },500)

                }
                this.setState({
                    isRefreshing:false,
                })
            })

    }

    componentWillUnmount() {
        this.editcar.remove();
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

    add() {
        this.props.navigator.push({
            component: EditCar,
            args: {
                pageType: 0,
                title: "新增爱车",
                data:{
                    address:"",
                    plate: "",
                    km: '',
                    series: "",
                    series_id:"",
                    letter: "",
                    carname: "",
                    car_id:"",
                    id: "",

                }
            }
        })
    }

    edit(data) {
        this.props.navigator.push({
            component: EditCar,
            args: {
                pageType: 1,
                title: "爱车详情",
                data:data,
            }
        })
    }

    back() {
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="我的爱车"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#e83e41"
                            colors={['#e83e41', '#e83e41']}
                            progressBackgroundColor="#ffffff"
                        />
                    }>
                    {this.state.address.map((item, i) => {
                        return (
                            <Button key={i} onPress={this.edit.bind(this, item)}>
                                <View style={styles.address}>
                                    <View style={{borderWidth:1, borderColor:"#ffffff",height:px2dp(60), flex:1, borderRadius:px2dp(5),flexDirection:'row',justifyContent:"space-between",alignItems:'center'}}>
                                        <View style={{flexDirection:"row",justifyContent:'center',alignItems:"center"}}>
                                            <Text style={{color:"#ffffff",fontSize:px2dp(40),marginLeft:px2dp(10)}}>{item.address}</Text>
                                            <Text style={{color:"#ffffff",fontSize:px2dp(45)}}>{item.letter}</Text>
                                            <Text style={{color:"#ffffff",fontSize:px2dp(45),marginLeft:px2dp(10)}}>{item.plate}</Text>

                                        </View>
                                        <View style={{paddingRight:px2dp(8)}}>
                                        <Icon name="md-create" size={22} color="#ffffff"/>
                                        </View>
                                    </View>
                                </View>
                            </Button>
                        )
                    })}
                </ScrollView>
                <Button style={{position: "absolute", bottom: 0, left: 0, right: 0, flex: 1}}
                        onPress={this.add.bind(this)}>

                    <View style={{
                        height: px2dp(45),
                        flexDirection: "row",
                        backgroundColor: "#fff",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Icon name="ios-add-circle-outline" size={18} color="#0096ff"/>
                        <Text style={{color: "#0096ff", fontSize: px2dp(14), marginLeft: 8}}>{"新增爱车"}</Text>
                    </View>
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    address: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#fbfbfb",
        backgroundColor: "#050189",
        borderRadius: px2dp(5),
        marginTop: px2dp(5),
        marginLeft: px2dp(5),
        marginRight: px2dp(5),
        padding:px2dp(5)
    },
    tag: {
        color: "#fff",
        fontSize: px2dp(12),
        minWidth: px2dp(30),
        textAlign: "center",
        paddingVertical: 1,
        paddingHorizontal: 2,
        borderRadius: 5,
        marginRight: 5
    },
    ads1List: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 5
    }
})
