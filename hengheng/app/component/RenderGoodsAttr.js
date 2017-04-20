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
    ScrollView,
    TextInput,
    BackAndroid,
    ListView,
    InteractionManager,
} from 'react-native';
import px2dp from '../util/index';
import set from '../config/config';
let att = {}
export default class RenderGoodsAttr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            selectatt: {}
        }
    }
    componentDidMount() {
        var att = this.state.data;
        var next = 0
        for (var nk in att) {
            next = this.initatt(next)
        }
    }

    initatt(attr_id) {
        var att = this.state.data;
        var start = false;
        var nextid = 0;
        for (var key in att) {
            if (attr_id == 0) {
                start = true;
            }
            if (start) {
                var isfirst = true
                for (var ck in att[key]) {
                    if (att[key][ck].f_id == attr_id) {
                        att[key][ck].show = true;
                        if (isfirst) {
                            att[key][ck].selected = true;
                            if (parseInt(att[key][ck].islast) == 0) {
                                nextid = att[key][ck].attr_id
                            } else {
                                this.setState({
                                    selectatt: att[key][ck]
                                })
                                this.props.selectatt(att[key][ck])
                            }
                            isfirst = false;
                        } else {
                            att[key][ck].selected = false;
                        }
                    } else {
                        att[key][ck].show = false;
                        att[key][ck].selected = false;
                    }

                }

            }
            for (var k in att[key]) {
                if (att[key][k].attr_id == attr_id) {
                    start = true;
                }
            }

        }
        this.setState({
            data: att
        })
        return nextid
    }

    updateatt(attr_id) {
        var att = this.state.data;
        var start = false;
        var nextid = 0;
        for (var key in att) {
            if (start) {
                var isfirst = true
                for (var ck in att[key]) {
                    if (att[key][ck].f_id == attr_id) {
                        att[key][ck].show = true;
                        if (isfirst) {
                            att[key][ck].selected = true;
                            if (parseInt(att[key][ck].islast) == 0) {
                                nextid = att[key][ck].attr_id
                            } else {
                                this.setState({
                                    selectatt: att[key][ck]
                                })
                                this.props.selectatt(att[key][ck])
                            }

                            isfirst = false;
                        } else {
                            att[key][ck].selected = false;
                        }
                    } else {
                        att[key][ck].show = false;
                        att[key][ck].selected = false;
                    }

                }

            }
            for (var k in att[key]) {
                if (att[key][k].attr_id == attr_id) {
                    start = true;
                }
            }

        }
        this.setState({
            data: att
        })
        return nextid
    }

    setactive(ck, key) {

        var att = this.state.data;
        if (att[key][ck].selected) {
            return;
        }
        if (parseInt(att[key][ck].islast)==1 && parseInt(att[key][ck].stock)<1) {
            return;
        }
        for (var k in att[key]) {
            att[key][k].selected = false
        }
        att[key][ck].selected = true;

        this.setState({
            data: att
        })
        var next = att[key][ck].attr_id;
        for (var nk in att) {
            next = this.updateatt(next)
        }
        if (parseInt(att[key][ck].islast) == 1) {
            this.setState({
                selectatt: att[key][ck]
            })
            this.props.selectatt(att[key][ck])

        }

    }

    render() {
        att = this.state.data
        var thelist = [];
        for (var key in att) {
            var thechild = [];
            for (var ck in att[key]) {
                var style = {}
                if (att[key][ck].selected) {
                    style = styles.attlistactive
                } else {
                    style = styles.attlist
                }
                if(parseInt(att[key][ck].islast)==1 && parseInt(att[key][ck].stock) < 1)
                {
                    style = styles.attlistdisable
                }
                if (att[key][ck].show) {

                    thechild.push(<Text key={att[key][ck].id} style={style}
                                        onPress={this.setactive.bind(this, ck, key)}
                    >{att[key][ck].name}</Text>)
                }
            }

            thelist.push(
                <View key={key} style={styles.attlistview}>
                    <View style={{width: 40}}>
                        <Text>
                            {key}:
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
                        {thechild}
                    </View>

                </View>
            )
        }
        return (<View>
            <View style={{
                flexDirection: 'row',
                borderBottomWidth: px2dp(1),
                borderBottomColor: '#cccccc',
                height: px2dp(70),

                paddingLeft: px2dp(10),
                paddingRight: px2dp(10),
            }}>

                <View style={{width: px2dp(80)}}/>
                <View style={{padding: px2dp(5)}}>
                    <View>
                        <Text style={{color: "#e83e41", fontSize: px2dp(16)}}>
                            <Text style={{fontSize: px2dp(12)}}>
                                ￥
                            </Text>
                            {this.state.selectatt.price}
                        </Text>
                    </View>
                    <View style={{marginTop: px2dp(5)}}>
                        <Text style={{fontSize: px2dp(12)}}>
                            己选：{this.state.selectatt.f_name}
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView
                style={{backgroundColor: "#ffffff", paddingBottom: px2dp(10),height:px2dp(140)}}
            >
                <View style={{
                    paddingTop: px2dp(5), paddingBottom: px2dp(5),
                    backgroundColor: "#ffffff",
                    paddingLeft: px2dp(10),
                    paddingRight: px2dp(10),

                }}>
                    <View style={{paddingTop: px2dp(5), paddingBottom: px2dp(5)}}>
                        {thelist}
                    </View>
                </View>
            </ScrollView>
        </View>)


    }
}

const styles = StyleSheet.create({
    attlistdisable: {
        borderColor: "#cccccc", borderWidth: 1, paddingHorizontal: px2dp(5),
        paddingVertical: px2dp(3), borderRadius: px2dp(5), margin: px2dp(5),
        color: "#cccccc"

    },
    attlistactive: {
        borderColor: "#ea3524", borderWidth: 1, paddingHorizontal: px2dp(5),
        paddingVertical: px2dp(3), borderRadius: px2dp(5), margin: px2dp(5),
        color: "#ea3524"

    },
    attlist: {
        borderColor: "#cccccc", borderWidth: 1, paddingHorizontal: px2dp(5),
        paddingVertical: px2dp(3), borderRadius: px2dp(5), margin: px2dp(5)

    },
    attlistview: {
        flexDirection: 'row',
        alignItems: "center",
        flexWrap: "wrap",
        paddingVertical: px2dp(5),
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1
    },
});
