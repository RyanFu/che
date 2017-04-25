<?php
/**
 * Created by liaopeng.
 * User: liaopeng
 * Date: 2017/2/20
 * Time: 16:33
 */

namespace Product\Controller;

use Common\Controller\AdminbaseController;

class ProductController extends AdminbaseController {
    /**
     * 产品列表
     */
    public function productlist(){
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("product")->where($condition)->count();

        $page=$this->page($count,12);
        $list=M("product")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();

        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    /**
     * 产品添加页
     */
    public function add(){
        $this->display();
    }
    /**
     * 产品添加提交
     */
    public function add_do(){
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("product")->where(["name"=>$_POST["name"]])->find() and $this->error("有重名产品己存在！");
        M("product")->add($_POST) or $this->error("未知错误，添加失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了产品:".$_POST["name"]);
        $this->success("添加成功！");
    }
    /**
     * 产品修改提交
     */
    public function edit_do(){
        $_POST["id"] or $this->error("产品信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("product")->where(["id"=>$_POST["id"]])->find() or $this->error("产品信息错误！");
        M("product")->save($_POST) or $this->error("内容未作修改，无需保存！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了产品:".$_POST["name"]);
        $this->success("修改成功！");

    }

    /**
     * 产品修改页
     */
    public function edit(){
        $id=  I("get.id",0,'intval');
        $info=M("product")->where(["id"=>$id])->find() or $this->error("未找到该模型！");
        $info["thumbs"] and $info["thumbs"]=unserialize($info["thumbs"]);
        $this->assign("info",$info);
        $this->display();
    }
    /**
     * 产品删除提交
     */

    public function delete(){
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            if (M("product")->where(array('id'=>$id))->delete() !==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了产品，ID为:".$id);
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }

        if(isset($_POST['ids'])){
            $ids = implode(',',I('post.ids/a'));
            if (M("product")->where(array('id'=>array('in',$ids)))->delete()!==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."批量删除了品，ID为:".$ids);
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }
    }
}