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
    Dimensions,
    StyleSheet,
} from 'react-native';
import px2dp from '../util/index'
const {width, height} = Dimensions.get('window')
const SECTIONHEIGHT = 30, ROWHEIGHT = 40
export default class Platelistview extends Component {
    constructor(props) {
        super(props);
        this.state={
            reload:true,
        }
    }
    shouldComponentUpdate(newProps,newState)
    {
        if (this.state.reload)
        {
            this.setState({
                reload:false
            })
            return true;
        }
        return false;

    }



    renderRow(rowData, rowId) {
        return (
            <TouchableOpacity
                key={rowId}
                style={{height: ROWHEIGHT, justifyContent: 'center', paddingLeft: 20, paddingRight: 30}}
                onPress={() => {

                    this.props.showleft(rowData.list)
                }}>
                <View style={styles.rowdata}>
                    <Image source={{uri: 'http://192.168.1.88/data/upload' + rowData.icon}}
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


    render() {
        return (
                <ListView style={{backgroundColor: "#eeeeee", position: "relative"}}
                          contentContainerStyle={styles.contentContainer}
                          dataSource={this.props.dataSource}
                          ref={this.props.refb}
                          renderRow={this.renderRow.bind(this)}
                          renderSectionHeader={this.renderSectionHeader}
                          enableEmptySections={true}
                          initialListSize={200}
                          pageSize={4}
                          showsVerticalScrollIndicator={false}


                />

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