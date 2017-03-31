<?php
/**
 * Created by liaopeng.
 * User: liaopeng
 * Date: 2017/2/20
 * Time: 16:33
 */

namespace Service\Controller;

use Common\Controller\AdminbaseController;

class ServiceController extends AdminbaseController {
    /**
     * 服务列表
     */
    public function servicelist()
    {
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];

        }
        $condition["type"]=1;
        $count=M("goods")->where($condition)->count();

        $page=$this->page($count,12);
        $list=M("goods")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }

    /**
     * 服务添加页
     */
    public function serviceadd(){
        $Modellist=M("service_model")->field("id,name")->select();
        $tree = new \Tree();
        $parentid = I("get.f_id",0,'intval');
        $result = M("goods_class")->order(array("id" => "DESC"))->select();
        foreach ($result as $r) {
            $r['selected'] = $r['id'] == $parentid ? 'selected' : '';
            $r['parentid']=$r['f_id'];
            $array[] = $r;
        }

        $str = "<option value='\$id' \$selected>\$spacer \$name</option>";
        $tree->init($array);
        $select_categorys = $tree->get_tree(0, $str);
        $this->assign("select_categorys", $select_categorys);
        $this->assign("modellist",$Modellist);
        $this->display();
    }
    /**
     * 服务商品添加提交
     */
    public function serviceadddo()
    {
        $_POST["name"] or $this->error("请填写标题！");
        $flow=$_POST["flow"] or $this->error("请添加服务！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        $_POST["add_time"]=$_POST["edit_time"]=date('Y-m-d H:i:s',time());
        $_POST["type"]=1;
        M("goods")->where(["name"=>$_POST["name"]])->find() and $this->error("此商品名字己存在，请修改！");
        $service_id=M("goods")->add($_POST) or $this->error("未知错误，添加失败！");
        foreach($flow as $key=>$val)
        {
            $list[$key]["goods_id"]=$service_id;
            $tmparr=explode("|",$val);
            $list[$key]["service_model_id"]=$tmparr[0];
            $list[$key]["num"]=$tmparr[1];
        }
        M("service_list")->addAll($list) or $this->error("未知错误，添加服务列表失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 商品");
        $this->success("添加成功！");
    }
    /**
     * 服务编辑页
     */
    public function serviceedit()
    {
        $id=  I("get.id",0,'intval');
        $info=M("goods")->where(["id"=>$id])->find() or $this->error("未找到该服务！");
        $info["thumbs"] and $info["thumbs"]=unserialize($info["thumbs"]);
        $Modellist=M("service_model")->field("id,name")->select();
        $this->assign("modellist",$Modellist);
        $list=M("service_list")->join("hh_service_model on hh_service_model.id=hh_service_list.service_model_id")->where(["goods_id"=>$id])->select();
        $this->assign("list",$list);
        $this->assign("info",$info);
        $this->display();
    }
    /**
     * 服务编辑提交
     */
    public function serviceeditdo()
    {
        $_POST["id"] or $this->error("商品信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        $flow=$_POST["flow"] or $this->error("请添加工序！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("goods")->where(["id"=>$_POST["id"]])->find() or $this->error("商品信息错误！");
        M("service_list")->where(["goods_id"=>$_POST["id"]])->delete();
        foreach($flow as $key=>$val)
        {
            $list[$key]["goods_id"]=$_POST["id"];
            $tmparr=explode("|",$val);
            $list[$key]["service_model_id"]=$tmparr[0];
            $list[$key]["num"]=$tmparr[1];
        }
        M("service_list")->addAll($list) or $this->error("未知错误，修改工序失败！");
        M("goods")->save($_POST);
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 服务");
        $this->success("修改成功！");

    }
    /**
     * 服务删除页
     */
    public function servicedel()
    {
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            M("service_list")->where(["goods_id"=>$id])->delete();
            M("goods")->where(array('id'=>$id))->delete();
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务");
            $this->success("删除成功！");
        }

        if(isset($_POST['ids'])){
            $id =implode(',',I('post.ids/a'));
            M("service_list")->where(["goods_id"=>['in',$id]])->delete();
            M("goods")->where(array('id'=>['in',$id]))->delete();
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务");
            $this->success("删除成功！");
        }

    }
    // 模型列表
    public function model(){
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("service_model")->where($condition)->count();

        $page=$this->page($count,12);
        $list=M("service_model")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();

        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    // 模型添加
    public function add(){
        $classify=M("goods_class")->select();
        $this->assign("classify",$classify);
        $this->display();
    }
    // 模型添加提交
    public function add_model(){
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("service_model")->where(["name"=>$_POST["name"]])->find() and $this->error("此模型己存在！");
        M("service_model")->add($_POST) or $this->error("未知错误，添加失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 服务模型");
        $this->success("添加成功！");

    }
    // 模型编辑提交
    public function edit_model(){
        $_POST["id"] or $this->error("模型信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("service_model")->where(["id"=>$_POST["id"]])->find() or $this->error("模型信息错误！");
        M("service_model")->save($_POST) or $this->error("内容未作修改，无需保存！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 服务模型");
        $this->success("修改成功！");

    }

    // 模型编辑页
    public function edit(){
        $id=  I("get.id",0,'intval');
        $info=M("service_model")->where(["id"=>$id])->find() or $this->error("未找到该模型！");
        $info["thumbs"] and $info["thumbs"]=unserialize($info["thumbs"]);
        $classify=M("goods_class")->select();
        $this->assign("classify",$classify);
        $this->assign("info",$info);
        $this->display();
    }

    // 模型删除
    public function delete(){
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            if (M("service_model")->where(array('id'=>$id))->delete() !==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务模型");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }

        if(isset($_POST['ids'])){
            $ids = implode(',',I('post.ids/a'));
            if (M("service_model")->where(array('id'=>array('in',$ids)))->delete()!==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$ids."的服务");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }
    }
    // 模型分类列表
    public function classifylist(){
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("goods_class")->where($condition)->count();

        $page=$this->page($count,12);
        $list=M("goods_class")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    // 模型分类添加
    public function classifyadd(){
        $tree = new \Tree();
        $parentid = I("get.f_id",0,'intval');
        $result = M("goods_class")->order(array("id" => "DESC"))->select();
        foreach ($result as $r) {
            $r['selected'] = $r['id'] == $parentid ? 'selected' : '';
            $r['parentid']=$r['f_id'];
            $array[] = $r;
        }

        $str = "<option value='\$id' \$selected>\$spacer \$name</option>";
        $tree->init($array);
        $select_categorys = $tree->get_tree(0, $str);
        $this->assign("select_categorys", $select_categorys);
        $this->display();
    }
    // 模型分类添加提交
    public function classifyadddo(){
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("goods_class")->where(["name"=>$_POST["name"]])->find() and $this->error("此分类己存在！");
        M("goods_class")->add($_POST) or $this->error("未知错误，添加失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 服务分类");
        $this->success("添加成功！");

    }
    // 模型分类编辑提交
    public function classifyeditdo(){
        $_POST["id"] or $this->error("模型信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        M("goods_class")->where(["id"=>$_POST["id"]])->find() or $this->error("模型信息错误！");
        M("goods_class")->save($_POST) or $this->error("内容未作修改，无需保存！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 服务分类");
        $this->success("修改成功！");

    }

    // 模型分类编辑页
    public function classifyedit(){
        $id=  I("get.id",0,'intval');
        $info=M("goods_class")->where(["id"=>$id])->find() or $this->error("未找到该分类！");
        $info["thumbs"] and $info["thumbs"]=unserialize($info["thumbs"]);
        $this->assign("info",$info);
        $this->display();
    }

    // 模型分类删除
    public function classifydelete(){
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            if (M("goods_class")->where(array('id'=>$id))->delete() !==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务分类");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }

        if(isset($_POST['ids'])){
            $ids = implode(',',I('post.ids/a'));
            if (M("goods_class")->where(array('id'=>array('in',$ids)))->delete()!==false) {
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$ids."的服务分类");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }
    }
}