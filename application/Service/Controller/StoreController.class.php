<?php
/**
 * Created by liaopeng.
 * User: liaopeng
 * Date: 2017/4/20
 * Time: 16:33
 */

namespace Service\Controller;
use Common\Controller\AdminbaseController;
class StoreController extends AdminbaseController {    
    // 门店列表
    public function storelist(){
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("store")->where($condition)->count();
        $page=$this->page($count,12);
        $list=M("store")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    // 门店添加
    public function storeadd(){
        $this->display();
    }
    // 门店添加提交
    public function storeadddo(){
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("store")->where(["name"=>$_POST["name"]])->find() and $this->error("此门店己存在！");
        M("store")->add($_POST) or $this->error("未知错误，添加失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 门店");
        $this->success("添加成功！");

    }
    // 门店编辑提交
    public function storeeditdo(){
        $_POST["id"] or $this->error("门店信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("store")->where(["id"=>$_POST["id"]])->find() or $this->error("门店信息错误！");
        M("store")->save($_POST) or $this->error("内容未作修改，无需保存！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 服务门店");
        $this->success("修改成功！");
    }
    // 门店编辑页
    public function storeedit(){
        $id=  I("get.id",0,'intval');
        $info=M("store")->where(["id"=>$id])->find() or $this->error("未找到该门店！");
        $info["thumbs"] and $info["thumbs"]=unserialize($info["thumbs"]);
        $this->assign("info",$info);
        $this->display();
    }
    // 门店删除
    public function storedelete(){
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            if (M("store")->where(array('id'=>$id))->delete() !==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务门店");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }

        if(isset($_POST['ids'])){
            $ids = implode(',',I('post.ids/a'));
            if (M("store")->where(array('id'=>array('in',$ids)))->delete()!==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$ids."的服务");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }
    }
    public function stationlist(){
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("work_station")->where($condition)->count();
        $page=$this->page($count,12);
        $list=M("work_station")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        foreach ($list as $key=>$val)
        {
            $list[$key]['url']="http://".$_SERVER['HTTP_HOST']."/index.php?g=admin&m=public&a=worker&id=".$val['id'];
        }
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    public function stationadd(){
        $service_list=M("service_model")->select();
        $store_list=M("store")->select();
        $this->assign("service_list",$service_list);
        $this->assign("store_list",$store_list);
        $this->display();
    }
    public function stationadddo(){
        $_POST["name"] or $this->error("请填写标题！");
        M("work_station")->where(["name"=>$_POST["name"]])->find() and $this->error("此工位己存在重名！");
        M("work_station")->add($_POST) or $this->error("未知错误，添加失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 工位");
        $this->success("添加成功！");

    }
    public function stationeditdo(){
        $_POST["id"] or $this->error("工位信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        M("work_station")->where(["id"=>$_POST["id"]])->find() or $this->error("工位信息错误！");
        M("work_station")->save($_POST) or $this->error("内容未作修改，无需保存！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 工位");
        $this->success("修改成功！");
    }
    public function stationedit(){
        $id=  I("get.id",0,'intval');
        $info=M("work_station")->where(["id"=>$id])->find() or $this->error("未找到该工位！");
        $this->assign("info",$info);
        $this->display();
    }
    public function stationdelete(){
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            if (M("work_station")->where(array('id'=>$id))->delete() !==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的工位");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }
        if(isset($_POST['ids'])){
            $ids = implode(',',I('post.ids/a'));
            if (M("work_station")->where(array('id'=>array('in',$ids)))->delete()!==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$ids."的工作");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }
    }




}