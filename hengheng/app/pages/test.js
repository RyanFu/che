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
    RefreshControl
} from 'react-native';

import px2dp from '../util/index';
import NavBar from '../component/NavBar'
import Toast from 'react-native-root-toast';
import Device from 'react-native-device-info';
import RenderListGoods from "../component/RenderListGoods"
import request from '../lib/request';
import set from '../config/config';
let cacheResults = {
    page: 0,
    total: 0,
    items: []
}
export default class test extends Component {
    constructor(props) {
        super(props);
        this.state ={
            isLoadingTail: false,
            isRefreshing: false,
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
            if(cacheResults.page>0 && cacheResults.items.length==cacheResults.total)
            {
                alert("米得啦")

            }

            var databody = {
                page: cacheResults.page
            }
            request.post(set.baseurl + set.interface.getgoodslist, databody).then((data) => {
                if (parseInt(data.status) == 0) {
                    cacheResults.items=cacheResults.items.concat(data.data.list);
                    cacheResults.total = data.data.total;
                    cacheResults.page = cacheResults.page + 1;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(cacheResults.items),
                        isRefreshing: false,
                        isLoadingTail:false
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

    _renderRow(db) {
        return (
            <RenderListGoods db={db}/>
        )

    }

    _onRefresh() {
        if (!this.state.isRefreshing) {
            this.setState({
                isRefreshing: true,
            })
            cacheResults.items = [];
            cacheResults.total = 0;
            cacheResults.page = 0;
            this._fecthdata();

        }


    }


    render() {
        return (
            <View style={styles.view}>
                <NavBar
                    title="商品列表"
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}

                    automaticallyAdjustContentInsets={false}
                    onEndReached={this._fecthdata.bind(this)}
                    onEndReachedThreshold={px2dp(20)}
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