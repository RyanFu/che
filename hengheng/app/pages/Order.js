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
                    <TakeOut tabLabel="全部" status={-1}></TakeOut>
                    <TakeOut tabLabel="待付款" status={0}/>
                    <TakeOut tabLabel="己完成" status={1}></TakeOut>
                </ScrollableTabView>
            </View>
        )
    }
}
