/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component } from 'react'
import {
  Text,
  View,
  BackAndroid,
  ScrollView,
  StyleSheet,
  AlertIOS,
  RefreshControl,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableHighlight,
  Image,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Animated,
    ToastAndroid
} from 'react-native'
import LocalImg from '../images'
import px2dp from '../util'
import Icon from 'react-native-vector-icons/Ionicons'
import Swiper from 'react-native-swiper'
import SplashScreen from 'react-native-splash-screen'
import LbsModal from '../component/LbsModal'
import data from '../data'
import Login from './Login'
import Goods from './Goods'
import test from './test'
const isIOS = Platform.OS == "ios"
const { width, height } = Dimensions.get('window')
const headH = px2dp(isIOS?140:120)
const InputHeight = px2dp(28)


export default class HomePage extends Component {
  constructor(props){
      super(props)
      this.state = {
        location: "吉首",
        scrollY: new Animated.Value(0),
        searchView: new Animated.Value(0),
        modalVisible: false,
        searchBtnShow: true,
        listLoading: false,
        isRefreshing: false
      }

  }
  login(){
    this.props.navigator.push({
      component:test,
        args:{}
    })
  }
    componentDidMount(){
        SplashScreen.hide()
        BackAndroid.addEventListener('hardwareBackPress', function () {
            BackAndroid.exitApp(0)
            return true
        })
    }


  openLbs(){
    this.setState({modalVisible: true})
  }
  changeLocation(location){
    this.setState({location})
  }


  _onRefresh(){
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 2000)
  }
  render(){
    return (
      <View style={{flex: 1, backgroundColor: "#eeeeee"}}>
          <View style={{backgroundColor:"#e83e41",height:Platform.OS === 'ios' ? 64 : 42,
              flexDirection:"row",justifyContent:"space-between", alignItems:"flex-end",paddingBottom:px2dp(10)
          }}>
              <View style={{flexDirection:"row", paddingLeft:px2dp(5), alignItems:"center",flex:1}}>
                  <Icon name="ios-pin" size={px2dp(12)} color={"#ffffff"}/>
                  <Text style={{color:"#ffffff",marginHorizontal:px2dp(3),fontSize:px2dp(14)}}>吉首</Text>

              </View>
              <View style={{flexDirection:"row",  alignItems:"center",flex:1,justifyContent:"center"}}>
                  <Text style={{color:"#ffffff",marginHorizontal:px2dp(3),fontSize:px2dp(16),fontWeight:'bold'}}>亨亨养车</Text>

              </View>
              <View style={{flexDirection:"row", paddingRight:px2dp(5), alignItems:"center",flex:1,justifyContent:"flex-end"}}>

                  <Icon name="ios-person" size={px2dp(18)} color={"#ffffff"}/>

              </View>

          </View>


        <ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              colors={['#ddd', '#0398ff']}
              progressBackgroundColor="#ffffff"
            />
          }
        >
            <Swiper height={160} autoplay={true}>
                <View style={{flex: 1,backgroundColor:"#0398ff"}}>
                    <Text style={styles.text}>第一张</Text>
                </View>
                <View style={{flex: 1,backgroundColor:"#0398ff"}}>
                    <Text style={styles.text}>第二张</Text>
                </View>
                <View style={{flex: 1,backgroundColor:"#0398ff"}}>
                    <Text style={styles.text}>第三张</Text>
                </View>
            </Swiper>
            <View style={{height:px2dp(35),marginTop:px2dp(8), backgroundColor:"#ffffff",
                flexDirection:"row",justifyContent:"space-between", alignItems:"center"

            }}>
                <View style={{flex:1,paddingVertical:px2dp(3),borderRightWidth:1,borderRightColor:"#d0d0d0",paddingLeft:px2dp(5)}}>
                <Text>离我最近</Text>
                </View>
                <View style={{flex:3,paddingLeft:px2dp(5)}}>
                    <Text>吉首高速路口店</Text>
                </View>
                <View style={{flex:1, alignItems:"flex-end", paddingHorizontal:px2dp(5),justifyContent:"center"}}>
                    <View style={{backgroundColor:"#e83e41", borderRadius:px2dp(5),justifyContent:"center",
                        alignItems:"center",
                        paddingHorizontal:px2dp(5),
                        paddingVertical:px2dp(3)
                    }}>
                    <Text style={{color:"#ffffff",fontSize:px2dp(12)}}>马上去>></Text>
                    </View>
                </View>

            </View>


        </ScrollView>
        <LbsModal
          modalVisible={this.state.modalVisible}
          location={this.state.location}
          setLocation={this.changeLocation.bind(this)}
          closeModal={(()=>this.setState({modalVisible: false})).bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#e83e41",
    height: headH,
    paddingTop: px2dp(isIOS?30:10),
    paddingHorizontal: 16
  },
  typesView: {
    paddingBottom: 10,
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  typesItem: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  lbsWeather: {
    height: InputHeight,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  placeholder: {
    height: InputHeight,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    borderRadius: px2dp(14),
    backgroundColor: "#fff",
    alignItems: "center"
  },
  lbs: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  weather: {
    flexDirection: "row",
    alignItems: "center"
  },
  textInput:{
    flex: 1,
    fontSize: 13,
    paddingLeft: 10,
    paddingRight: 10,
    height: InputHeight,
    borderRadius: px2dp(14),
    backgroundColor: "#fff"
  },
  searchHeadBox: {
    height: InputHeight,
    flexDirection: "row",
    alignItems: "center"
  },
  searchBtn: {
    borderRadius: InputHeight,
    height: InputHeight,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  keywords: {
    marginTop: px2dp(14),
    flexDirection: "row"
  },
  scrollView: {
    marginBottom: px2dp(46)
  },
  recom: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 10,
    flexWrap: "wrap"
  },
  card: {
    backgroundColor: "#fff",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  business: {
    backgroundColor: "#fff",
    marginTop: 10,
    paddingVertical: 16
  },
  time: {
    paddingHorizontal: 3,
    backgroundColor: "#333",
    fontSize: px2dp(11),
    color: "#fff",
    marginHorizontal: 3
  },
  recomItem: {
    width: width/2,
    height: 70,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row"
  },
  recomWrap: {
    flex: 1,
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  lTimeScrollView: {
  },
  lTimeList: {
    backgroundColor:"#fff",
    alignItems: "center"
  },
  qtag: {
    fontSize: 12,
    borderWidth: 1,
    color: "#00abff",
    borderColor: "#00abff",
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 5
  },
  gift: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff"
  },
  fixSearch: {
    backgroundColor: "#0398ff",
    height: isIOS ? 64 : 42,
    paddingTop: isIOS ? 20 : 0,
    paddingHorizontal: 16,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0
  }
})
