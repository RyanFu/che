import React, {Component} from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    ListView,
    Platform,
    PixelRatio,
    RefreshControl,
    ScrollView,
    InteractionManager,
    Dimensions,
    StyleSheet,
} from 'react-native';
import px2dp from '../util/index'
import set from '../config/config';
import request from '../lib/request'
import Icon from 'react-native-vector-icons/Ionicons'
import StarRating from 'react-native-star-rating';
const {width, height} = Dimensions.get('window')
import Swiper from 'react-native-swiper';
export default class GoodsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: true,
            isRefreshing: false,
            goods:this.props.goods
        }
    }

    shouldComponentUpdate(newProps, newState) {
        if (this.state.reload) {
            this.setState({
                reload: false
            })
            return true;
        }
        return false;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(this._onRefresh())

    }
    _onRefresh() {
        if (!this.state.isRefreshing) {
            this.setState({
                isRefreshing: true,
            })
            var databody={
                id:this.props.goods.id
            }
            request.get(set.baseurl+set.interface.getgoodsinfo,databody).then((data)=>{
                if(parseInt(data.status)==0)
                {
                    this.setState({
                        isRefreshing: false,
                    })
                }

            }).catch((err)=>{
                alert("网络错误");
            })


        }

    }
    renderComments() {
        return [
            {
                avatar: {uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。服务态度超一流，像五星级酒店11111111111",
                tag: "洗得不错"
            }, {
                avatar: {url: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。",
                tag: "洗得不错"
            }, {
                avatar: {uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。",
                tag: "洗得不错"
            }, {
                avatar: {uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'},
                name: "_平***空",
                scores: 1,
                time: "2017-01-01",
                content: "洗得又快又好。。",
                tag: "洗得不错"
            }, {
                avatar: {uri: set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'},
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

                                <TouchableWithoutFeedback style={{flexDirection: "row", marginTop: 10}}
                                                          onPress={this.props.showViewer.bind(this)}>
                                    <Image source={item.avatar} style={{width: 70, height: 70, marginLeft: 5}}/>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback style={{flexDirection: "row", marginTop: 10}}
                                                          onPress={() => this.setState({
                                                              imgList: [
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'
                                                              ],
                                                              showViewer: true,
                                                          })}>
                                    <Image source={item.avatar} style={{width: 70, height: 70, marginLeft: 5}}/>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback style={{flexDirection: "row", marginTop: 10}}
                                                          onPress={() => this.setState({
                                                              imgList: [
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'
                                                              ],
                                                              showViewer: true,
                                                          })}>
                                    <Image source={item.avatar} style={{width: 70, height: 70, marginLeft: 5}}/>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback style={{flexDirection: "row", marginTop: 10}}
                                                          onPress={() => this.setState({
                                                              imgList: [
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                                                                  set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'
                                                              ],
                                                              showViewer: true,
                                                          })}>
                                    <Image source={item.avatar} style={{width: 70, height: 70, marginLeft: 5}}/>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                )
            })
    }
    renderSwiper(){
        content=[];
        this.state.goods.thumbs.map((item,i)=>{
            content.push(
                <Image
                    key={i}
                    style={{flex:1}}
                    source={{uri:set.baseurl+"data/upload/"+item}}
                />
            )
        })
        return content;
    }

    render() {
        return (
            <ScrollView style={styles.center} showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor="#ea3524"
                                colors={['#ddd', '#e83e41']}
                                progressBackgroundColor="#ffffff"
                            />
                        }
            >
                <View >
                    <Swiper height={240} autoplay={true}>

                        {this.renderSwiper()}
                    </Swiper>
                </View>
                <View style={styles.goodstitle}>
                    <Text style={{color: '#333333',fontSize:px2dp(14)}}>
                        【{this.state.goods.class_name}】{this.state.goods.name}
                    </Text>
                    <Text numberOfLines={2} style={{paddingHorizontal:px2dp(8),color:"#333333", marginVertical:px2dp(5),fontSize:px2dp(12)}}>
                        {this.state.goods.title}
                    </Text>
                    <View style={styles.goodslable}>
                        <View style={styles.goodslablesgroup}>
                            <Text style={styles.goodslables}>
                                特价商品
                            </Text>
                        </View>
                        <Text style={styles.goodslables}>
                            特价商品
                        </Text>
                        <Text style={styles.goodslables}>
                            特价商品
                        </Text>
                        <Text style={styles.goodslables}>
                            特价商品
                        </Text>
                    </View>
                    <View style={styles.goodspricelable}>
                        <View style={styles.goodspricelableleft}>
                            <Text style={styles.goodspricetype}>
                                ￥
                            </Text>
                            <Text style={styles.goodsprice}>
                                {this.state.goods.prices}
                            </Text>
                            <Text style={styles.goodsmallnum}>
                                己有{this.state.goods.sales}人购买
                            </Text>
                        </View>
                        <View style={styles.goodscollect}>
                            <Text>
                                收藏
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{alert("a")}} style={styles.goodsattr}>
                    <View style={styles.goodsattrleft}>
                        <Text style={{color: "#bbbbbb", fontSize: px2dp(11)}}>
                            己选：
                        </Text>
                        <Text style={{color: "#333333", fontSize: px2dp(12)}}>
                            标配，"1件"
                        </Text>
                    </View>
                    <View>
                        <Icon name="ios-arrow-forward-outline" size={px2dp(18)} color="#bbbbbb"/>
                    </View>
                </TouchableOpacity>

                <View style={styles.goodsattr}>
                    <View style={styles.goodsattrleft}>
                        <Text style={{color: "#333333", fontSize: px2dp(11)}}>
                            用户评论
                        </Text>
                        <View style={{paddingLeft: px2dp(10), paddingRight: px2dp(10)}}>
                            <StarRating
                                starSize={px2dp(12)}
                                disabled={true}
                                starStyle={{marginLeft: px2dp(3)}}
                                maxStars={5}
                                rating={this.state.starCount}
                                selectedStar={(rating) => {
                                }}
                                starColor={'#e83e41'}
                            />
                        </View>

                        <Text style={{color: "#bbbbbb", fontSize: px2dp(11)}}>
                            {this.state.starCount}分
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: px2dp(11), color: "#aaaaaa"}}>
                            331人评论
                        </Text>
                        <Icon style={{marginLeft: px2dp(10)}} name="ios-arrow-forward-outline"
                              size={px2dp(18)}
                              color="#bbbbbb"/>
                    </View>
                </View>
                <View style={styles.comment}>
                    {this.renderComments()}
                </View>
            </ScrollView>

        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "#333333"
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    photo: {
        width,
        height,
        flex: 1,
        backgroundColor: "#333333"
    },
    imgtext: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    thumbWrap: {
        marginTop: 100,
        borderWidth: 5,
        borderColor: 'rgba(0,0,0,0.3)',
        flexDirection: 'row'
    },
    thumb: {
        width: 50,
        height: 50
    },
    modal: {
        height: 350,
        position: 'relative',
        backgroundColor: "rgba(0,0,0,0)"

    },

    source: {
        borderTopWidth: 1,
        borderTopColor: "#f1f1f1",
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 16
    },
    c_center: {
        justifyContent: "center",
        alignItems: "center"
    },
    c_content: {
        backgroundColor: "#fff",
        marginTop: 10,
        paddingVertical: 10
    },
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
    tag: {
        backgroundColor: "#ebf5ff",
        paddingHorizontal: 6,
        paddingVertical: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    uinfo: {
        flexDirection: "row",
        alignItems: "flex-start"
    },
    cartBar: {
        overflow: "hidden",
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        height: px2dp(40),
        borderTopWidth: px2dp(1),
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff'

    },
    goodsattrleft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goodsattr: {
        height: px2dp(35),
        backgroundColor: "#ffffff",
        marginTop: px2dp(8),
        justifyContent: 'space-between',
        padding: px2dp(8),
        flexDirection: 'row',
    },
    goodspricelableleft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goodscollect: {
        borderLeftWidth: px2dp(1),
        borderColor: "#cccccc",
        padding: px2dp(5)
    },
    goodsmallnum: {
        marginLeft: px2dp(10),
        fontSize: px2dp(11),
    },
    goodspricelable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    goodsprice: {
        color: '#e83e41',
        fontSize: px2dp(16),
        justifyContent: 'flex-end',
        alignItems: 'center',

    },
    goodspricetype: {
        color: '#e83e41',
        fontSize: px2dp(11),
    },
    goodslables: {
        fontSize: px2dp(11),
        color: '#e83e41',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: px2dp(5),
        padding: px2dp(2),
        borderColor: '#e83e41',
        borderRadius: px2dp(3),
        borderWidth: (Platform.OS === 'ios' ? 1.0 : 1.5) / PixelRatio.get(),


    },
    goodslable: {
        flexDirection: 'row',
        padding: px2dp(5),
        marginTop: px2dp(3),
        marginBottom: px2dp(3),
    },
    goodstitle: {
        padding: px2dp(8),
        backgroundColor: "#ffffff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fbfbfb",
        flexDirection: 'row'
    },
    center: {
        backgroundColor: '#eeeeee'
    },

    text: {
        color: '#fff',
        fontSize: px2dp(30),
        fontWeight: 'bold',
    }

})
