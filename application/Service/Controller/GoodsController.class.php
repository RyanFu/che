<?php
/**
 * Created by liaopeng.
 * User: liaopeng
 * Date: 2017/2/20
 * Time: 16:33
 */

namespace Service\Controller;

use Common\Controller\AdminbaseController;

class GoodsController extends AdminbaseController {


    public $attrarraylist;
    public $attrlist;
    public $attrid=0;
    /**
     * 改变商品状态
     */
    public function setgoodsstatus()
    {
        M("goods")->where(['id'=>$_POST['id']])->save([$_POST['type']=>$_POST['value']]) and json_return(0,"修改成功");
        json_return(1,"修改失败");

    }
    /**
     * 打包商品列表
     */
    public function goodslist()
    {
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $condition['type']=3;
        $count=M("goods")->where($condition)->count();
        $page=$this->page($count,12);
        $list=M("goods")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    /**
     * 选择优惠劵商品
     */
    public function coupongoods()
    {
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("goods")->where($condition)->count();
        $page=$this->page($count,6);
        $list=M("goods")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();

        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    /**
     * 选择商品属性
     */
    public function selectgoods()
    {
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $condition['type']=['neq',3];
        $count=M("goods")->where($condition)->count();
        $page=$this->page($count,6);
        $list=M("goods")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $goodsids='';
        foreach($list as $k=>$v)
        {
            if($v['type']==2){
                $goodsids.=$v['id'].',';
            }
        }
        $goodsids=rtrim($goodsids,',');
        $attrlist=M("goods_attr")->where(['goods_id'=>['in',$goodsids]])->select();
        $goodsarray=explode(',',$goodsids);
        $attrarr=[];
        foreach ($goodsarray as $gv)
        {
            foreach ($attrlist as $av)
            {
                $av['a_id']=$av['id'];
                $av['id']=$av['attr_id'];
                $av['selected']='';
                $av['disabled']=$av['islast']?'':"disabled";
                $av["parentid"]=$av['f_id'];
                $av['islast'] and $av['name']=$av['name'].' ￥：'.$av['price'];
                if($av['goods_id']==$gv)
                {
                    $attrarr[$gv][]=$av;
                }

            }
        }
        $tree = new \Tree();
        $str = "<option value='\$a_id' \$disabled \$selected>\$spacer \$name</option>";

        foreach($attrarr as $attk=>$attv)
        {

            $tree->init($attv);
            foreach($list as $listkey=>$listv)
            {
                if($listv['id']==$attk)
                {
                    $list[$listkey]['select_categorys']=$tree->get_tree(0, $str);
                }
            }
        }


        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    /**
     * 打包商品
     */
    public function goodsadd(){
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
     * 打包商品属性结构重组
     */
    public function setattr($attr,$goods_id,$k=0,$f_name='')
    {
        foreach ($attr as $key=>$val)
        {
            $this->attrid++;
            $islast=$val['item']?0:1;
            $s_name=$f_name?$f_name.' '.$val['name']:$val['name'];
            $this->attrlist[]=['attr_id'=>$this->attrid,'attrlist'=>$val['attrlist'],'islast'=>$islast,'f_name'=>$s_name,'goods_id'=>$goods_id,'name'=>$val['name'],'f_id'=>$k,'stock'=>$val['stock'],'price'=>$val['price']];
            $this->setattr($val['item'],$goods_id,$this->attrid,$s_name);

        }
    }
    /**
     * 套餐添加提交
     */
    public function goodsadddo()
    {
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["type"]=3;
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        $_POST["add_time"]=$_POST["edit_time"]=date("Y-m-d H:i:s");
        M("goods")->where(["name"=>$_POST["name"]])->find() and $this->error("此商品名称己存在！");
        $goods_id=M("goods")->add($_POST) or $this->error("未知错误，添加失败！");
        $this->setattr($_POST['attr'],$goods_id);
        foreach($this->attrlist as $k=>$v)
        {
            $attrid=M("goods_attr")->add($v);
            foreach ($v['attrlist'] as $ak=>$av)
            {
                $v['attrlist'][$ak]['f_attr_id']=$attrid;
                $v['attrlist'][$ak]['f_goods_id']=$goods_id;
            }
            M("goods_packlist")->addAll(array_values($v['attrlist']));
        }
        M("goods_attr_template")->add(["attr_str"=>htmlspecialchars($_POST["attr_str"]),"goods_id"=>$goods_id]) or $this->error("商品属性添加失败，请联系开发人员");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 的套餐商品");
        $this->success("添加成功！");
    }
    /**
     * 服务编辑页
     */
    public function goodsedit()
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
     * 服务编辑提交
     */
    public function goodseditdo()
    {
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["type"]=3;
        $_POST["photos_url"] and $_POST["thumbs"]=serialize(["url"=>$_POST["photos_url"],"alt"=>$_POST["photos_alt"]]);
        $_POST["add_time"]=$_POST["edit_time"]=date("Y-m-d H:i:s");
        $goods_id=intval($_POST['id']);
        M("goods")->where(['id'=>$goods_id])->save($_POST) or $this->error("修改失败！");
        M("goods_attr")->where(["goods_id"=>$goods_id])->delete();
        M("goods_packlist")->where(["f_goods_id"=>$goods_id])->delete();
        M("goods_attr_template")->where(["goods_id"=>$goods_id])->delete();
        $this->setattr($_POST['attr'],$goods_id);
        foreach($this->attrlist as $k=>$v)
        {
            $attrid=M("goods_attr")->add($v);
            foreach ($v['attrlist'] as $ak=>$av)
            {
                $v['attrlist'][$ak]['f_attr_id']=$attrid;
                $v['attrlist'][$ak]['f_goods_id']=$goods_id;
            }
            M("goods_packlist")->addAll(array_values($v['attrlist']));
        }
        M("goods_attr_template")->add(["attr_str"=>htmlspecialchars($_POST["attr_str"]),"goods_id"=>$goods_id]);
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 的套餐商品");
        $this->success("修改成功！");

    }
    /**
     * 套餐删除页
     */
    public function goodsdel()
    {
        if(isset($_GET['id'])){
            $goods_id = I("get.id",0,'intval');
            M("goods")->where(['id'=>$goods_id])->delete();
            M("goods_attr")->where(["goods_id"=>$goods_id])->delete();
            M("goods_packlist")->where(["f_goods_id"=>$goods_id])->delete();
            M("goods_attr_template")->where(["goods_id"=>$goods_id])->delete();
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$goods_id."的服务");
            $this->success("删除成功！");
        }
        if(isset($_POST['ids'])){
            $goods_id =implode(',',I('post.ids/a'));
            M("goods")->where(['id'=>['in',$goods_id]])->delete();
            M("goods_attr")->where(["goods_id"=>['in',$goods_id]])->delete();
            M("goods_packlist")->where(["f_goods_id"=>['in',$goods_id]])->delete();
            M("goods_attr_template")->where(["goods_id"=>['in',$goods_id]])->delete();
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$goods_id."的服务");
            $this->success("删除成功！");

        }

    }

}