/**
 * Created by liaopeng on 17/3/22.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    BackAndroid,
    Modal,
    Text,
    Easing,
    ListView,
    Platform,
    Dimensions,
    DeviceEventEmitter,
    InteractionManager,
    StyleSheet,
    Alert
} from 'react-native';
import _ from 'lodash';
import Platelistview from '../component/Platelistview'
import NavBar from '../component/NavBar'
import request from '../lib/request'
import set from '../config/config'
import Serieslistview from '../component/Serieslistview'
import px2dp from '../util/index'
const {width, height} = Dimensions.get('window')
const SECTIONHEIGHT = 30, ROWHEIGHT = 40
//这是利用lodash的range和数组的map画出26个英文字母
const letters = _
    .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
    .map(n => String.fromCharCode(n).substr(0))
_.pull(letters, 'I', 'E', 'U', 'V')//去掉o和V,这两个下面没有城市
let city = []//城市的数组
var totalheight = [];//每个字母对应的城市和字母的总高度
var that = null;

export default class List extends Component {
    constructor(props) {
        super(props);
        this.handleBack = this._handleBack.bind(this);
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };
        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[rowID];
        };
        this.state = {
            showmask: true,
            slists: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            modelmargin: new Animated.Value(width),
            marginhight: (Platform.OS === 'ios' ? 64 : 42),
            showlist: false,
            dataSource: new ListView.DataSource({
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }),
        }

        that = this
    }

    componentWillMount() {

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            this._fetchData();
        });

        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);

    }
    _fetchData()
   {

           //把城市放到对应的字母中
           if (city.length > 0) {
               alert("a");

               var dataBlob = {};
               var sectionIDs = [];
               var rowIDs = [];
               for (let ii = 0; ii < city.length; ii++) {
                   var sectionName = 'Section ' + ii;
                   sectionIDs.push(sectionName)
                   dataBlob[sectionName] = letters[ii]
                   rowIDs[ii] = [];
                   for (let j = 0; j < city[ii].name.length; j++) {
                       var rowName = ii + '-' + j;
                       rowIDs[ii].push(rowName)
                       dataBlob[rowName] = {name: city[ii].name[j], icon: city[ii].icon[j], list: city[ii].list[j]}

                   }
                   var eachheight = SECTIONHEIGHT + ROWHEIGHT * city[ii].name.length
                   totalheight.push(eachheight)
               }
               this.setState({
                   dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                   showmask: false
               })

           } else {
               request.get("http://www.jzdzsw.com/index.php?g=app&m=public&a=getcarbrand", null).then((data) => {
                   if (data) {
                       for (let j = 0; j < letters.length; j++) {
                           let each = []
                           let icon = []
                           let lists = []
                           for (let i = 0; i < data.length; i++) {
                               if (letters[j] == data[i].name_en) {
                                   each.push(data[i].name)
                                   icon.push(data[i].icon)
                                   lists.push(data[i].list)
                               }
                           }
                           let _city = {}
                           _city.index = letters[j]
                           _city.name = each
                           _city.icon = icon
                           _city.list = lists
                           city.push(_city)
                       }
                   }
                   var dataBlob = {};
                   var sectionIDs = [];
                   var rowIDs = [];
                   for (let ii = 0; ii < city.length; ii++) {
                       var sectionName = 'Section ' + ii;
                       sectionIDs.push(sectionName)
                       dataBlob[sectionName] = letters[ii]
                       rowIDs[ii] = [];
                       for (let j = 0; j < city[ii].name.length; j++) {
                           var rowName = ii + '-' + j;
                           rowIDs[ii].push(rowName)
                           dataBlob[rowName] = {name: city[ii].name[j], icon: city[ii].icon[j], list: city[ii].list[j]}

                       }
                       var eachheight = SECTIONHEIGHT + ROWHEIGHT * city[ii].name.length
                       totalheight.push(eachheight)
                   }
                   this.setState({
                       dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                       showmask: false
                   })
               })
           }


   }

    componentWillUnmount() {

        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }
    showleft=(data)=>{
        this.setState({
                showlist: true,
                slists: this.state.slists.cloneWithRows(data)
            }
        );
        Animated.timing(
            this.state.modelmargin,//初始值
            {toValue: 150,
                duration: 200,
            }//结束值
        ).start();//开始
    }


    renderRow(rowData, rowId) {
        return (
            <TouchableOpacity
                key={rowId}
                style={{height: ROWHEIGHT, justifyContent: 'center', paddingLeft: 20, paddingRight: 30}}
                onPress={() => {

                    this.showleft(rowData.list)
                }}>
                <View style={styles.rowdata}>
                    <Image source={{uri: 'http://www.jzdzsw.com/data/upload' + rowData.icon}}
                           style={{
                               height: px2dp(30),
                               width: px2dp(30),
                               marginRight: px2dp(10),
                               borderRadius: px2dp(15)
                           }}/>
                    <Text style={styles.rowdatatext}>{rowData.name}</Text>
                </View>

            </TouchableOpacity>
        )
    }

    renderSectionHeader = (sectionData, sectionID) => {
        return (
            <View style={{height: SECTIONHEIGHT, justifyContent: 'center', paddingLeft: 5}}>
                <Text style={{color: 'rgb(40,169,185)', fontWeight: 'bold'}}>
                    {sectionData}
                </Text>
            </View>
        )
    }
    // render ringht index Letters
    renderLetters(letter, index) {
        return (
            <TouchableOpacity key={index} activeOpacity={0.6} onPress={() => {
                this.scrollTo(index)
            }}>
                <View style={styles.letter}>
                    <Text style={styles.letterText}>{letter}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    //回调改变显示的城市
    changedata = (cityname) => {
        this.props.changeCity(cityname)
    }

    //touch right indexLetters, scroll the left
    scrollTo = (index) => {
        let position = 0;
        for (let i = 0; i < index; i++) {
            position += totalheight[i]
        }
        this._listView.scrollTo({
            y: position
        })
    }
    handselect(rowData)
    {
        DeviceEventEmitter.emit('changeseries',rowData);
        this.handleBack()

    }

    renderlist(rowData) {
        return (
            <TouchableWithoutFeedback onPress={() => {
                DeviceEventEmitter.emit('changeseries',rowData);
                this.handleBack()
            }}>
                <View style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#eeeeee",
                    height: px2dp(30),
                    justifyContent: 'center',
                    paddingLeft: px2dp(10)
                }}>
                    <Text style={{fontSize: px2dp(11)}}>{rowData.series}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (

            <View style={{height: Dimensions.get('window').height, marginBottom: 10}}>
                <NavBar
                    title={"选择品牌"}
                    leftIcon="ios-arrow-back"
                    leftPress={this.handleBack.bind(this)}
                />
                <Platelistview style={{backgroundColor: "#eeeeee", position: "relative"}}
                               contentContainerStyle={styles.contentContainer}
                               refb={listView => this._listView = listView}
                               dataSource={this.state.dataSource}
                               showleft={this.showleft.bind(this)}
                               isstatic="1"


                />
                <View style={styles.letters}>
                    {letters.map((letter, index) => this.renderLetters(letter, index))}
                </View>
                {this.state.showlist && <TouchableWithoutFeedback onPress={() => {
                    this.setState({showlist: false, modelmargin: new Animated.Value(width)});
                }}>
                    <View style={{
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        top: this.state.marginhight,
                        bottom: 0,
                        left: 0,
                        right: 0
                    }}></View>
                </TouchableWithoutFeedback>}
                {this.state.showlist &&
                <Animated.View style={[{
                    position: "absolute",
                    backgroundColor: "#ffffff",
                    top:  this.state.marginhight,
                    bottom: 0,
                    width:width,
                    transform: [{translateY: 0}, {translateX: this.state.modelmargin}]
                }]}>
                    <Serieslistview
                        dataSource={this.state.slists}
                        handselect={this.handselect.bind(this)}
                    />

                </Animated.View>
                }
                {this.state.showmask &&
                <View style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: "center",
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: "center", height: px2dp(100), width: px2dp(100), borderRadius: px2dp(10),
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}>
                        <ActivityIndicator style={{flex:2}}/>
                        <Text style={{color:"#ffffff",flex:1,fontSize:px2dp(12)}}>加载中...</Text>
                    </View>
                </View>
                }

            </View>
        );
    }
};

const styles = StyleSheet.create({
    modal: {
        height: 350,
        position: 'relative',
        backgroundColor: "rgba(0,0,0,0)"

    },
    contentContainer: {
        width: width,
        backgroundColor: 'white',
        paddingBottom: (Platform.OS === 'ios' ? 0 : px2dp(30))
    },
    letters: {
        position: 'absolute',
        height: height,
        top: 0,
        bottom: 0,
        right: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        height: height * 3.3 / 100,
        width: width * 3 / 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterText: {
        textAlign: 'center',
        fontSize: height * 1.1 / 50,
        color: 'rgb(40,169,185)'
    },
    rowdata: {
        borderBottomColor: '#faf0e6',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignItems: "center"
    },
    rowdatatext: {
        color: 'gray',
    }
})