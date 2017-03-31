/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
    ActivityIndicator,
} from 'react-native'
import NavBar from '../component/NavBar'
import data from '../data'
import Bz from '../component/Bz'
import DetailPage from './DetailPage'
import MyWebView from '../component/MyWebView'

export default class Discover extends Component {
  constructor(props){
      super(props)
      this.state = {
          listLoading: false
      }
  }
  render(){
    return (
      <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
        <NavBar title="门店"/>
          {/*<MyWebView
          source={{uri: 'https://www.duiba.com.cn/chome/index?spm=14695.1.1.1'}}
          domStorageEnabled={true}
          javaScriptEnabled={true}
        />*/}
          <View style={styles.business}>
              {this._renderBZ()}
              <ActivityIndicator style={{marginTop: 10}} animating={this.state.listLoading}/>
          </View>
      </View>
    )
  }
    _renderBZ(){
        return data.list.map((item, i) => {
            item.onPress = () => {
                this.props.navigator.push({
                    component: DetailPage,
                    args: {}
                })
            }
            return (<Bz {...item} key={i}/>)
        })
    }
}


const styles = StyleSheet.create({
  webview_style: {
    flex: 1
  }
})
