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
    ScrollView,
    InteractionManager,
    RefreshControl,
    Image
} from 'react-native'
import NavBar from '../component/NavBar'
import set from '../config/config'
import px2dp from '../util/index'
import request from '../lib/request'
import Account from '../component/Account'
export default class Order extends Component {
    constructor(props) {
        super(props)
        this.handleBack = this._handleBack.bind(this);
        this.state={
            isRefreshing:false,
        }
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
        InteractionManager.runAfterInteractions(()=>{
            this._onRefresh();
        })
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }
    _onRefresh()
    {
        if(!this.state.isRefreshing)
        {
            this.setState({
                isRefreshing:true
            })
        }

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title='账单'
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}

                />
                <Account/>


            </View>
        )
    }
}
