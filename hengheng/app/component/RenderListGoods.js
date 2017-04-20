/**
 * Created by liaopeng on 17/4/1.
 */
'use strict';
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    AsyncStorage,
    DeviceEventEmitter,
    PixelRatio,
    Platform,
    TouchableOpacity,
    Image,
    TextInput,
    BackAndroid,
    ListView,
    InteractionManager,
} from 'react-native';
import px2dp from '../util/index';
import set from '../config/config';
export default class RenderListGoods extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableOpacity onPress={()=>{this.props.jp(this.props.db)}}>
                <View style={{flexDirection: 'row', backgroundColor:"#ffffff",paddingVertical:px2dp(10)}}>
                    <View style={{flex: 1, padding: px2dp(5)}}>
                        <Image source={{uri: set.baseurl + 'data/upload/' + this.props.db.thumb}}
                               style={{width: px2dp(90), height: px2dp(90)}}/>
                    </View>
                    <View style={{flex: 3, paddingHorizontal: px2dp(20), paddingVertical: px2dp(5), borderBottomColor:"#f0f0f0",
                        borderBottomWidth:1
                    }}>
                        <Text style={{color:"#333333",marginBottom:px2dp(5)}} numberOfLines={1}>{this.props.db.name}</Text>
                        <Text style={{color:"#555555",fontSize:px2dp(12), marginBottom:px2dp(5)}} numberOfLines={2}>{this.props.db.title}</Text>
                        <Text style={{color:"#ea3524",fontSize:px2dp(14), fontWeight:"bold",marginBottom:px2dp(5)}}>￥<Text style={{fontSize:px2dp(16)}}>{this.props.db.prices}</Text></Text>
                        <View style={{flexDirection:"row",}}>
                            <Text style={{fontSize:px2dp(11),color:"#999999",marginBottom:px2dp(5)}}>销量：{this.props.db.sales}</Text>
                            <Text style={{fontSize:px2dp(11),color:"#999999",marginLeft:px2dp(20)}}>评价:{this.props.db.comment_num}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

});
