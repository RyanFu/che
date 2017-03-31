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
        ($this->memberinfo['device_token'] == $_REQUEST['device_token']) or json_return(98,"您的账户己在其它设备上登陆，请重新登陆");
        
    }
}