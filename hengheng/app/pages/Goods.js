/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, {Component} from 'react'
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    ScrollView,
    Animated,
    AlertIOS,
    Platform,
    findNodeHandle,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackAndroid,
    PixelRatio,
    TextInput,
    WebView,

} from 'react-native'
import ScrollableTabView, {DefaultTabBar,}from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons'
import px2dp from '../util/index'
import theme from '../config/theme';
import GoodsDetail from '../component/GoodsDetail'
import CustomTabBar from '../component/CustomTabBar';
import Swiper from 'react-native-swiper';
import set from '../config/config';
import Comments from './Comments'
import Modal from 'react-native-modalbox';
import PhotoView from 'react-native-photo-view'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
let {width, height} = Dimensions.get('window')
const renderPagination = (index, total, context) => {
    return (
        <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            top: 25,
            left: 0,
            right: 0
        }}>
            <View style={{
                borderRadius: 7,
                backgroundColor: 'rgba(255,255,255,.15)',
                padding: 3,
                paddingHorizontal: 7
            }}>
                <Text style={{
                    color: '#fff',
                    fontSize: 14
                }}>{index + 1} / {total}</Text>
            </View>
        </View>
    )
}

const Viewer = props => <Swiper index={props.index} style={styles.wrapper} renderPagination={renderPagination}>
    {
        props.imgList.map((item, i) => <View key={i} style={styles.slide}>

            <PhotoView
                onTap={props.pressHandle}
                source={{uri: item}}
                resizeMode='contain'
                minimumZoomScale={0.5}
                maximumZoomScale={3}
                androidScaleType='center'
                style={styles.photo}/>

        </View>)
    }
</Swiper>
export default class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: 2.5,
            modelmargin: new Animated.Value(1),
            num: 0,
            select: null,
            imgList: [
                'https://avatars3.githubusercontent.com/u/533360?v=3&s=466',
                'https://assets-cdn.github.com/images/modules/site/business-hero.jpg',
                'https://placeholdit.imgix.net/~text?txtsize=29&txt=350%C3%971150&w=350&h=1150'
            ],
            showViewer: false,
            showIndex: 0
        };
        this.viewerPressHandle = this.viewerPressHandle.bind(this)
        this.thumbPressHandle = this.thumbPressHandle.bind(this)
        this._handleTabNames = this._handleTabNames.bind(this);

    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    componentDidMount() {


        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }


    handleBack = () => {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }

    _handleTabNames(tabNames) {
        this.setState({tabNames: tabNames});
    }

    _pullDownCallback() {

    }

    addtocart() {
        Animated.timing(
            this.state.modelmargin,//初始值
            {toValue: 0.9}//结束值
        ).start();//开始
        this.refs.modal.open()

    }


    onSelect(index, value) {
        this.setState({
            select: index,
        })
        alert(index);
    }

    closebtn() {
        this.refs.modal.close();
        this.hidemodel();
    }

    hidemodel() {
        Animated.timing(
            this.state.modelmargin,//初始值
            {toValue: 1}//结束值
        ).start();//开始
    }

    decreasenum() {
        if (this.state.num > 0) {
            this.setState({
                num: this.state.num - 1
            })
        }
    }
    showViewer(){
        this.setState({
            imgList: [
                set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg',
                set.baseurl + 'data/upload/avatar/15_thumb_1488773131.jpg'
            ],
            showViewer: true,
        })

    }


    addnum() {
        this.setState({
            num: this.state.num + 1
        })
    }

    viewerPressHandle() {

        this.setState({
            showViewer: false
        })
    }

    thumbPressHandle(i) {

        this.setState({
            showIndex: i,
            showViewer: true
        })
    }

    render() {
        let props = Platform.OS === 'ios' ? {
                blurType: "dark",
                blurAmount: 0
            } : {
                viewRef: 0,
                downsampleFactor: 10,
                overlayColor: 'rgba(255,255,255,.1)'
            }
        return (
            <View style={styles.container}>
                {this.state.showViewer && <Viewer
                    index={this.state.showIndex}
                    pressHandle={this.viewerPressHandle}
                    imgList={this.state.imgList}/>}

                <Animated.View style={{flex:1,transform: [{scale:this.state.modelmargin}]}}>
                    <ScrollableTabView
                        renderTabBar={() => <CustomTabBar pullDownOnPress={this.handleBack.bind(this)}/>}
                        tabBarBackgroundColor="rgb(22,131,251)"
                        tabBarActiveTextColor="white"
                        tabBarInactiveTextColor="rgba(255,255,255,0.5)"
                        tabBarTextStyle={{fontSize: theme.scrollView.fontSize}}
                        tabBarUnderlineStyle={theme.scrollView.underlineStyle}>
                        <GoodsDetail tabLabel='商品' showViewer={this.showViewer.bind(this)} />

                        <WebView tabLabel="详情"
                                 ref={'webview'}
                                 automaticallyAdjustContentInsets={false}
                                 style={styles.webView}
                                 source={{uri: 'https://m.baidu.com'}}
                                 javaScriptEnabled={true}
                                 domStorageEnabled={true}
                                 decelerationRate="normal"
                                 startInLoadingState={true}
                        />
                        <Comments tabLabel="评价"/>

                    </ScrollableTabView>
                    <View style={styles.cartBar}>
                        <View style={{flex: 1, flexDirection: 'row',}}>
                            <View style={{
                                flex: 1,
                                height: px2dp(36),
                                justifyContent: "center",
                                borderRightWidth: 1,
                                borderRightColor: "#cccccc"
                            }}>
                                <Text style={{textAlign: 'center'}}>
                                    <Icon name="ios-ionitron-outline" size={px2dp(25)} color="#666666"
                                          style={{textAlign: 'center'}}/>
                                </Text>
                            </View>
                            <View style={{
                                flex: 1,
                                height: px2dp(36),
                                justifyContent: "center",
                                borderRightWidth: 1,
                                borderRightColor: "#cccccc"
                            }}>
                                <Icon name="ios-cart-outline" size={px2dp(25)} color="#666666"
                                      style={{textAlign: 'center'}}/>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.addtocart.bind(this)} style={{flex: 1, height: px2dp(40), justifyContent: "center"}}>
                            <Text style={{textAlign: 'center', color: "#e83e41"}}>
                                立即购买
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1}} onPress={this.addtocart.bind(this)}>
                            <View style={{
                                flex: 1,
                                backgroundColor: "#e83e41",
                                height: px2dp(40),
                                justifyContent: "center"
                            }}>
                                <Text style={{textAlign: 'center', color: "#ffffff"}}>
                                    加入购物车
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Modal style={styles.modal} position={"bottom"} backdropOpacity={0.8} ref={"modal"} swipeToClose={false}
                       onbackClose={this.closebtn.bind(this)} >
                    <View style={{
                        flex: 1,
                        marginTop: 20,
                        backgroundColor: "#ffffff",
                        borderTopLeftRadius: px2dp(8),
                        borderTopRightRadius: px2dp(8)
                    }}>

                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: px2dp(1),
                            borderBottomColor: '#eeeeee',
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
                                        499.00
                                    </Text>
                                </View>
                                <View style={{marginTop: px2dp(5)}}>
                                    <Text style={{fontSize: px2dp(12)}}>
                                        己选：标配+32G内存+不要钱
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            borderBottomWidth: px2dp(1),
                            borderBottomColor: '#eeeeee',
                            paddingTop: px2dp(5), paddingBottom: px2dp(5),
                            backgroundColor: "#ffffff",

                            paddingLeft: px2dp(10),
                            paddingRight: px2dp(10),


                        }}>
                            <View style={{paddingTop: px2dp(5), paddingBottom: px2dp(5)}}>


                                <Text>
                                    服务
                                </Text>
                                <RadioGroup size={0} thickness={0}
                                            onSelect={(index, value) => this.onSelect(index, value)}
                                            style={{flexDirection: 'row', marginTop: px2dp(5), flexWrap: 'wrap'}}
                                >
                                    <RadioButton value={'item1'} style={{
                                        borderWidth: px2dp(1),
                                        marginTop: px2dp(8),
                                        height: px2dp(20),
                                        borderColor: '#e83e41',
                                        borderRadius: px2dp(4),
                                        padding: px2dp(3),
                                        marginRight: px2dp(8),
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            color: '#e83e41',
                                            fontSize: px2dp(12),
                                        }}>
                                            倒车影像安装
                                        </Text>
                                    </RadioButton>
                                    <RadioButton value={'item1'} style={{
                                        borderWidth: px2dp(1),
                                        marginTop: px2dp(8),
                                        height: px2dp(20),
                                        borderColor: '#e83e41',
                                        borderRadius: px2dp(4),
                                        padding: px2dp(3),
                                        marginRight: px2dp(8),
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            color: '#e83e41',
                                            fontSize: px2dp(12),
                                        }}>
                                            倒车影像安装
                                        </Text>
                                    </RadioButton>

                                    <RadioButton value={'item1'} style={{
                                        borderWidth: px2dp(1),
                                        marginTop: px2dp(8),
                                        height: px2dp(20),
                                        borderColor: '#e83e41',
                                        borderRadius: px2dp(4),
                                        padding: px2dp(3),
                                        marginRight: px2dp(8),
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            color: '#e83e41',
                                            fontSize: px2dp(12),
                                        }}>
                                            倒车影像安装
                                        </Text>
                                    </RadioButton>
                                </RadioGroup>


                            </View>

                        </View>
                        <View style={{flex: 1, backgroundColor: "#ffffff"}}>

                            <View style={{
                                height: px2dp(40),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',

                                paddingLeft: px2dp(10),
                                paddingRight: px2dp(10),

                            }}>

                                <Text>
                                    数量
                                </Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity style={{
                                        borderWidth: 1, height: px2dp(30), width: px2dp(35),
                                        borderColor: "#cccccc", justifyContent: 'center', alignItems: "center"
                                    }} onPress={this.decreasenum.bind(this)}>
                                        <Text style={{
                                            fontSize: px2dp(18),
                                        }}>
                                            -
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{
                                        borderTopWidth: 1,
                                        height: px2dp(30),
                                        width: px2dp(35),
                                        borderColor: "#cccccc",
                                        justifyContent: 'center',
                                        alignItems: "center",
                                        borderBottomWidth: 1
                                    }}>
                                        <Text style={{
                                            fontSize: px2dp(18),
                                            color: '#333333'
                                        }}>
                                            {this.state.num}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{
                                        borderWidth: 1, height: px2dp(30), width: px2dp(35),
                                        borderColor: "#cccccc", justifyContent: 'center', alignItems: "center"
                                    }} onPress={this.addnum.bind(this)}>
                                        <Text style={{
                                            fontSize: px2dp(18),
                                        }}>
                                            +
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>


                        <TouchableOpacity style={{
                            height: px2dp(30), width: px2dp(30),
                            position: "absolute", top: 0, right: 0, justifyContent: 'center', alignItems: 'center'
                        }} onPress={this.closebtn.bind(this)}>
                            <Icon name={"ios-close-circle-outline"} size={px2dp(18)} color={"#aaaaaa"}/>
                        </TouchableOpacity>

                    </View>
                    <Image source={{uri: set.baseurl + '/data/upload/avatar/15_thumb_1488773131.jpg'}}
                           style={{
                               width: px2dp(80), height: px2dp(80), borderRadius: px2dp(10),
                               position: "absolute", top: 0, left: px2dp(15)
                           }}/>
                    <View style={{backgroundColor: "#ffffff"}}>
                        <TouchableOpacity style={{
                            backgroundColor: '#e83e41',
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{fontSize: px2dp(14), color: '#ffffff'}}>
                                确定
                            </Text>
                        </TouchableOpacity>
                    </View>

                </Modal>


            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor:"#000000",
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
        backgroundColor:"#333333"
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
        backgroundColor: "#000000",
        flexDirection: 'row',
        position:"relative"
    },
    center: {
        backgroundColor: '#eeeeee'
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: px2dp(30),
        fontWeight: 'bold',
    }

})
