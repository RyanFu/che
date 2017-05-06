/**
 * Created by LiaoPeng.
 */
'use strict';
let set={
    baseurl:"http://www.jzdzsw.com/",
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
        getgoodsinfo:'index.php?g=app&m=public&a=getgoodsinfo',
        storelist:'index.php?g=app&m=public&a=storelist',
    },
    mall:{
        getordersubinfo:'index.php?g=app&m=mall&a=getordersubinfo',
        checkorder:'index.php?g=app&m=mall&a=checkorder',
        usercoupon:'index.php?g=app&m=mall&a=usercoupon',
        buildorder:'index.php?g=app&m=mall&a=buildorder',
        getorderlist:'index.php?g=app&m=mall&a=getorderlist',
        getusercard:'index.php?g=app&m=mall&a=getusercard',
        getusercouponlist:'index.php?g=app&m=mall&a=getusercouponlist',
    },
    user:{
        getuseraccount:'index.php?g=app&m=user&a=getuseraccount',
    }

}
export default set