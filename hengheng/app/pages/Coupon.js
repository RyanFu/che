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
    Image,
    ScrollView
} from 'react-native'
import NavBar from '../component/NavBar'
import px2dp from '../util/index'
import set from '../config/config'
import TabViewBar from '../component/TabViewBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import CouponList from '../component/CouponList'
export default class Coupon extends Component {
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
                    title='优惠劵'
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <ScrollableTabView renderTabBar={() => <TabViewBar/>}>
                    <CouponList tabLabel="可使用" status={0}/>
                    <CouponList tabLabel="己使用" status={1}/>
                    <CouponList tabLabel="己过期" status={2}/>
                </ScrollableTabView>
            </View>
        )
    }
}
