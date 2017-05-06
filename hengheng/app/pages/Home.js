/**
 * @author LiaoPeng
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform,
    Image,
    BackAndroid,
    ListView,
    InteractionManager,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Alert
} from 'react-native';

import px2dp from '../util/index';
import Icon from 'react-native-vector-icons/Ionicons'
import Swiper from 'react-native-swiper';
import RenderListGoods from "../component/RenderListGoods"
import Goods from './Goods'
import theme from '../config/theme'
import Myicon from 'react-native-vector-icons/MaterialCommunityIcons'
import request from '../lib/request';
import set from '../config/config';
import Alipay from 'react-native-yunpeng-alipay'
let cacheResults = {
    page: 0,
    total: 0,
    items: []
}
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingTail: false,
            isRefreshing: false,
            hasmore: true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 != row2,
            }),
        }
    }

    componentDidMount() {

        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);

        InteractionManager.runAfterInteractions(this._onRefresh());

    }

    _fecthdata() {
        if (!this.state.isLoadingTail) {
            this.setState({
                isLoadingTail: true
            });
            if (cacheResults.page > 0 && cacheResults.items.length == cacheResults.total || cacheResults.total < 5) {
                this.setState({
                    hasmore: false
                })

            }


            var databody = {
                page: cacheResults.page
            }
            request.post(set.baseurl + set.interface.getgoodslist, databody).then((data) => {
                if (parseInt(data.status) == 0) {
                    cacheResults.items = cacheResults.items.concat(data.data.list);
                    cacheResults.total = data.data.total;
                    cacheResults.page = cacheResults.page + 1;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(cacheResults.items),
                        isRefreshing: false,
                        isLoadingTail: false
                    })
                }

            }).catch((err) => {
                alert(err)
            })

        }
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    handleBack = () => {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }

    _jpgoods(data) {
        this.props.navigator.push({
            component: Goods,
            args: {
                data: data
            }
        })
    }

    _renderRow(db) {
        return (
            <RenderListGoods db={db} jp={this._jpgoods.bind(this)}/>
        )

    }

    renderSwiper() {
        var aaaa = ["default/20170424/58fd7f6e7f0b9.jpg", "default/20170424/58fd7f6e7f0b9.jpg"];
        var content = [];
        aaaa.map((item, i) => {
            content.push(
                <Image
                    key={i}
                    style={{flex: 1}}
                    source={{uri: set.baseurl + "data/upload/" + item}}
                />
            )
        })
        return content;
    }

    _rendheader() {
        var aaaa = ["default/20170424/58fd7f6e7f0b9.jpg", "default/20170424/58fd7f6e7f0b9.jpg"];

        return (<View><Swiper height={150} autoplay={true}>
            {aaaa.map((item, i) => {

                <Image
                    key={i}
                    style={{flex: 1}}
                    source={{uri: set.baseurl + "data/upload/" + item}}
                />

            })}
        </Swiper>
            <View>

            </View>


        </View>)
    }

    _onRefresh() {
        if (!this.state.isRefreshing) {
            this.setState({
                isRefreshing: true,
                hasmore: true,
            })
            cacheResults.items = [];
            cacheResults.total = 0;
            cacheResults.page = 0;
            this._fecthdata();

        }


    }

    _rendfooter() {
        return (
            <View style={{paddingVertical: px2dp(20), alignItems: "center"}}>
                {this.state.hasmore ?
                    <ActivityIndicator /> :
                    <Text>没有更多了</Text>
                }
            </View>
        )


    }
    _jumptoScanner()
    {
        opt.success("aaaaa")
    }
    Lbs()
    {
        request.get("http://www.jzdzsw.com/index.php?g=app&m=public&a=testalipay",{}).then((data)=>{

            Alipay.pay(data.data).then((data) => {
                console.log(data);
            })
        })


    }
    render() {
        return (
        <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
            <View style={[styles.topbar, this.props.style]}>
                <TouchableOpacity onPress={this.Lbs.bind(this)} style={styles.btn}>
                    <Icon name="ios-pin" size={px2dp(22)} color="#fff"/>
                    <Text style={{fontSize: px2dp(14), color: "#ffffff", marginLeft: px2dp(5)}}>吉首</Text>
                </TouchableOpacity>
                <Animated.Text numberOfLines={1} style={[styles.title]}>亨亨养车</Animated.Text>
                <TouchableOpacity onPress={this._jumptoScanner.bind(this)} style={styles.btn}>
                    <Myicon name="qrcode-scan" size={px2dp(22)} color="#fff"/>
                </TouchableOpacity>
            </View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                enableEmptySections={true}

                automaticallyAdjustContentInsets={false}
                onEndReached={this._fecthdata.bind(this)}
                onEndReachedThreshold={px2dp(20)}
                renderFooter={this._rendfooter.bind(this)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        tintColor="#ea3524"
                        colors={['#ddd', '#e83e41']}
                        progressBackgroundColor="#ffffff"
                    />
                }

            />
        </View>

        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#f3f3f3'
    },
    actionBar: {
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    topbar: {
        height: theme.actionBar.height,
        backgroundColor: theme.bkColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        paddingHorizontal: px2dp(10),
    },
    btn: {
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: px2dp(14),
        marginLeft: px2dp(5),
    }
});