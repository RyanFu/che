/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component } from 'react'
import { Navigator, View, StatusBar, Platform } from 'react-native'
import Wrapper from './component/Wrapper'
//import Events from './util/event'

export default class Navigation extends Component{
    constructor(props){
      super(props)
    }
    render(){

        return Platform.OS == "ios"?(
          <Navigator
            initialRoute={{component: Wrapper,name: 'aaa'}}
            configureScene={() => Navigator.SceneConfigs.FloatFromRight}
            renderScene={(route, navigator) => {
                  return <route.component navigator={navigator} {...route.args}/>
                }
            }
          />
        ):(
          <View style={{flex: 1}}>
            <StatusBar
             backgroundColor="#e83e41"
             barStyle="light-content"
           />
            <Navigator
              initialRoute={{component: Wrapper}}
              configureScene={() => Navigator.SceneConfigs.FloatFromRight}
              renderScene={(route, navigator) => {
                    return <route.component navigator={navigator} {...route.args}/>
                  }
              }
            />
          </View>
        )
    }
}
