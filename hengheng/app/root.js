/**
 * Created by liao on 17/5/1.
 */
'use strict';
import React, {Component} from 'react'
import {View, AsyncStorage, StatusBar, StyleSheet,Text,Image} from 'react-native'
import AppIntro from 'react-native-app-intro';
import SplashScreen from 'react-native-splash-screen'
import Navigation from './app'
export default class rootApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showguid: false,
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("_first").then((data) => {
            if (!data) {
                this.setState({
                    showguid: true,
                })
            }
            setTimeout(() => {
                SplashScreen.hide();
            }, 100)
        })
    }

    onSkipBtnHandle = (index) => {
        this.setState({
            showguid: false,
        })
        AsyncStorage.setItem("_first", "1");
    }
    doneBtnHandle = () => {
        this.setState({
            showguid: false,
        })
        AsyncStorage.setItem("_first", "1");
    }
    nextBtnHandle = (index) => {
    }
    onSlideChangeHandle = (index, total) => {
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.showguid && <StatusBar
                    hidden={true}
                />}
                <Navigation />
                {this.state.showguid &&
                    <AppIntro
                        onNextBtnClick={this.nextBtnHandle}
                        onDoneBtnClick={this.doneBtnHandle}
                        onSkipBtnClick={this.onSkipBtnHandle}
                        onSlideChange={this.onSlideChangeHandle}
                    >

                        <View style={[styles.slide, {backgroundColor: '#fa931d'}]}>
                            <View style={styles.header}>
                                <View>
                                    <Image style={{width: 75 * 2.5, height: 63 * 2.5}}
                                           source={require('./img/1/c1.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 80,
                                    left: -20,
                                }} level={20}
                                >
                                    <Image style={{width: 46 * 2.5, height: 28 * 2.5}}
                                           source={require('./img/1/c2.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 23,
                                    left: -25,
                                }} level={20}
                                >
                                    <Image style={{width: 109 * 2.5, height: 68 * 2.5}}
                                           source={require('./img/1/c5.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 65,
                                    left: -15,
                                }} level={5}
                                >
                                    <Image style={{width: 23 * 2.5, height: 17 * 2.5}}
                                           source={require('./img/1/c3.png')}/>
                                </View>
                            </View>
                            <View style={styles.info}>
                                <View level={10}><Text style={styles.title}>引导图</Text></View>
                                <View level={15}><Text style={styles.description}>引导图引导图引导图!</Text></View>
                            </View>
                        </View>
                        <View style={[styles.slide, {backgroundColor: '#a4b602'}]}>
                            <View style={styles.header}>
                                <View>
                                    <Image style={{width: 75 * 2.5, height: 63 * 2.5}}
                                           source={require('./img/2/1.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 30,
                                    left: -10,
                                }} level={20}
                                >
                                    <Image style={{width: 101 * 2.5, height: 71 * 2.5}}
                                           source={require('./img/2/2.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 10,
                                    left: 0,
                                }} level={-20}
                                >
                                    <Image style={{width: 85 * 2.5, height: 73 * 2.5}}
                                           source={require('./img/2/3.png')}/>
                                </View>
                            </View>
                            <View style={styles.info}>
                                <View level={10}><Text style={styles.title}>标题一!</Text></View>
                                <View level={15}><Text style={styles.description}>介绍一!</Text></View>
                            </View>
                        </View>
                        <View style={[styles.slide, {backgroundColor: '#406E9F'}]}>
                            <View style={styles.header}>
                                <View style={{
                                    position: 'absolute',
                                    top: 20,
                                    left: -30,
                                }}
                                >
                                    <Image style={{width: 138 * 2.5, height: 83 * 2.5}}
                                           source={require('./img/3/3.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 25,
                                    left: -10,
                                }} level={-15}
                                >
                                    <Image style={{width: 103 * 2.5, height: 42 * 2.5}}
                                           source={require('./img/3/4.png')}/>
                                </View>
                                <View level={10}>
                                    <Image style={{width: 95 * 2.5, height: 55 * 2.5}}
                                           source={require('./img/3/1.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 65,
                                    left: 70,
                                }} level={25}
                                >
                                    <Image style={{width: 47 * 2.5, height: 43 * 2.5}}
                                           source={require('./img/3/2.png')}/>
                                </View>
                            </View>
                            <View style={styles.info}>
                                <View level={10}><Text style={styles.title}>标题二!</Text></View>
                                <View level={15}><Text style={styles.description}>介绍二!</Text></View>
                            </View>
                        </View>
                        <View style={[styles.slide, {backgroundColor: '#DB4302'}]}>
                            <View style={styles.header}>
                                <View style={{
                                    position: 'absolute',
                                    top: 25,
                                    left: -35,
                                }} level={15}
                                >
                                    <Image style={{width: 96 * 2.5, height: 69 * 2.5}}
                                           source={require('./img/4/4.png')}/>
                                </View>
                                <View>
                                    <Image style={{width: 50 * 2.5, height: 63 * 2.5}}
                                           source={require('./img/4/1.png')}/>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 0,
                                }} level={20}
                                >
                                    <Image style={{width: 46 * 2.5, height: 98 * 2.5}}
                                           source={require('./img/4/3.png')}/>
                                </View>
                            </View>
                            <View style={styles.info}>
                                <View level={10}><Text style={styles.title}>标题!</Text></View>
                                <View level={15}><Text style={styles.description}>介绍!</Text></View>
                            </View>
                        </View>
                    </AppIntro>

                }

            </View>
        )
    }

}
const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        padding: 15,
    },
    header: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pic: {
        width: 75 * 2,
        height: 63 * 2,
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    info: {
        flex: 0.5,
        alignItems: 'center',
        padding: 40
    },
    title: {
        color: '#fff',
        fontSize: 30,
        paddingBottom: 20,
    },
    description: {
        color: '#fff',
        fontSize: 20,
    },
});