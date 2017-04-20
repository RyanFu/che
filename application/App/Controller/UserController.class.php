<?php
/**
 * Created by PhpStorm.
 * User: liaopeng
 * Date: 17/3/23
 * Time: 下午2:09
 */

namespace App\Controller;
class UserController extends CheckBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getuseraccount()
    {
        $page=$_POST['page']?$_POST['page']:0;
        $pagesize=10;
        $start=$page*$pagesize;
        $list=M("account")->where(['uid'=>$this->memberinfo['id']])->limit($start,$pagesize)->select();
        json_return(0,"",$list);
    }
}