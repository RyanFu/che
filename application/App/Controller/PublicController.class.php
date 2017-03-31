<?php

namespace App\Controller;

use Think\Controller;
use Think\Image;

class PublicController extends Controller
{

    //发送验短信验证码
    public function sendsns()
    {
        //      file_put_contents('2.txt',print_r($_POST,true),FILE_APPEND);
        $type = $_POST["type"];
        $mobile = $_POST["mobile"];
        $verify = rand(1000, 9999);
        ismobile($_POST["mobile"]) or json_return(1, "手机号码格式错误");
        if ($_POST['type'] == 'regster') {
            $info = M("users")->where(["mobile" => $_POST["mobile"]])->find();
            $info and json_return(2, "此手机号码己被注册");
        }
        if ($_POST['type'] == 'forgetpass') {
            $info = M("users")->where(["mobile" => $_POST["mobile"]])->find();
            $info or json_return(2, "用户不存在");
        }
        $checksend = M("verify")->where(["mobile" => $_POST["mobile"], "type" => $_POST["type"], "time" => ["gt", time() - 59]])->find();
        $checksend and json_return(3, "60秒内只能发送一条短信，请稍后");
        //调用发送SDK
        if($this->sendmessage($mobile,buildmessage($_POST['type'],$verify))<1)
        {
            json_return(4, "验证码发送失败，请重试");

        }


        $data = ["mobile" => $mobile, "verify" => $verify, "time" => time(), "type" => $type];
        //如果发送成功
        M("verify")->add($data);
        json_return(0, "发送成功");
    }

    //检测短信验证码
    public function checksns()
    {
        $_POST["mobile"] = trim($_POST["mobile"]);
        //  file_put_contents('2.txt',print_r($_POST,true),FILE_APPEND);
        ismobile($_POST["mobile"]) or json_return(1, "手机号码格式错误");
        $_POST["code"] or json_return(2, "验定码不能为空");
        $_POST["type"] or $_POST["type"] = 'regster';
        if ($_POST['type'] == 'regster') {
            $info = M("users")->where(["mobile" => $_POST["mobile"]])->find();
            $info and json_return(2, "此手机号码己被注册");
        }
        if ($_POST['type'] == 'forgetpass') {
            $info = M("users")->where(["mobile" => $_POST["mobile"]])->find();
            $info or json_return(2, "用户不存在");
        }
        $chckverify = M("verify")->where(["mobile" => $_POST['mobile'], "verify" => $_POST["code"], "type" => $_POST["type"], "status" => 0])->find();
        $chckverify or json_return(3, "验证码错误");
        $chckverify["time"] + 15 * 60 > time() or json_return(4, "验证码己过期");
        M("verify")->where(["id" => $chckverify["id"]])->save(["status" => 1]);
        json_return(0, "验证成功");
    }

    // 前台用户手机注册
    public function register()
    {
        $_POST["mobile"] = trim($_POST["mobile"]);
        $_POST["pass1"] = trim($_POST["pass1"]);
        $_POST["pass2"] = trim($_POST["pass2"]);
        $_POST["mobile"] && $_POST["type"] && $_POST["code"] && $_POST["pass1"] && $_POST["pass2"] or json_return(1, "参数错误");
        $_POST["pass1"] == $_POST["pass2"] or json_return(2, "两次密码不一至");
        strlen($_POST["pass1"]) > 3 && strlen($_POST["pass1"]) < 20 or json_return(3, "密码长度必须3-20位之间");
        $info = M("users")->where(["mobile" => $_POST["mobile"]])->find();
        $chckverify = M("verify")->where(["mobile" => $_POST['mobile'], "verify" => $_POST["code"], "type" => $_POST["type"], "status" => 1])->find();
        $chckverify or json_return(4, "参数错误");
        if ($_POST['type'] == "forgetpass") {
            $info or json_return(2, "用户信息错误");
            $token = encrypt(['id' => $info['id'], 'time' => time()], 'liaopeng');
            $data = ['device_token' => $_POST['device_token'], 'user_pass' => sp_password($_POST["pass1"]), 'token' => $token];
            M("users")->where(['id' => $info["id"]])->save($data);
            json_return(0, "修改成功", ['token' => $token]);
        } else {

            $info and json_return(2, "此手机号码己被注册");
            $data = array(
                'user_login' => '',
                'user_email' => '',
                'mobile' => $_POST["mobile"],
                'user_nicename' => '',
                'user_pass' => sp_password($_POST["pass1"]),
                'last_login_ip' => get_client_ip(0, true),
                'create_time' => date("Y-m-d H:i:s"),
                'last_login_time' => date("Y-m-d H:i:s"),
                'user_status' => 1,
                "user_type" => 2,//会员
                "device_token" => $_POST["device_token"],
                "client" => $_POST['client'],
            );

            $result = M("users")->add($data);
            if ($result) {
                $token = encrypt(['id' => $result, 'time' => time()], 'liaopeng');
                M("users")->where(["id" => $result])->save(["token" => $token]);
                json_return(0, "注册成功", ['token' => $token]);

            } else {
                json_return(5, "注册失败");
            }
        }
    }
    public function test()
    {
        echo sp_password("admin");
    }

    public function login()
    {
        $_POST["mobile"] = trim($_POST["mobile"]);
        $_POST["password"] = trim($_POST["password"]);
        $_POST["mobile"] or json_return(1, "用户名不能为空");
        $_POST["password"] or json_return(2, "密码不能为空");
        $userinfo = M('users')->where(['mobile' => $_POST['mobile']])->find();
        $userinfo or json_return(2, "用户不存在");
        $userinfo['user_pass'] == sp_password($_POST["password"]) or json_return(3, "密码错误");
        $userinfo['user_status'] == 0 and json_return(1, "用户己被封号");
        $userinfo["token"] = encrypt(['id' => $userinfo["id"], 'time' => time()], 'liaopeng');
        M("users")->where(['id' => $userinfo['id']])->save(["device_token" => $_POST["device_token"], "client" => $_POST["client"], 'last_login_time' => date("Y-m-d H:i:s"), 'token' => $userinfo["token"]]);
        json_return(0, "登陆成功", ['token' => $userinfo["token"]]);

    }

    public function userinfo()
    {
        $_POST["token"] or json_return(1, "请重新登陆");
        $_POST["device_token"] or json_return(2, "请重新登陆");
        $userinfo = M("users")->where(['token' => $_POST["token"], 'device_token' => $_POST["device_token"]])->find();
        $userinfo or json_return(3, "请重新登陆");
        $userinfo['user_status'] == 0 and json_return(3, "请重新登陆");

        $userinfo['photo'] = 'index.php?g=user&m=public&a=avatar&id=' . $userinfo['avatar'];
        $userinfo['name'] = "未设置昵称";
        $userinfo['mobile'] = substr($userinfo['mobile'], 0, 3) . "***" . substr($userinfo['mobile'], 7, 4);
        $userinfo['user_nicename'] and $userinfo['name'] = $userinfo['user_nicename'];
        json_return(0, "读取成功", $userinfo);
    }

    public function upload_img()
    {
        $img = base64_decode($_POST["img"]);
        $info = decrypt($_POST['token'], 'liaopeng');
        $filepath = __DIR__ . '/../../../' . C("UPLOADPATH") . "avatar/" . $info['id'] . '_' . time() . '.' . $_POST['suffix'];
        $img and file_put_contents($filepath, $img);
        $image = new Image();
        $image->open($filepath);
        $image->thumb(150, 150)->save(__DIR__ . '/../../../' . C("UPLOADPATH") . "avatar/" . $info['id'] . '_thumb_' . time() . '.' . $_POST['suffix']);
        M("users")->where(["id" => $info['id']])->save(["avatar" => $info['id'] . '_thumb_' . time() . '.' . $_POST['suffix']]);
        json_return(0, "上传成功");
    }

    public function changename()
    {
        $_POST['nicename'] = trim($_POST['nicename']);
        $_POST['token'] or json_return(3, "请重新登陆");
        $_POST['device_token'] or json_return(3, "请重新登陆");
        $_POST['nicename'] or json_return(3, "昵称不能为空");
        $info = decrypt($_POST['token'], 'liaopeng');
        $userinfo = M('users')->where(['id' => $info['id']])->find();
        $_POST['device_token'] == $userinfo['device_token'] or json_return(3, "请重新登陆");
        $_POST['nicename'] == $userinfo["user_nicename"] and json_return(0, "昵称修改成功");
        M('users')->where(['id' => $userinfo['id']])->save(['user_nicename' => $_POST['nicename']]) or json_return(1, "昵称修改失败");
        json_return(0, "昵称修改成功");

    }

    public function getCarBrand()
    {
        $brand = M('brand')->field("brand_id as code,brand as name,initial as name_en,brand_logo as icon")->select();
        $series=M('car_series')->select();
        foreach ($brand as $key => $val) {
            $brand[$key]['icon'] = str_replace(".\\", "/", $val['icon']);
            $brand[$key]['icon'] = str_replace("\\", "/", $brand[$key]['icon']);
            foreach ($series as $k=>$v)
            {
                if($v['brand_id']==$val['code'])
                {
                    $temp=[];
                    $temp["series"]=$v['series'];
                    $temp["series_id"]=$v['series_id'];
                    $brand[$key]['list'][]=$temp;
                }
            }
        }
       die(json_encode($brand));
    }

    public function getcaraddress()
    {
        $rearr=array();
        $address=M("plate")->field("abbreviated,province")->select();
        foreach($address as $v)
        {
            $temp["abbreviated"]=$v['abbreviated'];
            $temp['province']=$v['abbreviated'].'('.$v['province'].')';
            $rearr[]=$temp;

        }
        die(json_encode($rearr));

    }
    public function getcarlist()
    {

        $carlist=M("car")->where(['series_id'=>"$_GET[id]"])->field("car_id,carname")->select();
        foreach ($carlist as $key=>$v)
        {
            if($v['carname']=="")
            {
                unset($carlist[$key]);
            }

        }
        die(json_encode($carlist));


    }
    public function addcar()
    {
        $_POST['uid']=M("users")->where(['token'=>$_POST['token']])->field("id")->find()["id"];

        if($_POST['id'])
        {
            $_POST['uid'] or json_return(1,"请重新登陆");
            M("users_car")->save($_POST)?json_return(0,"修改成功"):json_return(1,"修改失败");
        }else{
            unset($_POST["id"]);
            $_POST['uid'] or json_return(1,"请重新登陆");
            M("users_car")->add($_POST)?json_return(0,"添加成功"):json_return(1,"添加失败");
        }

    }
    public function usercarlist()
    {
        $_POST['uid']=M("users")->where(['token'=>$_POST['token']])->field("id")->find()["id"];
        $_POST['uid'] or json_return(1,"请重新登陆");
        $list=M("users_car")->where(['uid'=>$_POST['uid']])->select();
        json_return(0,"获取成功",$list);

    }
    public function userdelcar()
    {
        $_POST['uid']=M("users")->where(['token'=>$_POST['token']])->field("id")->find()["id"];
        $_POST['uid'] or json_return(1,"删除失败，请重新登陆");
        $list=M("users_car")->where(['uid'=>$_POST['uid'],"id"=>$_POST['id']])->delete();
        $list?json_return(0,"删除成功"):json_return(2,"删除失败");
    }
    public function getgoodslist()
    {
        //获取商品列表
        $count=10;
        $page=0;
        $start=$page*$count;
        $order="id desc";
        $count=M("goods")->count();
        $list=M("goods")->order($order)->limit($start,$count)->select();
        print_r($list);
    
        


    }

}

