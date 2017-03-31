/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  AlertIOS,
  RefreshControl,
  TouchableHighlight,
  TouchableNativeFeedback
} from 'react-native'
import px2dp from '../util'
import LocalImg from '../images'
import Button from '../component/Button'
import Icon from 'react-native-vector-icons/Ionicons'
import set from '../config/config'
import StarRating from 'react-native-star-rating';

export default class Comments extends Component {
  constructor(props){
      super(props);
      this.state = {
          starCount: 2.5
      };
  }
  renderTags(){
    return ["全部|2864", "满意|4397", "不满意|285", "有图|28", "洗车快|19", "服务好|213", "干净|431", "服务不错|1384"]
      .map((item, i) => {
        let varb = item.split("|")
        return (
          <View key={i} style={{marginTop: 10, marginRight: 10, backgroundColor: "#fff", borderRadius: 5, overflow: "hidden"}}>
            <Button onPress={()=>{}}>
              <View style={styles.tag}>
                <Text style={{fontSize:px2dp(13), color:"#333"}}>{`${varb[0]}(${varb[1]})`}</Text>
              </View>
            </Button>
          </View>
        )
      })
  }
    renderComments() {
        let scale = 1 / 5 * 55
        return [
            {
                avatar: {url: set.baseurl + '/data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。服务态度超一流，像五星级酒店11111111111",
                tag: "洗得不错"
            },{
                avatar: {url: set.baseurl + '/data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。",
                tag: "洗得不错"
            },{
                avatar: {url: set.baseurl + '/data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。",
                tag: "洗得不错"
            },{
                avatar: {url: set.baseurl + '/data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。",
                tag: "洗得不错"
            },{
                avatar: {url: set.baseurl + '/data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。",
                tag: "洗得不错"
            }]
            .map((item, i) => {
                let scale = item.scores / 5 * 55
                return (
                    <View key={i} style={{
                        borderTopWidth: 1,
                        borderTopColor: "#f9f9f9",
                        paddingVertical: 14,
                        paddingRight: 10,
                        paddingLeft: 10,
                        backgroundColor: "#ffffff"
                    }}>
                      <View style={{flexDirection: "row"}}>
                        <View style={styles.uinfo}>
                          <Image source={item.avatar} style={{width: 40, height: 40, borderRadius: 20}}/>
                          <View style={{marginLeft: 5}}>
                            <Text style={{
                                fontSize: px2dp(13),
                                color: "#333",
                                paddingBottom: 5
                            }}>{item.name}</Text>
                            <View style={{height: 10}}>

                              <StarRating
                                  starSize={px2dp(10)}
                                  disabled={true}
                                  starStyle={{marginLeft: px2dp(3)}}
                                  maxStars={5}
                                  rating={this.state.starCount}
                                  selectedStar={(rating) => {
                                  }}
                                  starColor={'#e83e41'}
                              />

                            </View>
                          </View>
                        </View>
                        <View style={{flex: 1, alignItems: "flex-end"}}>
                          <Text style={{fontSize: px2dp(13), color: "#999"}}>{item.time}</Text>
                        </View>
                      </View>
                      <View style={{paddingLeft: px2dp(45)}}>
                        <Text style={{fontSize: px2dp(13), color: "#333"}}>{item.content}</Text>
                        <View style={{flexDirection: "row", marginTop: 10}}>
                          <Image source={item.avatar} style={{width: 70, height: 70,marginLeft:5}}/>
                          <Image source={item.avatar} style={{width: 70, height: 70,marginLeft:5}}/>
                          <Image source={item.avatar} style={{width: 70, height: 70,marginLeft:5}}/>
                          <Image source={item.avatar} style={{width: 70, height: 70,marginLeft:5}}/>
                        </View>
                      </View>
                    </View>
                )
            })
    }
  render(){
    let scale1 = 4.5/5*55
    let scale2 = 4.6/5*55
    return (
      <View style={{flex: 1,backgroundColor:'#f0f0f0'}}>
        <ScrollView style={{ flex: 1}}>
        <View style={{
          paddingBottom: this.props.headHeight + px2dp(46)
        }}>
          <View style={styles.source}>
            <View style={[styles.center,{width:140, borderRightWidth: 1, borderRightColor: "#f1f1f1"}]}>
              <Text style={{fontSize: 18, color: "#ff6000", fontWeight:"bold"}}>{4.5}</Text>
              <Text style={{fontSize: px2dp(13),color: "#333", paddingVertical: 3}}>{"综合评分"}</Text>
              <Text style={{fontSize: px2dp(13),color: "#999", paddingVertical: 3}}>{"高于周边商家57%"}</Text>
            </View>
            <View style={[styles.center,{flex: 1}]}>
              <View style={{flexDirection:"row", justifyContent:"center", alignItems: "center"}}>
                <Text style={{fontSize: px2dp(13),color: "#333", paddingVertical: 3}}>{"服务态度"}</Text>
                <View style={{height: 10, marginHorizontal: 10}}>
                  <Image source={LocalImg.star2} style={{height: 10, width: 55}}/>
                  <View style={{height: 10, position:"absolute", left:0, top:0, width: scale1, overflow:"hidden"}}>
                    <Image source={LocalImg.star1} style={{height: 10, width: 55}}/>
                  </View>
                </View>
                <Text style={{fontSize: px2dp(14),color: "#ff6000"}}>{"4.5"}</Text>
              </View>
              <View style={{flexDirection:"row", justifyContent:"center", alignItems: "center"}}>
                <Text style={{fontSize: px2dp(13),color: "#333", paddingVertical: 3}}>{"商品评分"}</Text>
                <View style={{height: 10, marginHorizontal: 10}}>
                  <Image source={LocalImg.star2} style={{height: 10, width: 55}}/>
                  <View style={{height: 10, position:"absolute", left:0, top:0, width: scale2, overflow:"hidden"}}>
                    <Image source={LocalImg.star1} style={{height: 10, width: 55}}/>
                  </View>
                </View>
                <Text style={{fontSize: px2dp(14),color: "#ff6000"}}>{"4.6"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.tags}>
              {this.renderTags()}
            </View>
            <View style={{paddingLeft: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center"}}>
              <Icon name="ios-checkmark-circle" size={px2dp(20)} color="#4cd964" />
              <Text style={{fontSize: px2dp(13),color: "#333", marginLeft: 3}}>{"只看有内容的评论"}</Text>
            </View>
            <View>
              {this.renderComments()}
            </View>
          </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tags: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    paddingBottom: 10,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9"
  },
  uinfo: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  tag: {
    backgroundColor:"#ebf5ff",
    paddingHorizontal: 6,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  source: {
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    backgroundColor: "#fff",
    marginTop: 10,
    paddingVertical: 10
  }
})
