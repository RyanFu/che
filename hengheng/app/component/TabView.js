/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component } from 'react'
import {
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
    DeviceEventEmitter,

    BackAndroid,
    ToastAndroid
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import TabNavigator from 'react-native-tab-navigator'
import Store from '../component/Store'
import px2dp from '../util'
let {width, height} = Dimensions.get('window')
import HomePage from '../pages/Home'
import theme from '../config/theme'
import My from '../pages/My'
import Cart from '../pages/cart'
export default class TabView extends Component {
  constructor(props){
    super(props)
    this.state = {
        currentTab: 'HomePage',
        hideTabBar: false
    }
    this.tabNames = [
      ["首页", "logo-google", "HomePage", <HomePage {...this.props}/>],
      ["门店", "ios-compass-outline", "Store", <Store {...this.props}/>],
      ["购物车", "ios-list-box-outline", "Cart", <Cart {...this.props}/>],
      ["我的", "ios-contact-outline", "My", <My {...this.props}/>]
    ]
    TabView.hideTabBar = TabView.hideTabBar.bind(this)
    TabView.showTabBar = TabView.showTabBar.bind(this)
  }

    componentDidMount() {
        if(this.props.type)
        {
            this.setState({
                currentTab:this.props.type
            })
        }
    }

  static showTabBar(time){
    this.setState({hideTabBar: false})
  }
  static hideTabBar(time){
    this.setState({hideTabBar: true})
  }
  render(){
    return (
      <TabNavigator
        hidesTabTouch={true}
        tabBarStyle={[styles.tabbar,
          (this.state.hideTabBar?styles.hide:{})
        ]}
        sceneStyle={{ paddingBottom: styles.tabbar.height }}>
          {
            this.tabNames.map((item, i) => {
              return (
                <TabNavigator.Item
                    key={i}
                    tabStyle={styles.tabStyle}
                    title={item[0]}
                    selected={this.state.currentTab === item[2]}
                    selectedTitleStyle={{color: theme.bkColor}}
                    renderIcon={() => <Icon name={item[1]} size={px2dp(22)} color="#666" />}
                    renderSelectedIcon={() => <Icon name={item[1].replace(/\-outline$/, "")} size={px2dp(22)} color={theme.bkColor} />}
                    onPress={() => {this.setState({ currentTab: item[2] });  DeviceEventEmitter.emit('cartrefresh',null);}}>
                    {item[3]}
                </TabNavigator.Item>
              )
            })
          }
      </TabNavigator>
    )
  }
}

const styles = StyleSheet.create({
    tabbar: {
      height: px2dp(46),
      alignItems:'center',
      justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)'
    },
    hide: {
      transform: [
        {translateX:width}
      ]
    },
    tabStyle:{
    }
})
