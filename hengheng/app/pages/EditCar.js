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
    Platform,
    ScrollView,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
    DeviceEventEmitter,
    BackAndroid,
    Alert
} from 'react-native'
import px2dp from '../util'
import NavBar from '../component/NavBar'
import plate from './plate'
import Icon from 'react-native-vector-icons/Ionicons'
import plateList from './plateList'
import abbreviated from './abbreviated'
import Toast from 'react-native-root-toast';
import Device from 'react-native-device-info';
import Car from './car'
import set from '../config/config'
import request from '../lib/request'
//FontAwesome
export default class EditCar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnopen: true,
            address: this.props.data.address ? this.props.data.address : "湘",
            isopen: false,
            plate: this.props.data.plate ? this.props.data.plate : "",
            km: this.props.data.km ? this.props.data.km : '',
            series: this.props.data.series ? this.props.data.series : "请选择品牌车系",
            series_id: this.props.data.series_id ? this.props.data.series_id : "",
            letter: this.props.data.letter ? this.props.data.letter : "A",
            carname: this.props.data.carname ? this.props.data.carname : "点击添加车型",
            car_id: this.props.data.car_id ? this.props.data.car_id : "",
            id: this.props.data.id ? this.props.data.id : "",
            token: "",
            devide_token: "",

        }
        this.handleBack = this._handleBack.bind(this);
    }



    componentDidMount() {

        AsyncStorage.getItem("token")
            .then((data) => {
                if (data) {
                    let token = data;
                    this.setState({
                        token: token,
                        device_token: Device.getUniqueID()
                    })
                }
            })

        this.selectseries = DeviceEventEmitter.addListener('changeseries', (data) => {
            this.setState({
                series: data.series,
                series_id: data.series_id
            })
        });
        this.selectletter = DeviceEventEmitter.addListener('changeletter', (data) => {
            this.setState({
                letter: data
            })
        });
        this.selectaddress = DeviceEventEmitter.addListener('changeaddress', (data) => {
            this.setState({
                address: data.abbreviated
            })
        });
        this.changecar = DeviceEventEmitter.addListener('changecar', (data) => {
            this.setState({
                carname: data.carname,
                car_id: data.car_id
            })
        });
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    addcarsub() {


        this.setState({
            btnopen: false,
        });
        this.toast = Toast.show('正在保存，请稍后', {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });
        request.post(set.baseurl + set.interface.addcar, this.state).then((data) => {
            Toast.hide(this.toast);
            if (parseInt(data.status) == 0) {
                this.toast = Toast.show(data.message, {
                    duration: 2000,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0,
                });
                DeviceEventEmitter.emit('editcar', "");
                setTimeout(() => {
                    this.setState({
                        btnopen: true,
                    });
                    this.handleBack()
                }, 500);
            } else {
                this.toast = Toast.show(data.message, {
                    duration: 2000,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0,
                });
                setTimeout(() => {
                    this.setState({
                        btnopen: true,
                    });
                }, 500);

            }

        }).catch((err) => {
            Toast.hide(this.toast);
            this.toast = Toast.show('通信失败，请重试', {
                duration: 2000,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: false,
                delay: 0,
            });
            setTimeout(() => {
                this.setState({
                    btnopen: true,
                });
            }, 500);

        });


    }


    selectabbreviated() {
        this.props.navigator.push({
            component: abbreviated
        })
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
        this.selectseries.remove();
        this.selectletter.remove();
        this.selectaddress.remove();
        this.changecar.remove();
    }

    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }

    back() {
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3", position: "relative"}}>
                {this.state.id ? <NavBar
                        title={this.props.title}
                        leftIcon="ios-arrow-back"
                        leftPress={this.back.bind(this)}
                        rightIcon="ios-trash-outline"
                        rightPress={() => {
                            Alert.alert(
                                '提示',
                                '您确定删除么',
                                [
                                    {
                                        text: '确定', onPress: () => {

                                        this.toast = Toast.show("正在删除，请稍后……", {
                                            duration: 20000,
                                            position: Toast.positions.CENTER,
                                            shadow: true,
                                            animation: true,
                                            hideOnPress: false,
                                            delay: 0,
                                        });
                                        let databody={
                                            token:this.state.token,
                                            id:this.state.id

                                        }

                                        request.post(set.baseurl + set.interface.userdelcar,databody).then((data) => {
                                            Toast.hide(this.toast)
                                            if (parseInt(data.status)==0)
                                            {
                                                this.toast = Toast.show("删除成功", {
                                                    duration: 20000,
                                                    position: Toast.positions.CENTER,
                                                    shadow: true,
                                                    animation: true,
                                                    hideOnPress: false,
                                                    delay: 0,
                                                });
                                                setTimeout(()=>{
                                                    Toast.hide(this.toast)
                                                    this.handleBack();
                                                },500)
                                            }else if (parseInt(data.status)==1)
                                            {
                                                this.toast = Toast.show("请重新登陆", {
                                                    duration: 20000,
                                                    position: Toast.positions.CENTER,
                                                    shadow: true,
                                                    animation: true,
                                                    hideOnPress: false,
                                                    delay: 0,
                                                });
                                                setTimeout(()=>{
                                                    Toast.hide(this.toast)
                                                    this.props.navigator.popToTop();
                                                },500)
                                            }else{
                                                this.toast = Toast.show(data.message, {
                                                    duration: 2000,
                                                    position: Toast.positions.CENTER,
                                                    shadow: true,
                                                    animation: true,
                                                    hideOnPress: false,
                                                    delay: 0,
                                                });

                                            }


                                        }).catch((err) => {
                                            Toast.hide(this.toast);
                                            this.toast = Toast.show("网络通信失败，请重试", {
                                                duration: 20000,
                                                position: Toast.positions.CENTER,
                                                shadow: true,
                                                animation: true,
                                                hideOnPress: false,
                                                delay: 0,
                                            });


                                        })


                                        DeviceEventEmitter.emit('editcar');
                                    }
                                    },
                                    {
                                        text: '取消', onPress: () => {
                                    }, style: 'cancel'
                                    },
                                ],
                                {
                                    cancelable: false
                                }
                            );
                        }
                        }
                    /> :
                    <NavBar
                        title={this.props.title}
                        leftIcon="ios-arrow-back"
                        leftPress={this.back.bind(this)}

                    />}

                <ScrollView>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        borderTopWidth: 1,
                        borderTopColor: "#cccccc",
                        borderBottomWidth: 1,
                        borderBottomColor: "#eeeeee",
                        padding: px2dp(8),
                        alignItems: 'center',
                        backgroundColor: "#ffffff"
                    }}>
                        <View>
                            <Text style={{color: 'red'}}>* <Text style={{color: "#333333"}}>车牌号码</Text></Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                borderRightWidth: 1,
                                borderRightColor: "#cccccc",
                                padding: px2dp(5),
                                alignItems: "center"
                            }} onPress={this.selectabbreviated.bind(this)}>
                                <Text>{this.state.address} </Text>
                                <Icon name="ios-arrow-down" size={px2dp(20)} color={"#bbb"}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.props.navigator.push({
                                    component: plate,
                                    args: {
                                        type: "letter"
                                    }
                                })
                            }} style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                borderRightWidth: 1,
                                borderRightColor: "#cccccc",
                                padding: px2dp(5)
                            }}>
                                <Text style={{fontSize: px2dp(16)}}>{this.state.letter} </Text>
                                <Icon name="ios-arrow-down" size={px2dp(18)} color={"#bbb"}/>
                            </TouchableOpacity>
                            <View>
                                <TextInput
                                    style={{
                                        height: px2dp(40),
                                        width: px2dp(70),
                                        justifyContent: 'center',
                                        fontSize: px2dp(14)
                                    }}
                                    underlineColorAndroid="transparent"
                                    placeholder={"填写车牌"}
                                    placeholderTextColor="#c4c4c4"
                                    onChangeText={(text) => {
                                        this.setState({
                                            plate: text
                                        })
                                    }}
                                    value={this.state.plate}
                                />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {

                            this.props.navigator.push({
                                component: plateList,
                            })


                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderBottomColor: "#eeeeee",
                            padding: px2dp(8),
                            alignItems: 'center',
                            backgroundColor: "#ffffff"
                        }}>
                            <View>
                                <Text style={{color: 'red'}}>* <Text style={{color: "#333333"}}>品牌车系</Text></Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: "space-between",
                                    alignItems: 'center'
                                }}>
                                    <Text style={{color: "#aaaaaa", fontSize: px2dp(11)}}>{this.state.series}</Text>

                                </View>

                                <View style={{marginLeft: px2dp(5)}}>
                                    <Icon name="ios-arrow-forward" size={px2dp(20)} color={"#bbb"}/>


                                </View>

                            </View>
                        </View>
                    </TouchableOpacity>

                    {!this.state.isopen &&
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            isopen: true,
                        })
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#ffffff",
                            padding: px2dp(5),
                            borderBottomWidth: 1,
                            borderBottomColor: "#eeeeee"
                        }}>
                            <Text style={{fontSize: px2dp(11), color: "#aaaaaa"}}>展开更多车辆信息 </Text>
                            <Icon name="ios-arrow-down" size={px2dp(18)} color={"#bbb"}/>
                        </View>
                    </TouchableOpacity>
                    }

                    {this.state.isopen && <TouchableOpacity onPress={() => {
                        if (this.state.series_id == "") {
                            alert("请先选择品牌");
                            return;
                        }
                        this.props.navigator.push({
                            component: Car,
                            args: {
                                id: this.state.series_id
                            }
                        })
                    }
                    }>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderBottomColor: "#eeeeee",
                            padding: px2dp(8),
                            alignItems: 'center',
                            backgroundColor: "#ffffff"
                        }}>
                            <View>
                                <Text style={{color: "#333333"}}>车 型</Text>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: "space-between",
                                    alignItems: 'center'
                                }}>
                                    <Text style={{color: "#aaaaaa", fontSize: px2dp(11)}}>{this.state.carname}</Text>

                                </View>

                                <View style={{marginLeft: px2dp(5)}}>
                                    <Icon name="ios-arrow-forward" size={px2dp(20)} color={"#bbb"}/>


                                </View>

                            </View>

                        </View></TouchableOpacity>}
                    {this.state.isopen &&
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        borderBottomWidth: 1,
                        borderBottomColor: "#eeeeee",
                        padding: px2dp(8),
                        alignItems: 'center',
                        backgroundColor: "#ffffff"
                    }}>
                        <View>
                            <Text style={{color: "#333333"}}>行驶里程</Text>
                            <Text style={{
                                color: "#bbbbbb",
                                fontSize: px2dp(11),
                                marginTop: px2dp(2)
                            }}>如果里程数暂时不知道，可不填写</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>

                            <TextInput
                                style={{
                                    height: px2dp(40),
                                    width: px2dp(70),
                                    justifyContent: 'center',
                                    fontSize: px2dp(14)
                                }}
                                underlineColorAndroid="transparent"
                                placeholder={"点击输入"}
                                placeholderTextColor="#c4c4c4"
                                onChangeText={(text) => {
                                    this.setState({
                                        km: text
                                    })
                                }}
                                value={this.state.km}
                            />
                            <Text>公里</Text>
                        </View>
                    </View>}

                    {this.state.isopen &&
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            isopen: false
                        })
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#ffffff",
                            padding: px2dp(5),
                            borderBottomWidth: 1,
                            borderBottomColor: "#eeeeee"
                        }}>
                            <Text style={{fontSize: px2dp(11), color: "#aaaaaa"}}>点击收起 </Text>
                            <Icon name="ios-arrow-up" size={px2dp(18)} color={"#bbb"}/>
                        </View>
                    </TouchableOpacity>
                    }

                </ScrollView>
                <View style={{
                    position: "absolute", height: px2dp(40), bottom: 0, left: 0, right: 0, backgroundColor: "#ffffff",
                    borderTopWidth: 1, borderTopColor: "#eeeeee", justifyContent: "center", alignItems: "center",
                    paddingHorizontal: px2dp(20), paddingVertical: px2dp(5)
                }}>
                    {(this.state.series_id && this.state.plate && this.state.btnopen ) ? <TouchableOpacity

                            style={{
                                height: px2dp(30),
                                borderRadius: px2dp(3),
                                backgroundColor: "#e83e41",
                                width: px2dp(200),
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={() => {
                                this.addcarsub();
                            }}
                        >
                            <Text style={{color: "#ffffff"}}>保存</Text>
                        </TouchableOpacity> : <View

                            style={{
                                height: px2dp(30),
                                borderRadius: px2dp(3),
                                backgroundColor: "#cccccc",
                                width: px2dp(200),
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={() => {
                                this.addcarsub();
                            }}
                        >
                            <Text style={{color: "#ffffff"}}>保存</Text>
                        </View>}

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
