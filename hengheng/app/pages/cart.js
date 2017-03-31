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
    ListView,
    BackAndroid,
    PixelRatio,
    Animated
} from 'react-native'
import px2dp from '../util/index'
import NavBar from '../component/NavBar'
import Icon from 'react-native-vector-icons/Ionicons'
import set from '../config/config'
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import orderSub from './ordersub'
export default class cart extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            cartlist: null,
            token: '',
            listViewData: Array(20).fill('').map((_, i) => `item #${i}`)
        }
    }
    emptycart() {
        alert("清空");
    }

    decreasenum() {
        if (this.state.num > 0) {

        }
    }

    addnum() {

    }
    ordersub()
    {
        this.props.navigator.push({
            component:orderSub
        })

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
                <SwipeListView
                    dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                    renderRow={ (data, secId, rowId, rowMap) => (
                        <SwipeRow
                            disableRightSwipe={true}
                            rightOpenValue={-60}
                            stopRightSwipe={-100}
                        >
                            <View style={styles.standaloneRowBack}>
                                <Text style={styles.backTextWhite}>Left</Text>
                                <Text style={styles.backTextWhite}>删除</Text>
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
                                    <View style={{flex: 1}}>

                                        <Icon name={"ios-checkmark-circle"} size={px2dp(24)} color="#e83e41"/>

                                    </View>
                                    <View style={{flex: 3}}>
                                        <Image
                                            source={{uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'}}
                                            style={{width: px2dp(90), height: px2dp(90)}}/>
                                    </View>
                                    <View style={{flex: 6}}>
                                        <Text numberOfLines={2} style={{fontSize: px2dp(12), flex: 1}}>外星人准系统X991 桌面级CPU
                                            I7 7700K
                                            有钱人必备神器有钱人必备神器有钱人必备神器</Text>
                                        <Text numberOfLines={2}
                                              style={{fontSize: px2dp(12), flex: 1, color: "#bcbcbc",}}>外星人准系统X991
                                            桌面级CPU，I7 7700K
                                            有钱人必备神器</Text>
                                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center',}}>
                                            <Text style={{fontSize: px2dp(11), color: "#e83e41"}}>￥<Text
                                                style={{fontSize: px2dp(12)}}>599.00</Text></Text>
                                            <Text style={{
                                                fontSize: px2dp(12),
                                                textDecorationLine: "line-through",
                                                color: "#bcbcbc",
                                                marginLeft: px2dp(5)
                                            }}>￥2109.00</Text>
                                            <View style={{flex: 1, flexDirection: 'row', marginLeft: px2dp(5)}}>
                                                <TouchableOpacity style={{
                                                    flex: 1,
                                                    borderWidth: 1,
                                                    borderColor: "#cccccc",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }} onPress={this.decreasenum.bind(this)}>
                                                    <Text style={{
                                                        fontSize: px2dp(18),
                                                    }}>
                                                        -
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={{
                                                    flex: 1,
                                                    borderTopWidth: 1,
                                                    height: px2dp(30),
                                                    width: px2dp(35),
                                                    borderColor: "#cccccc",
                                                    justifyContent: 'center',
                                                    alignItems: "center",
                                                    borderBottomWidth: 1
                                                }}>
                                                    <Text style={{
                                                        fontSize: px2dp(18),
                                                        color: '#333333'
                                                    }}>
                                                        {this.state.num}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity style={{
                                                    flex: 1,
                                                    borderWidth: 1,
                                                    height: px2dp(30),
                                                    width: px2dp(35),
                                                    borderColor: "#cccccc",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }} onPress={this.addnum.bind(this)}>
                                                    <Text style={{
                                                        fontSize: px2dp(18),
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
                />


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
                    <View style={{flexDirection: "row", alignItems: 'center',flex:1}}>
                        <View style={{
                            borderWidth: 1,
                            borderColor: "#cccccc",
                            borderRadius: px2dp(10),
                            height: px2dp(20),
                            width: px2dp(20),
                            marginLeft: px2dp(10),
                            marginRight: px2dp(5)
                        }}>
                        </View>
                        <Text>全选</Text>
                    </View>
                    <View style={{flexDirection: "row",flex:2, alignItems: 'center',justifyContent:'flex-start'}}>

                        <Text style={{fontSize:px2dp(12)}}>合计：</Text>
                        <Text style={{fontSize:px2dp(11), color:"#e83e41"}}>￥<Text style={{fontSize:px2dp(14)}}>1000.00</Text></Text>
                    </View>
                    <TouchableOpacity onPress={this.ordersub.bind(this)} style={{flex:1,backgroundColor:"#e83e41",height:px2dp(40),justifyContent:"center",alignItems:'center'}}>
                    <Text style={{color:'#ffffff'}}>结算(0)</Text>
                    </TouchableOpacity>

                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
        padding: 15,

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