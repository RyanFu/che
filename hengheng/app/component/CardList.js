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
    AsyncStorage,
    DeviceEventEmitter,
    PixelRatio,
    Platform,
    TouchableOpacity,
    Image,
    TextInput,
    BackAndroid,
    ListView,
    InteractionManager,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

import px2dp from '../util/index';
import NavBar from '../component/NavBar'
import Toast from 'react-native-root-toast';
import Device from 'react-native-device-info';
import request from '../lib/request';
import set from '../config/config';
let cacheResults = {
    page: 0,
    total: 0,
    items: []
}
export default class CardList extends Component {
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

        InteractionManager.runAfterInteractions(() => {
            AsyncStorage.getItem("token").then((data) => {
                if (data) {
                    this.setState({
                        token: data,
                        device_token: Device.getUniqueID()
                    })
                    this._onRefresh()
                }
            })
        })

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
                page: cacheResults.page,
                token: this.state.token,
                device_token: this.state.device_token,
                status: this.props.status,
                type:this.props.type
            }
            request.post(set.baseurl + set.mall.getusercard, databody).then((data) => {
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

    }

    _renderRow(db) {
        {/* <View key={i} style={{flexDirection: 'row', backgroundColor: "#ffffff", paddingVertical: px2dp(10)}}>

         <View style={{
         flex: 3, paddingHorizontal: px2dp(20), paddingVertical: px2dp(5), borderBottomColor: "#f0f0f0",
         borderBottomWidth: 1
         }}>
         <Text style={{color: "#333333", marginBottom: px2dp(5)}}
         numberOfLines={1}>{item.name}</Text>
         <Text style={{color: "#555555", fontSize: px2dp(12), marginBottom: px2dp(5)}}
         numberOfLines={2}>{item.desc}</Text>
         <Text style={{color: "#ea3524", fontSize: px2dp(14), fontWeight: "bold", marginBottom: px2dp(5)}}>使用：{item.used_num}/{item.num}</Text>
         <Text style={{color: "#555555", fontSize: px2dp(12), marginBottom: px2dp(5)}}
         numberOfLines={2}>有效期至:{item.end_time}</Text>
         </View>


         </View>
         */}
        var card_list = [];
        db.card.map((item, i) => {
            card_list.push(

                <View key={i} style={{
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
                        <Text style={{fontSize:px2dp(16)}}>{item.name}</Text>
                        <Text style={{fontSize:px2dp(16)}}>{item.desc}</Text>
                        <View style={{flex: 1,marginTop:px2dp(15),alignItems:'flex-start',justifyContent:"flex-start"}}>
                            <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>有效期至：{item.end_time}</Text>
                            <Text style={{color:"#bbbbbb",fontSize:px2dp(11)}}>总次数：含{item.num}次 己使用{item.used_num}次</Text>

                        </View>


                    </View>
                </View>

            </View>
            )

        })
        return (
            <View style={{marginVertical: px2dp(5), backgroundColor: "#ffffff"}}>
                <Text style={{height:px2dp(30), paddingLeft:px2dp(5),lineHeight:px2dp(30),fontWeight:"bold"}}>商品：{db.name}</Text>
                {card_list}

            </View>
        )

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

    render() {
        return (
            <View style={styles.view}>
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
    }

});