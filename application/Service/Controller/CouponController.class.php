<?php
/**
 * Created by liaopeng.
 * User: liaopeng
 * Date: 2017/2/20
 * Time: 16:33
 */

namespace Service\Controller;

use Common\Controller\AdminbaseController;

class CouponController extends AdminbaseController {
    public $classlist;
    /**
     * 优惠劵列表
     */
    public function couponlist()
    {
        if(I("post.name"))
        {
            $condition["name"]=["like","%".I("post.name")."%"];
        }
        $count=M("coupon")->where($condition)->count();
        $page=$this->page($count,12);
        $list=M("coupon")->where($condition)->order("id desc")->limit($page->firstRow , $page->listRows)->select();
        $this->assign("page",$page->show("Admin"));
        $this->assign("list",$list);
        $this->display();
    }
    /**
     * 改变优惠卷状态
     */
    public function setcouponstatus()
    {
        M("coupon")->where(['id'=>$_POST['id']])->save([$_POST['type']=>$_POST['value']]) and json_return(0,"修改成功");
        json_return(1,"修改失败");

    }
    /**
     * 优惠劵添加页
     */
    public function couponadd(){
        $tree = new \Tree();
        $result = M("goods_class")->order(array("id" => "DESC"))->select();
        foreach ($result as $r) {
            $r['parentid']=$r['f_id'];
            $array[] = $r;
        }

        $str = "<option value='\$id'>\$spacer \$name</option>";
        $tree->init($array);
        $select_categorys = $tree->get_tree(0, $str);
        $this->assign("select_categorys", $select_categorys);
        $this->display();
    }

    /**
     * 查找分类下的子分类
     */
    public function getclasslist($f_id,$classlist)
    {
        foreach ($classlist as $v)
        {
            if($v['f_id']==$f_id)
            {
                $this->classlist.=','.$v['id'];
                $this->getclasslist($v['id'],$classlist);
            }
        }

    }

    /**
     * 优惠劵添加提交
     */
    public function couponadddo()
    {
        $_POST["name"] or $this->error("请填写标题！");
        $_POST['goodslist'] and $_POST['goods_list']=implode(',',$_POST['goodslist']);
        $_POST['class'] and $this->classlist=implode(',',$_POST['class']);
        if($_POST['class'])
        {
            $allclass=M("goods_class")->select();
            foreach ($_POST['class'] as $v)
            {
                $this->getclasslist($v,$allclass);
            }
        }
        $_POST["class_list"]=$this->classlist;
        $_POST['add_time']=date('Y-m-d H:i:s');
        $_POST['type_template']=htmlspecialchars($_POST['type_template']);
        $_POST['class_template']=htmlspecialchars($_POST['class_template']);
        $_POST['goods_template']=htmlspecialchars($_POST['goods_template']);
        if($_POST['type']==1)
        {
            $_POST['man'] or $this->error("请添加满减规则！");
            $manjian=[];
            foreach ($_POST['man'] as $key=>$value)
            {
                $_POST["c_man"]=$value;
                $_POST["c_jian"]=$_POST['jian'][$key];
                $_POST["title"]="满".$value."减".$_POST['jian'][$key];
                $manjian[]=$_POST;
            }
            M("coupon")->addAll($manjian) or $this->error("添加失败！");
        }else{
            M("coupon")->add($_POST) or $this->error("添加失败！");
        }

        $this->addlog(session("ADMIN_ID"),"用户".session('name')."添加了:".$_POST["name"]." 的优惠劵");
        $this->success("添加成功");


    }
    /**
     * 优惠劵编辑页
     */
    public function couponedit()
    {
        $id=  I("get.id",0,'intval');
        $info=M("coupon")->where(["id"=>$id])->find();
        $info['type_template']=htmlspecialchars_decode($info['type_template']);
        $info['class_template']=htmlspecialchars_decode($info['class_template']);
        $info['goods_template']=htmlspecialchars_decode($info['goods_template']);
        $this->assign("info",$info);
        $this->display();
    }
    /**
     * 优惠劵编辑提交
     */
    public function couponeditdo()
    {
        $_POST["name"] or $this->error("请填写标题！");
        $_POST["id"] or $this->error("商品信息错误！");
        M("coupon")->where(['id'=>$_POST['id']])->find() or $this->error("商品信息错误！");
        $_POST['goodslist'] and $_POST['goods_list']=implode(',',$_POST['goodslist']);
        $_POST['class'] and $this->classlist=implode(',',$_POST['class']);
        if($_POST['class'])
        {
            $allclass=M("goods_class")->select();
            foreach ($_POST['class'] as $v)
            {
                $this->getclasslist($v,$allclass);
            }
        }
        $_POST["class_list"]=$this->classlist;
        if($_POST['type']==1)
        {
            $_POST['man'] or $this->error("请添加满减规则！");
            $manjian=[];
            foreach ($_POST['man'] as $key=>$value)
            {
                $manjian[]=["man"=>$value,"jian"=>$_POST['jian'][$key]];
            }
            $_POST['manjian']=serialize($manjian);
        }
        $_POST['type_template']=htmlspecialchars($_POST['type_template']);
        $_POST['class_template']=htmlspecialchars($_POST['class_template']);
        $_POST['goods_template']=htmlspecialchars($_POST['goods_template']);
        M("coupon")->where(['id'=>$_POST['id']])->save($_POST) or $this->error("修改失败！");
        $this->addlog(session("ADMIN_ID"),"用户".session('name')."修改了:".$_POST["name"]." 的优惠劵");
        $this->success("修改成功");


    }
    /**
     * 优惠劵删除页
     */
    public function coupondel()
    {
        if(isset($_GET['id'])){
            $id = I("get.id",0,'intval');
            M("coupon")->where(['id'=>$id])->delete() or $this->error("删除失败！");;
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$id."的服务");
            $this->success("删除成功！");
        }

        if(isset($_POST['ids'])){
            $ids = implode(',',I('post.ids/a'));
            M("coupon")->where(['id'=>['in',$ids]])->delete() or $this->error("删除失败！");;
            $this->addlog(session("ADMIN_ID"),"用户".session('name')."删除了ID为:".$ids."的服务");
            $this->success("删除成功！");

        }

    }

}