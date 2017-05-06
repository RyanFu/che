/**
 * Created by liao on 17/4/27.
 */
import {
    AsyncStorage,
    Alert
} from 'react-native';
import Device from 'react-native-device-info';
export const getDeviceToken=()=>{
    return Device.getUniqueID();
}
export const getToken=()=>{
    AsyncStorage.getItem("token").then((data) => {
        return data?data:'';
    })}

export const getUserInfo=()=>{
    AsyncStorage.getItem("userinfo").then((userdata) => {
        return userdata?JSON.parse(userdata):null;
    })
}
export const getLBS=(a)=>{
    navigator.geolocation.getCurrentPosition(
        a,
        (error) => {Alert.alert("提示","定位失败")}
    )
}

