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
export default class Account extends Component {
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
            }
            request.post(set.baseurl + set.user.getuseraccount, databody).then((data) => {
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

        return (
            <View style={{paddingLeft: px2dp(5)}}>
                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#eeeeee',
                    paddingBottom: px2dp(10),
                    paddingTop: px2dp(10)
                }}>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: px2dp(12), textAlign: 'center', color:"#aaaaaa"}}>
                            {db.time}
                        </Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{borderRadius:px2dp(15),height:px2dp(30),width:px2dp(30), backgroundColor:"#e83e41",justifyContent:'center',alignItems:"center"}}>
                            <Text style={{fontSize:px2dp(16), color:"#ffffff",fontWeight:"bold"}}>{db.type_title}</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 6,
                        justifyContent: 'center',
                        paddingLeft: px2dp(8),
                        paddingRight: px2dp(5)
                    }}>
                        <Text style={{fontSize: px2dp(12),marginBottom:px2dp(5)}}>{db.money_title} {db.pay_title}</Text>
                        <Text style={{fontSize: px2dp(11), color:"#5f5f5f"}}>{db.desc}</Text>
                    </View>
                </View>
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