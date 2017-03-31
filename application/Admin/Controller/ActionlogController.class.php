<?php
/**
 * Created by liaopeng.
 * User: liaopeng
 * Date: 2017/2/20
 * Time: 16:33
 */

namespace Admin\Controller;

use Common\Controller\AdminbaseController;

class ActionlogController extends AdminbaseController {
    /**
     * 服务列表
     */
    public function loglist()
    {
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("admin_log")->where($condition)->count();

        $page=$this->page($count,12);
        $condition["type"]="admin";
        $list=M("admin_log")->join("hh_users on hh_users.id= hh_admin_log.users_id")->where($condition)->field("hh_admin_log.*,hh_users.user_login")->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }

    /**
     * 服务添加页
     */
    public function logadd(){
        $Modellist=M("service_model")->field("id,name")->select();
        $this->assign("modellist",$Modellist);
        $this->display();
    }
    /**
     * 服务添加提交
     */
    public function logadddo()
    {
        $_POST["name"] or $this->error("请填写标题！");
        $flow=$_POST["flow"] or $this->error("请添加工序！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        $_POST["add_time"]=$_POST["edit_time"]=time();
        M("service")->where(["name"=>$_POST["name"]])->find() and $this->error("此服务己存在！");
        $service_id=M("service")->add($_POST) or $this->error("未知错误，添加失败！");
        foreach($flow as $key=>$val)
        {
            $list[$key]["service_id"]=$service_id;
            $list[$key]["service_model_id"]=$val;
        }
        M("service_list")->addAll($list) or $this->error("未知错误，添加工序失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 服务");
        $this->success("添加成功！");
    }
    /**
     * 服务编辑页
     */
    public function logedit()
    {
        $id=  I("get.id",0,'intval');
        $info=M("service")->where(["id"=>$id])->find();
        $info["thumbs"] and $info["thumbs"]=unserialize($info["thumbs"]);
        $Modellist=M("service_model")->field("id,name")->select();
        $this->assign("modellist",$Modellist);
        $list=M("service_list")->join("hh_service_model on hh_service_model.id=hh_service_list.service_model_id")->where(["service_id"=>$id])->select();
        $this->assign("list",$list);
        $this->assign("info",$info);
        $this->display();
    }
    /**
     * 服务编辑提交
     */
    public function logeditdo()
    {
        $_POST["id"] or $this->error("模型信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        $flow=$_POST["flow"] or $this->error("请添加工序！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("service")->where(["id"=>$_POST["id"]])->find() or $this->error("服务信息错误！");
        M("service_list")->where(["service_id"=>$_POST["id"]])->delete();
        foreach($flow as $key=>$val)
        {
            $list[$key]["service_id"]=$_POST["id"];
            $list[$key]["service_model_id"]=$val;
        }
        M("service_list")->addAll($list) or $this->error("未知错误，修改工序失败！");
        M("service")->save($_POST);
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 服务");
        $this->success("修改成功！");

    }
    /**
     * 服务删除页
     */
    public function logdel()
    {
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            if (M("service")->where(array('id'=>$id))->delete() !==false) {
                M("service_list")->where(["service_id"=>$id])->delete();
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }

        if(isset($_POST['ids'])){
            $ids = I('post.ids/a');
            if (M("service")->where(array('id'=>array('in',$ids)))->delete()!==false) {
                M("service_list")->where(["service_id"=>["in",$ids]])->delete();
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$ids."的服务");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }

    }

}