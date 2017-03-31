/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, {Component} from 'react'
import {
    Text,
    View,
    BackAndroid
} from 'react-native'
import NavBar from '../component/NavBar'
import TakeOut from './TakeOut'
import Breakfast from './Breakfast'
import TabViewBar from '../component/TabViewBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
export default class Order extends Component {
    constructor(props) {
        super(props)
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

        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title='我的订单'
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <ScrollableTabView renderTabBar={() => <TabViewBar/>}>
                    <View tabLabel="全部"></View>
                    <TakeOut tabLabel="待付款"/>
                    <Breakfast tabLabel="待收货"/>
                    <View tabLabel="待使用"></View>
                    <View tabLabel="待评价"></View>
                    <View tabLabel="己完成"></View>
                </ScrollableTabView>
            </View>
        )
    }
}
