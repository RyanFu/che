<?php
/**
 * Created by liaopeng.
 * User: liaopeng
 * Date: 2017/2/20
 * Time: 16:33
 */

namespace Service\Controller;

use Common\Controller\AdminbaseController;

class CommodityController extends AdminbaseController {
    public $attrlist;
    public $attrid=0;
    /**
     * 实物商品列表
     */

    public function commoditylist()
    {
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];

        }
        $condition["type"]=2;
        $count=M("goods")->where($condition)->count();
        $page=$this->page($count,6);
        $list=M("goods")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $goodsids='';
        foreach ($list as $key=>$val)
        {
            $goodsids.=$val['id'].',';
        }
        $goodsids=rtrim($goodsids,',');
        $attlist=M()->query('SELECT GROUP_CONCAT(name,":",price) as price,goods_id FROM `hh_goods_attr` where goods_id in ("'.$goodsids.'") and price >0 GROUP BY("goods_id")');
        foreach($list as $k=>$v)
        {
            foreach ($attlist as $ak=>$av)
            {
                if($v['id']==$av['goods_id'])
                {
                    $list[$key]['price']=$av['price'];
                }
            }
        }
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }

    /**
     * 实物添加页
     */
    public function commodityadd(){
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
    /**
     * 实物属性结构重组
     */
    public function setattr($attr,$goods_id,$k=0,$f_name='')
    {
        foreach ($attr as $key=>$val)
        {
            $this->attrid++;
            $islast=$val['item']?0:1;
            $s_name=$f_name?$f_name.' '.$val['name']:$val['name'];
            $this->attrlist[]=['attr_id'=>$this->attrid,'islast'=>$islast,'f_name'=>$s_name,'goods_id'=>$goods_id,'name'=>$val['name'],'f_id'=>$k,'stock'=>$val['stock'],'price'=>$val['price']];
            $this->setattr($val['item'],$goods_id,$this->attrid,$s_name);

        }
    }
    /**
     * 实物添加提交
     */
    public function commodityadddo()
    {
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        $_POST["add_time"]=$_POST["edit_time"]=date("Y-m-d H:i:s");
        $_POST["type"]=2;
        M("goods")->where(["name"=>$_POST["name"]])->find() and $this->error("此商品己存在！请改名后提交");
        $goods_id=M("goods")->add($_POST) or $this->error("未知错误，添加失败！");
        $this->setattr($_POST['attr'],$goods_id);
        M("goods_attr")->addAll($this->attrlist) or $this->error("商品属性添加失败，请联系开发人员");
        M("goods_attr_template")->add(["attr_str"=>htmlspecialchars($_POST["attr_str"]),"goods_id"=>$goods_id]) or $this->error("商品属性添加失败，请联系开发人员");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 商品");
        $this->success("添加成功！");
    }
    /**
     * 实物编辑页
     */
    public function commodityedit()
    {
        $id=  I("get.id",0,'intval');
        $info=M("goods")->where(["id"=>$id])->find() or $this->error("商品信息错误");
        $info["thumbs"] and $info["thumbs"]=unserialize($info["thumbs"]);
        $tree = new \Tree();
        $parentid = $info["classify"];
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
        $info['attr']=htmlspecialchars_decode(M("goods_attr_template")->where(["goods_id"=>$id])->find()['attr_str']);
        $this->assign("info",$info);
        $this->display();
    }
    /**
     * 实物编辑提交
     */
    public function commodityeditdo()
    {
        $_POST["name"] or $this->error("标题不能为空！");
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        $_POST["add_time"]=$_POST["edit_time"]=date("Y-m-d H:i:s");
        M("goods")->where(["id"=>$_POST["id"]])->find() or $this->error("商品信息错误");
        M("goods")->where(['id'=>$_POST['id']])->save($_POST) or $this->error("修改失败！");
        M("goods_attr")->where(["goods_id"=>$_POST['id']])->delete();
        $this->setattr($_POST['attr'],$_POST['id']);
        M("goods_attr")->addAll($this->attrlist) or $this->error("商品属性修改失败，请联系开发人员");
        M("goods_attr_template")->where(["goods_id"=>$_POST['id']])->delete();
        M("goods_attr_template")->add(["attr_str"=>htmlspecialchars($_POST["attr_str"]),"goods_id"=>$_POST['id']]) or $this->error("商品属性修改失败，请联系开发人员");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 商品");
        $this->success("修改成功！");

    }
    /**
     * 实物删除页
     */
    public function commoditydel()
    {
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            M("goods")->where(["id"=>$id])->delete();
            M("goods_attr")->where(["goods_id"=>$id])->delete();
            M("goods_attr_template")->where(["goods_id"=>$id])->delete();
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务");
            $this->success("删除成功！");

        }

        if(isset($_POST['ids'])){
            $goods_id =implode(',',I('post.ids/a'));
            M("goods")->where(["id"=>['in',$goods_id]])->delete();
            M("goods_attr")->where(["goods_id"=>['in',$goods_id]])->delete();
            M("goods_attr_template")->where(["goods_id"=>['in',$goods_id]])->delete();
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$goods_id."的服务");
            $this->success("删除成功！");
        }

    }
    // 属性列表
    public function commoditymodellist(){
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("commodity_model_group")->where($condition)->count();

        $page=$this->page($count,12);
        $list=M("commodity_model_group")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        foreach ($list as $key=>$val)
        {
            @$ids.=$val["id"].",";
        }
        $ids=rtrim($ids,",");
        $attrlist=M("commodity_model")->where(["group_id"=>["in",$ids]])->select();
        foreach ($list as $k=>$vl)
        {
            foreach ($attrlist as $v)
            {
                if($v["group_id"]==$vl["id"])
                {
                    $list[$k]["attr"].=$v["name"].",";
                }
            }
            $list[$k]["attr"]=rtrim($list[$k]["attr"],",");
        }
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    // 属性添加
    public function commoditymodeladd(){

        $this->display();
    }
    // 属性添加提交
    public function commoditymodeladddo(){

        $_POST["name"] or $this->error("请填写标题！");
        $flow=$_POST["flow"] or $this->error("属性不能为空！");
        M("commodity_model_group")->where(["name"=>$_POST["name"]])->find() and $this->error("此属性己存在！");
        $group_id= M("commodity_model_group")->add($_POST) or $this->error("未知错误，属性添加失败！");
        foreach($flow as $key=>$v)
        {
            $data[$key]["group_id"]=$group_id;
            $data[$key]["name"]=$v;
        }
        M("commodity_model")->addAll($data) or $this->error("未知错误，属性添加失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 属性模板");
        $this->success("添加成功！");

    }
    // 属性编辑提交
    public function commoditymodeleditdo(){
        $_POST["id"] or $this->error("属性信息错误！");
        $_POST["name"] or $this->error("请填写标题！");
        $flow=$_POST["flow"] or $this->error("属性不能为空！");
        M("commodity_model_group")->where(["id"=>$_POST["id"]])->find() or $this->error("此属性不存在！");
        M("commodity_model")->where(["group_id"=>$_POST["id"]])->delete() or $this->error("系统出错！");
        foreach($flow as $key=>$v)
        {
            $data[$key]["group_id"]=$_POST["id"];
            $data[$key]["name"]=$v;
        }
        M("commodity_model")->addAll($data) or $this->error("未知错误，属性修改失败！");
        M("commodity_model_group")->save($_POST);
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 属性");
        $this->success("修改成功！");

    }

    // 属性编辑页
    public function commoditymodeledit(){
        $id=  I("get.id",0,'intval');
        $info=M("commodity_model_group")->where(["id"=>$id])->find() or $this->error("未找到该属性！");
        $attrlist=M("commodity_model")->where(["group_id"=>$id])->field("id,name")->select();
        $this->assign("modellist",$attrlist);
        $this->assign("info",$info);
        $this->display();
    }

    // 属性删除
    public function commoditymodeldel(){
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            if (M("commodity_model_group")->where(array('id'=>$id))->delete() !==false) {
                M("commodity_model")->where(["group_id"=>$id])->delete();
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的属性");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }

        if(isset($_POST['ids'])){
            $ids = I('post.ids/a');
            if (M("commodity_model_group")->where(array('id'=>array('in',$ids)))->delete()!==false) {
                M("commodity_model")->where(["service_id"=>["in",$ids]])->delete();
                $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$ids."的属性");
                $this->success("删除成功！");
            } else {
                $this->error("删除失败！");
            }
        }
    }
    public function test()
    {
        $group_list=M("commodity_model_group")->select();
        $group_str=json_encode($group_list);
        $modellist=M("commodity_model")->select();
        $newlist=array();
        foreach ($modellist as $key=>$val)
        {
            $newlist[$val["group_id"]][]=$val;
        }
        $attrstr=json_encode($newlist);
        $this->assign("attrstr",$attrstr);

        $this->assign("attrgroup",$group_str);
        $this->display();
    }
}