import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    ScrollView,
} from 'react-native'
import CustomTabBar from '../component/CustomTabBar';
import ScrollableTabView, {DefaultTabBar,}from 'react-native-scrollable-tab-view';
import theme from '../config/theme';
import {connect} from 'react-redux';
const { width, height } = Dimensions.get('window')

class MYtest extends Component{
    constructor(props){
        super(props)
    }
    render () {
        return (
            <Text>{this.props.num}</Text>

        )
    }
}

export default class test extends Component {
    constructor(props){
        super(props)
    }
    render () {
        return (
            <View>
            <Text>111111111111111</Text>
            </View>

        )
    }

}
var styles = {

}
