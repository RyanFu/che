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
const { width, height } = Dimensions.get('window')



export default class extends Component {
    constructor (props) {
        super(props)
        this.state = {

        }
    }

    render () {
        return (
            <ScrollableTabView
                renderTabBar={() => <CustomTabBar pullDownOnPress={()=>{}}/>}
                tabBarBackgroundColor="rgb(22,131,251)"
                tabBarActiveTextColor="white"
                tabBarInactiveTextColor="rgba(255,255,255,0.5)"
                tabBarTextStyle={{fontSize: theme.scrollView.fontSize}}
                tabBarUnderlineStyle={theme.scrollView.underlineStyle}>
                <ScrollView tabLabel='商品' style={styles.center}>
                    <View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                    </View>
                </ScrollView>
                <ScrollView tabLabel='商品' style={styles.center}>
                    <View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                    </View>
                </ScrollView>
                <ScrollView tabLabel='商品' style={styles.center}>
                    <View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                        <View style={{height:150,backgroundColor:"#cccccc", margin:10}}></View>
                    </View>
                </ScrollView>
            </ScrollableTabView>
        )
    }
}
var styles = {

}
