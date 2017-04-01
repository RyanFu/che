/**
 * Created by LiaoPeng.
 */
'use strict';
let set={
    baseurl:"http://192.168.1.88/",
    interface:{
        sendsns:'index.php?g=app&m=public&a=sendsns',
        checksns:'index.php?g=app&m=public&a=checksns',
        register:'index.php?g=app&m=public&a=register',
        login:'index.php?g=app&m=public&a=login',
        userinfo:'index.php?g=app&m=public&a=userinfo',
        default_photo:'index.php?g=user&m=public&a=avatar',
        upload_img:'index.php?g=app&m=public&a=upload_img',
        changename:'index.php?g=app&m=public&a=changename',
        getcarlist:'index.php?g=app&m=public&a=getcarlist',
        addcar:'index.php?g=app&m=public&a=addcar',
        usercarlist:'index.php?g=app&m=public&a=usercarlist',
        userdelcar:'index.php?g=app&m=public&a=userdelcar',
        getgoodslist:'index.php?g=app&m=public&a=getgoodslist',
    },

}
export default set