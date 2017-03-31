/**
 * Created by liaopeng on 17/3/4.
 */
'use strict'
import set from '../config/config';
import querystring from 'query-string';
let request={}
request.get=(url,params)=>{
    if(params)
    {
        let opera='';
        url.indexOf("?")>0?opera='&':opera="?";
        url +=opera+querystring.stringify(params);

    }
    return fetch(url).
        then((response)=>response.json())
}
request.post=(url,body)=>{
    /*
    let map={
        method:'POST',
            headers:{
            'Accept':'application/json',
                'Content-Type':'application/json'
        },
        body:JSON.stringify(body),
        follow:20,
            timeout:8000,
            size:0,
    };
    */
    let map={
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify(body)
    }
    return fetch(url,map).
    then((response)=>response.json())
}
module.exports=request