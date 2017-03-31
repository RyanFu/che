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
export default class Serieslistview extends Component {
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
    renderlist(rowData) {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.handselect(rowData)
            }>
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
            <ListView
                contentContainerStyle={{paddingBottom: (Platform.OS === 'ios' ? 0 : px2dp(30))}}
                showsVerticalScrollIndicator={false}
                dataSource={this.props.dataSource}
                renderRow={this.renderlist.bind(this)}
            />

        );
    }
};

const styles = StyleSheet.create({

})