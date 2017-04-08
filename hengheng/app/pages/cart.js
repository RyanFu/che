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
let carlist=[]
export default class cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            isRefreshing:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 != row2,
            }),
        }
    }
    emptycart() {
        AsyncStorage.removeItem("cartlist");
        this._onRefresh()
    }

    decreasenum() {
        if (this.state.num > 0) {

        }
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(this._onRefresh());
    }
    _onRefresh()
    {


        if(!this.state.isRefreshing){
            carlist.splice(0,carlist.length);
            this.setState({
                isRefreshing:true
            })
            AsyncStorage.getItem("cartlist").then((data)=>{

                if(data)
                {

                    var temdata=JSON.parse(data);
                    for(var key in temdata)
                    {
                        carlist.push(temdata[key]);
                    }


                }
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(carlist),
                    isRefreshing:false
                })

            }).catch((err)=>{alert(err)
                this.setState({
                    isRefreshing:false
                })
            });


        }


    }

    addnum() {

    }
    delgoods(data)
    {
        alert("a");
    }
    ordersub()
    {
        console.log(carlist)
        return
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
                {carlist.length>0?<SwipeListView
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
                                <Text style={styles.backTextWhite} onPress={this.delgoods.bind(this,data)}>删除</Text>
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
                                            source={{uri: set.baseurl + 'data/upload/'+data.goods.thumb}}
                                            style={{width: px2dp(90), height: px2dp(90)}}/>
                                    </View>
                                    <View style={{flex: 6}}>
                                        <Text numberOfLines={2} style={{fontSize: px2dp(12), flex: 1}}>【{data.goods.class_name}】{data.goods.name} {data.attr.f_name}</Text>
                                        <Text numberOfLines={2}
                                              style={{fontSize: px2dp(12), flex: 1, color: "#bcbcbc",}}>{data.goods.title}
                                            </Text>
                                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center',
                                            justifyContent:'space-between'
                                        }}>
                                            <Text style={{fontSize: px2dp(11), color: "#e83e41"}}>￥<Text
                                                style={{fontSize: px2dp(12)}}>{data.price}</Text></Text>
                                            <Text style={{
                                                fontSize: px2dp(12),
                                                color: "#bcbcbc",
                                                marginLeft: px2dp(5)
                                            }}>￥{data.total}</Text>
                                            <View style={{width:px2dp(80), flexDirection: 'row', marginLeft: px2dp(5)}}>
                                                <TouchableOpacity style={{
                                                    flex: 1,
                                                    borderWidth: 1,
                                                    borderColor: "#cccccc",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }} onPress={this.decreasenum.bind(this)}>
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
                                                }} onPress={this.addnum.bind(this)}>
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
                />:<View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>购物车里啥都没有</Text><Text
                        style={{paddingHorizontal:px2dp(15),borderWidth:1, borderColor:"#ea3524",color:"#ea3524",
                            paddingVertical:px2dp(3),borderRadius:5,margin:px2dp(10)
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
    backTextWhite:{
        height:px2dp(120),
        lineHeight:px2dp(120),
        width:px2dp(60),
        marginRight: 0,
        textAlign:"center",
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