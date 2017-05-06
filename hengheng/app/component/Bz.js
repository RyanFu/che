/**
 * @author LiaoPeng
 *
 */
'use strict';


import React, { Component, PropTypes } from 'react'
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  TouchableNativeFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import LocalImg from '../images'
import px2dp from '../util'
import set from '../config/config'
import Button from './Button'

export default class Bz extends Component {
  constructor(props){
      super(props)
  }
  static propTypes = {
      name: PropTypes.string.isRequired, // 商家名
      logo: PropTypes.number.isRequired, // 商家logo
      isBrand: PropTypes.bool,
      scores: PropTypes.number, //商家评分
      sale: PropTypes.number, //月销售量
      bao: PropTypes.bool, // 保计划
      piao: PropTypes.bool, // 票
      ontime: PropTypes.bool, // 准时
      fengniao: PropTypes.bool, // 蜂鸟专送
      startPay: PropTypes.string, // 起送费
      deliverPay: PropTypes.string, // 配送费
      evOnePay: PropTypes.string, // 费用/人
      journey: PropTypes.string, // 路程
      time: PropTypes.string, // 送餐时间
      activities: PropTypes.array,
      onPress: PropTypes.func
  }
  renderActivities(){
    let color = {
      "减": "#f07373",
      "特": "#f1884f",
      "新": "#73f08e"
    }
    let {activities} = this.props
    if(!activities || !activities.length){
      return null
    }else{
      return (
        <View style={styles.actives}>
          {
            activities.map((item, i) => {
              return (
                <View key={i} style={{flexDirection: "row", marginTop: 5}}>
                  <Text style={{fontSize: px2dp(11), color: "#fff", backgroundColor: color[item.key] || "#f1884f", paddingHorizontal: 1, paddingVertical: 1}}>{item.key}</Text>
                  <Text numberOfLines={1} style={{fontSize: px2dp(11), marginLeft:3, color: "#666"}}>{item.text}</Text>
                </View>
              )
            })
          }
        </View>
      )
    }
  }
  render(){
    return (
      <Button onPress={()=>{}}>
        <View style={styles.bzWrap}>
          <View style={styles.border}>
            <Image source={{uri:set.baseurl+this.props.thumb}}/>
            <View style={styles.bzContent}>
              <View style={styles.between}>
                <View style={{flexDirection: "row", flex: 1}}>
                  <Text numberOfLines={1} style={styles.name}>{}</Text>
                  <Text style={{marginLeft:px2dp(20)}}>{this.props.desc}</Text>
                </View>


              </View>

            </View>
          </View>
        </View>
      </Button>
    )
  }
}


const styles = StyleSheet.create({
  bzWrap: {
    backgroundColor: "#fff",
    paddingLeft: 10
  },
  border: {
    flexDirection: "row",
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5"
  },
  bzBox: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingRight: 10,
    borderTopWidth: 1,
    borderTopColor: "#f9f9f9"
  },
  bzLogo: {
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#f9f9f9",
    width: px2dp(60),
    height: px2dp(60)
  },
  bzContent: {
    marginLeft: 6,
    marginRight: 10,
    flex: 1
  },
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 3
  },
  brand: {
    fontSize: 12,
    color: "#52250a",
    paddingHorizontal: 3,
    paddingVertical: 2,
    backgroundColor: "#ffdc37"
  },
  label: {
    fontSize: 10,
    color: "#999",
    borderWidth: 1,
    borderColor: "#eee",
    textAlign: "center",
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderRadius: 3
  },
  label1: {
    fontSize: 10,
    color: "#e83e41",
    borderWidth: 1,
    borderColor: "#e83e41",
    textAlign: "center",
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderRadius: 3
  },
  label2: {
    fontSize: 10,
    color: "#fff",
    backgroundColor: "#e83e41",
    textAlign: "center",
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  line: {
    fontSize: px2dp(11),
    color: "#999",
    paddingHorizontal: 3
  },
  infoText: {
    fontSize: px2dp(11),
    color: "#666"
  },
  actives: {
    paddingTop: 4,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f9f9f9"
  }
})
