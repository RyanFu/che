/**
 * Created by LiaoPeng on 20/11/16.
 */
import React, {Component} from 'react';
import {BackAndroid} from 'react-native';

export default class Common extends Component{
    constructor(props){
        super(props);
    }
    componentWillUnmount() {

        BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);

    }
    onBackAndroid = () => {

        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {

            //最近2秒内按过back键，可以退出应用。

            return false;

        }

        this.lastBackPressed = Date.now();

        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);

        return true;

    };
}