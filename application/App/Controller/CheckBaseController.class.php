<?php
/**
 * Created by PhpStorm.
 * User: liaopeng
 * Date: 17/3/23
 * Time: 下午2:07
 */

namespace App\Controller;
use Think\Controller;
class CheckBaseController extends Controller
{
    public $memberinfo;
    public function __construct() {
        parent::__construct();
        ($_REQUEST['token'] && $_REQUEST['device_token']) or json_return(99,"请重新登陆");
        $this->memberinfo=M("users")->where(['token'=>$_REQUEST['token']])->find();
        $this->memberinfo or json_return(99,"请重新登陆");
        $this->memberinfo['user_status'] or json_return(98,"账号状态异常");

        ($this->memberinfo['device_token'] == $_REQUEST['device_token']) or json_return(98,"您的账户己在其它设备上登陆，请重新登陆");
        
    }
    public function account($money,$pay,$desc)
    {
        if(abs($money)>0)
        {
            $nowmoney=$this->memberinfo['money']+$money;
            if($nowmoney>=0)
            {
                M("users")->where(["id"=>$this->memberinfo['id']])->save(["money"=>$nowmoney]);
                M("account")->add(['uid'=>$this->memberinfo['id'],'money'=>$money,"time"=>date("Y-m-d H:i:s"),"pay"=>$pay,"desc"=>$desc]);
                return true;
            }else{
                return false;
            }
        }else{
            M("account")->add(['uid'=>$this->memberinfo['id'],'money'=>$money,"time"=>date("Y-m-d H:i:s"),"pay"=>$pay,"desc"=>$desc]);
            return true;
        }



    }
}