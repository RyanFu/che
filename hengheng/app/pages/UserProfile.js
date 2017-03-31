/**
 * @author LiaoPeng
 *
 */
'use strict';

import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
    AsyncStorage,
    BackAndroid,
    DeviceEventEmitter
} from 'react-native'
import NavBar from '../component/NavBar'
import Item from '../component/Item'
import Toast from 'react-native-root-toast';
import set from '../config/config';
import ImagePicker from 'react-native-image-picker';
import nickname from './nickname';
//FontAwesome
export default class UserProfile extends Component{
  constructor(props){
      super(props);
      this.state={
          token: null,
          photo:set.baseurl+set.interface.default_photo,
          name:"",
          mobile:"",
          avatarSource:""
      }

    this.handleBack = this._handleBack.bind(this);


  }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        this.toast = Toast.show('加载中，请稍后', {
            duration: 20000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: false,
            delay: 0,
        });
        AsyncStorage.getItem("userinfo").then((data)=>{
            if(data){
                let userinfo=JSON.parse(data);
                this.setState({
                    photo:set.baseurl+userinfo.photo,
                    name:userinfo.name,
                    mobile:userinfo.mobile,
                    token:userinfo.token
                })
                Toast.hide(this.toast);
            }else{
                alert("用户信息错误");
                this._handleBack();
            }

        })
        this.changename = DeviceEventEmitter.addListener('changenickname',(data)=>{
            this.setState({
                name:data
            })
        });

    }
    editernicename(){
        this.props.navigator.push({
            component: nickname,
            args: {}
        });
    }
    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
        this.changename.remove();
    }
    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }
    up_photo(){
        // More info on all the options is below in the README...just some common use cases shown here
        let options = {
            //底部弹出框选项
            title:'请选择',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'选择相册',
            quality:0.75,
            allowsEditing:true,
            noData:false,
            storageOptions: {
                skipBackup: true,
                path:'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {

            }
            else if (response.error) {

            }
            else if (response.customButton) {

            }
            else {
                this.toast = Toast.show('头像上传中，请稍后', {
                    duration: 20000,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0,
                });
                let body=new FormData();
                let suffixindex = response.uri.lastIndexOf("\.");
                if(suffixindex<0)
                {
                    alert("此图片格式不能上传");
                    return
                }
                let suffix  = response.uri.substring(suffixindex + 1, response.uri.length);
                body.append('img',response.data);
                body.append('suffix',suffix);
                body.append('token',this.state.token);
                let uprequest=new XMLHttpRequest();
                let url=set.baseurl+set.interface.upload_img;
                uprequest.open('POST',url);
                uprequest.send(body);
                uprequest.onload=()=>{
                    if(uprequest.status!=200)
                    {
                        Toast.hide(this.toast);
                        return alert("网络请求失败");
                    }
                    if(!uprequest.responseText){
                        Toast.hide(this.toast);
                        return alert("服务器无响应");
                    }
                    if(uprequest.status==200){
                        Toast.hide(this.toast);
                        let retext=JSON.parse(uprequest.responseText);
                        if(parseInt(retext.status)==0){

                            this.toast = Toast.show(retext.message, {
                                duration: 2000,
                                position: Toast.positions.CENTER,
                                shadow: true,
                                animation: true,
                                hideOnPress: false,
                                delay: 0,
                            });
                            DeviceEventEmitter.emit('changeAvatar',response.uri);
                            this.setState({
                                photo: response.uri
                            });

                        }else{
                            this.toast = Toast.show(retext.message, {
                                duration: 2000,
                                position: Toast.positions.CENTER,
                                shadow: true,
                                animation: true,
                                hideOnPress: false,
                                delay: 0,
                            });
                        }


                    }
                }

            }
        });
    }
  back(){
    this.props.navigator.pop()
  }
  render(){
    return (
      <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
        <NavBar
          title="账户信息"
          leftIcon="ios-arrow-back"
          leftPress={this.back.bind(this)}
        />
        <ScrollView>
          <Item name="头像" avatar={{uri:this.state.photo}} onPress={this.up_photo.bind(this)}/>
          <Item name="昵称"  subName={this.state.name} onPress={this.editernicename.bind(this)}/>
          <Text style={styles.title}>{"账号绑定"}</Text>
          <Item name="手机" font="FontAwesome" icon="mobile" subName={this.state.mobile}/>
          <Item name="微信" color="#1bce4a" iconSize={15} font="FontAwesome" icon="wechat" subName="未绑定"/>
          <Item name="QQ" color="#ce3c1b" iconSize={15} font="FontAwesome" icon="qq" subName="未绑定"/>
          <Item name="微博" color="#fa7d3c" iconSize={16} font="FontAwesome" icon="weibo" subName="未绑定"/>
          <Text style={styles.title}>{"安全设置"}</Text>
          <Item name="登录密码" subName="未绑定"/>
          <Item name="支付密码" subName="未绑定"/>
          <Item name="小额免密支付"/>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#666"
  }
})
