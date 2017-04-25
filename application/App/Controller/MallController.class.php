<?php
/**
 * Created by PhpStorm.
 * User: liaopeng
 * Date: 17/3/23
 * Time: 下午2:09
 */

namespace App\Controller;
class MallController extends CheckBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    //加入购物车
    function addToCart()
    {

    }

    function buildorder()
    {
        $goodslist = json_decode($_POST['list'], true);
        $total = 0;
        foreach ($goodslist as $key => $val) {
            $goodsinfo = M("goods")->where(['id' => $val['id']])->find();
            $goodsinfo['status'] or json_return(1, "商品" . $val["goods"]["name"] . "己下架", ["type" => $val['goods']['type'], 'id' => $val['id']]);
            if ($val['goods']['type'] == 1) {
                $goodsinfo['stock'] >= $val['num'] or json_return(2, "商品" . $val["goods"]["name"] . "库存不足", ["type" => $val['goods']['type'], 'id' => $val['id']]);
                $editarr[] = ["type" => $val['goods']['type'], 'id' => $val['id'], "num" => $val['num'], "price" => $goodsinfo["price"]];
                $total += $val['num'] * $goodsinfo["price"];
            } else {
                $attrinfo = M("goods_attr")->where(['id' => $val['attr']['id']])->find();
                $attrinfo['stock'] >= $val['num'] or json_return(3, "商品" . $val["goods"]["name"] . "库存不足", ["type" => $val['goods']['type'], 'id' => $val['id']]);
                $editarr[] = ["type" => $val['goods']['type'], 'id' => $val['id'], "num" => $val['num'], "price" => $attrinfo["price"]];
                $total += $val['num'] * $attrinfo["price"];
            }
        }
        $order_sn = $this->build_order_no();
        $order = array(
            "order_sn" => $order_sn,
            "pay_status" => 0,
            "order_status" => 0,
            "uid" => $this->memberinfo['id'],
            "mount" => $total,
            "balance" => 0,
            "coupon" => 0,
            "pay" => 0,
            "add_time" => date("Y-m-d H:i:s")
        );
        $order_id = M("order")->add($order);
        $order_goods = [];
        foreach ($goodslist as $valb) {
            $order_goods[] = ['order_id' => $order_id, "goods_id" => $valb['id'], 'attr_id' => $valb['attr']['id'], 'num' => $valb['num'], 'price' => $valb['price'], 'total' => $valb['total']];
        }
        M("order_goods")->addAll($order_goods);
        json_return(0, "", ['order_id' => $order_id, "order_sn" => $order_sn]);
    }

    //检测订单
    public function checkorder()
    {
        //校验商品属性库存   价格  计算价格。
        $goodslist = json_decode($_POST['goods'], true);
        $editarr = [];
        $total = 0;
        $order_coupon = 0;
        foreach ($goodslist as $key => $val) {
            $goodsinfo = M("goods")->where(['id' => $val['id']])->find();
            $goodsinfo['status'] or json_return(1, "商品" . $val["goods"]["name"] . "己下架", ["type" => $val['goods']['type'], 'id' => $val['id']]);
            if ($val['goods']['type'] == 1) {
                $goodsinfo['stock'] >= $val['num'] or json_return(2, "商品" . $val["goods"]["name"] . "库存不足", ["type" => $val['goods']['type'], 'id' => $val['id']]);
                $editarr[] = ["type" => $val['goods']['type'], 'id' => $val['id'], "num" => $val['num'], "price" => $goodsinfo["price"]];
                $total += $val['num'] * $goodsinfo["prices"];
            } else {
                $attrinfo = M("goods_attr")->where(['id' => $val['attr']['id']])->find();
                $attrinfo['stock'] >= $val['num'] or json_return(3, "商品" . $val["goods"]["name"] . "库存不足", ["type" => $val['goods']['type'], 'id' => $val['id']]);
                $editarr[] = ["type" => $val['goods']['type'], 'id' => $val['id'], "num" => $val['num'], "price" => $attrinfo["price"]];
                $total += $val['num'] * $attrinfo["price"];
            }
            //校验优惠劵有效性，计算价格
            if ($val['choosenum'] > 0) {
                $coupon_total = 0;
                foreach ($val['couponlist'] as $cv) {
                    //检测此劵有效性
                    $sql = "select c.*,uc.name,uc.desc,uc.thumb,uc.type,uc.details,uc.worth,uc.class_list," .
                        "uc.goods_list,uc.c_man,uc.c_jian from hh_user_coupon as c left join hh_coupon as uc " .
                        "on c.coupon_id=uc.id where c.id =" . $cv['id'] . " limit 1";
                    $thecoupon = M()->query($sql)[0];
                    $thecoupon or json_return(4, "优惠劵" . $cv["name"] . "己失效", ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                    $thecoupon['status'] and json_return(4, "优惠劵" . $cv["name"] . "己失效", ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                    //检测劵所属用户
                    $thecoupon['uid'] == $this->memberinfo['id'] or json_return(4, "优惠劵" . $cv["name"] . "不属于您", ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                    //效验时间有效性
                    strtotime($thecoupon['effective']) < time() or json_return(4, "优惠劵" . $cv["name"] . "还未到使用时间", ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                    strtotime($thecoupon['expiration']) > time() or json_return(4, "优惠劵" . $cv["name"] . "己过期", ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                    //检测是否符合优惠劵类型
                    $isok = !$thecoupon['goods_list'] && !$thecoupon['class_list'];
                    if (!$isok && $thecoupon['goods_list']) {
                        $coupongoods = explode(',', thecoupon['goods_list']);
                        in_array($val['goods']['id'], $coupongoods) and $isok = true;
                    }
                    if (!$isok && $thecoupon['class_list']) {
                        $couponclass = explode(',', $thecoupon['class_list']);
                        in_array($val['goods']['classify'], $couponclass) and $isok = true;
                    }
                    $isok or json_return(5, "优惠劵" . $cv["name"] . "不能使用于商品 " . $val['goods']['name'], ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                    //处理满减劵
                    if ($thecoupon['type'] == 1) {
                        $jian = $thecoupon["c_jian"];
                        $man = $thecoupon["c_man"];
                        //是否达到满减数额
                        $val['total'] >= $man or json_return(6, "优惠劵" . $cv["name"] . "未达到满减金额 " . $val['goods']['name'] . " 的" . $man . "元", ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                        $coupon_total += $jian;
                    } else {
                        //处理抵扣劵
                        //是否达到最底消费
                        $val['total'] >= $thecoupon['min_consume'] or json_return(6, "优惠劵" . $cv["name"] . "未达到使用的最低金额 " . $val['goods']['name'], ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                        $coupon_total += $thecoupon['worth'];
                    }
                }
                $coupon_total > $val['total'] and $coupon_total = $val['total'];
                $order_coupon += $coupon_total;
            }
        }
        //余额有效性检测
        $this->memberinfo['money'] >= $_POST["balance"] or json_return(7, "余额不足");
        //效验提交的需支付的金额
        $pay = $total - $order_coupon - $_POST["balance"];
        $pay >= 0 && $pay == $_POST['pay'] or json_return(8, "待付金额有误");
        //更新订单支付信息。
        M("order")->where(['id' => $_POST['order_id']])->save(['mount' => $total, 'balance' => $_POST["balance"], 'coupon' => $coupon_total, 'pay' => $pay]);
        //添加优惠劵到订单商品
        $order_goods = M("order_goods")->where(['order_id' => $_POST['order_id']])->select();
        foreach ($order_goods as $k => $v) {
            foreach ($goodslist as $gv) {
                if ($gv['id'] == $v['goods_id'] && $gv['attr']['id'] == $v['attr_id'] && $gv['choosenum'] > 0) {
                    //添加商品优惠劵使用
                    M("order_goods")->where(['id' => $v['id']])->save(['coupon' => serialize($gv['couponlist'])]);
                    //设置优惠劵失效
                    foreach ($gv['couponlist'] as $cvl) {
                        M("user_coupon")->where(['id' => $cvl['id']])->save(['status' => 1]);
                    }
                }
            }
        }
        //不需要在线支付
        if ($pay == 0) {
            //修改订单为己付款
            M("order")->where(['id' => $_POST['order_id']])->save(['pay_status' => 1]);
            //将商品放入用户卡包
            $user_card = [];
          //  $service_goods_ids="";
         //   $goods_attr_ids="";
         //   $goodsnum=[];
            foreach ($goodslist as $key => $val) {

                switch ($val['goods']['type']) {
                    case 1:
                        $sql="select sm.name,sl.* from hh_service_list as sl left JOIN hh_service_model as sm on sm.id=sl.service_model_id where sl.goods_id = ".$val['id'];
                       // $service_list = M("service_list")->where(['goods_id' => $val['id']])->select();
                        $service_list = M()->query($sql);
                        foreach ($service_list as $sv) {
                            $user_card[] = [
                                "order_id" => $_POST['order_id'],
                                "goods_id" => $val['id'],
                                "type" => $val['goods']['type'],
                                "uid" => $this->memberinfo['id'],
                                "service_id" => $sv['id'],
                                "name" => $sv['name'],
                                "desc"=>"",
                                "num" => $val['num'] * $sv['num'],
                                "surplus_num" => $val['num'] * $sv['num'],
                                "used_num" => 0,
                                "start_time" => time(),
                                "end_time" => time() + strtotime("+ " . $val['goods']['effect_day'] . " day")
                            ];
                        }
                        break;
                    case 2:
                        $user_card[] = [
                            "order_id" => $_POST['order_id'],
                            "goods_id" => $val['id'],
                            "type" => $val['goods']['type'],
                            "uid" => $this->memberinfo['id'],
                            "service_id" => $val['attr']['id'],
                            "name" => $val['goods']['name'],
                            "desc"=>$val['attr']['f_name'],
                            "num" => $val['num'],
                            "surplus_num" => $val['num'],
                            "used_num" => 0,
                            "start_time" => time(),
                            "end_time" => time() + strtotime("+ " . $val['goods']['effect_day'] . " day")
                        ];

                        break;
                    case 3:
                        $goods_list = M("goods_packlist")->where(['f_goods_id' => $val['id'],'f_attr_id'=>$val['attr']['id']])->select();
                        foreach($goods_list as $l_val)
                        {
                            //服务类
                            if($l_val['goods_type']==1)
                            {
                              //  $service_goods_ids.=$val['goods_id'].",";
                                  $sql="select s.name,sl.* from hh_service_list as sl LEFT JOIN hh_service_model as s on s.id= sl.service_model_id where sl.goods_id = ".$l_val['goods_id'];
                                   $service_list=M()->query($sql);
                                   foreach ($service_list as $s_val)
                                   {
                                       $user_card[] = [
                                           "order_id" => $_POST['order_id'],
                                           "goods_id" => $val['id'],
                                           "type" => $l_val['goods_type'],
                                           "uid" => $this->memberinfo['id'],
                                           "service_id" => $s_val['service_model_id'],
                                           "name" => $s_val['name'],
                                           "desc"=>"",
                                           "num" => $val['num']*$l_val['num']*$s_val['num'],
                                           "surplus_num" => $val['num']*$l_val['num']*$s_val['num'],
                                           "used_num" => 0,
                                           "start_time" => time(),
                                           "end_time" => time() + strtotime("+ " . $val['goods']['effect_day'] . " day")
                                       ];

                                   }

                            }else{
                              //  $goods_attr_ids.=$val['attr_id'].",";
                                $sql="select g.name as goods_name,gt.* from hh_goods_attr as gt LEFT JOIN hh_goods as g on g.id = gt.goods_id where gt.id = ".$l_val['attr_id'];
                                $goods_info=M()->query($sql)[0];
                                //实物类
                                $user_card[] = [
                                    "order_id" => $_POST['order_id'],
                                    "goods_id" => $val['id'],
                                    "type" => $l_val['goods_type'],
                                    "uid" => $this->memberinfo['id'],
                                    "service_id" => $l_val['attr_id'],
                                    "name" => $goods_info['goods_name'],
                                    "desc"=>$goods_info['f_name'],
                                    "num" => $val['num']*$l_val['num'],
                                    "surplus_num" => $val['num']*$l_val['num'],
                                    "used_num" => 0,
                                    "start_time" => time(),
                                    "end_time" => time() + strtotime("+ " . $val['goods']['effect_day'] . " day")
                                ];
                            }
                           // $goodsnum[]=['goods_id'=>$val['goods_id'],'attr_id'=>$val['attr_id'],'num'=>$val['num']];
                        }
                        break;
                }
            }
            //保存到用户卡包
            M("user_card")->addAll($user_card);
            
         //   $service_goods_ids=rtrim($service_goods_ids,',');
          //  $goods_attr_ids=rtrim($goods_attr_ids,',');
          //  $sql="select s.name sl.* from hh_service_list as sl LEFT JOIN hh_service_model as s on s.id= sl.service_model_id where sl.goods_id in ($service_goods_ids)";
         //   $service_list=M()->query($sql);
         //   foreach ($service_list as $val)


        } else {
            //需要在线支付

        }
        //调整用户余额
        if ($_POST["balance"] > 0 || $pay > 0) {
            if ($this->account(-$_POST["balance"], -$pay, "订单" . $_POST['order_sn'] . "支付" . ($total - $order_coupon) . "元")) {
                $this->memberinfo['money'] = $this->memberinfo['money'] - $_POST["balance"];
                json_return(0, "下单成功", $this->memberinfo);
            }
        }
        json_return(96, "订单异常");
        //生成订单商品列表
        //返回需要支付的价格


    }

    /**
     * 生成唯一订单号
     */
    public function build_order_no()
    {
        $no = date('Ymd') . substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
        //检测是否存在
        $info = M("order")->where(array('order_sn' => $no))->find();
        (!empty($info)) && $no = $this->build_order_no();
        return $no;

    }

    function usercoupon()
    {
        $goods = json_decode($_POST['goods'], true);
        $coupon = $this->getusercoupon($goods);
        json_return(0, "", ['num' => count($coupon), "list" => $coupon]);
    }

    /**
     * 获取用户可用优惠卷
     *
     */
    function getusercoupon($goods)
    {

        //判断优惠卷范围
        $now = date("Y-m-d H:i:s");
        $sql = "select c.*,uc.name,uc.desc,uc.thumb,uc.type,uc.details,uc.worth,uc.class_list,
              uc.goods_list,uc.c_man,uc.c_jian from hh_user_coupon as c left join hh_coupon as uc
               on c.coupon_id=uc.id where c.uid = " . $this->memberinfo["id"] . " and c.status = 0 and c.effective 
               < '" . $now . "' and c.expiration > '" . $now . "'";
        $coupon = M()->query($sql);
        foreach ($coupon as $k => $v) {
            //不适用
            $coupon[$k]['ok'] = false;
            $coupon[$k]['select_id'] = $coupon[$k]['select_attr'] = -1;
            //全品类优惠
            if (!$v['goods_list'] && !$v['class_list']) {
                $coupon[$k]['ok'] = true;
                $coupon[$k]['c_type'] = 1;
                foreach ($goods as $gk => $gv) {
                    $coupon[$k]['goods'][] = $gv['id'];
                }
                continue;
            }
            //适用商品和分类
            foreach ($goods as $gk => $gv) {
                $goodsarr = explode(',', $v['goods_list']);
                if (in_array($gv['id'], $goodsarr)) {
                    $coupon[$k]['ok'] = true;
                    $coupon[$k]['c_type'] = 2;
                    $coupon[$k]['c_id'] = $gv['id'];
                    $coupon[$k]['goods'][] = $gv['id'];
                    break;
                }
                $goodsclass = explode(',', $v['class_list']);
                if (in_array($gv['goods']['classify'], $goodsclass)) {
                    $coupon[$k]['ok'] = true;
                    $coupon[$k]['c_type'] = 3;
                    $coupon[$k]['c_id'] = $gv['goods']['classify'];
                    $coupon[$k]['goods'][] = $gv['id'];
                    break;
                }
            }
        }
        foreach ($coupon as $k => $v) {
            $coupon[$k]['select'] = false;
            if (!$v['ok']) {
                unset($coupon[$k]);
            }
            if ($v['type'] == 1) {
                $coupon[$k]['worth'] = $coupon[$k]["c_jian"];
                $coupon[$k]['worth_title'] = "减";
                $coupon[$k]['worth_man_title'] = "满";
                $coupon[$k]['worth_man'] = $coupon[$k]["c_man"];
            } else {
                $coupon[$k]['worth_title'] = "￥";
                $coupon[$k]['worth_man_title'] = "消费";
                $coupon[$k]['worth_man'] = $coupon[$k]["min_consume"] ? $coupon[$k]["min_consume"] : 0;
            }
        }
        return array_values($coupon);
    }

    //订单提交页所需信息
    public function getordersubinfo()
    {
        //优惠卷
        $goods = json_decode($_POST['goods'], true);
        $coupon = $this->getusercoupon($goods);
        //支付方式
        $pay = M("pay")->where(['status' => 1])->select();
        json_return(0, '', ['coupon' => $coupon, 'pay' => $pay, "coupon_length" => count($coupon)]);
    }

    //订单列表
    public function getorderlist()
    {
        $page=$_POST['page']?$_POST['page']:0;
        $size=5;
        $start=$page*$size;
        $condition['uid'] = $this->memberinfo['id'];
        intval($_POST['status']) > -1 && $condition['pay_status'] = intval($_POST['status']);
        $orderlist = M("order")->where($condition)->limit($start,$size)->select();
        $ordertotal=M("order")->where($condition)->count();
        $order_ids="";
        foreach ($orderlist as $val)
        {
            $order_ids.=$val['id'].',';
        }
        $order_ids=rtrim($order_ids,',');
        //   $goodslist=M("order_goods")->where(['order_id'=>['in',$order_ids]])->select();
        $order_ids or json_return(0, "", ['list'=>$orderlist,'total'=>$ordertotal]);
        $sql="select og.*,g.name,g.thumb from  hh_order_goods as og left JOIN hh_goods as g on g.id = og.goods_id where og.order_id in ($order_ids)";
        $goodslist=M()->query($sql);
        $attr_ids='';
        foreach ($goodslist as $val)
        {
            $attr_ids.=$val['attr_id'].",";
        }
        $attr_ids=rtrim($attr_ids,',');
        $attr_list=M("goods_attr")->where(['id'=>['in',$attr_ids]])->select();
        foreach ($goodslist as $key=>$val)
        {
            foreach ($attr_list as $aval)
            {
                if($val['attr_id']==$aval['id'])
                {
                    $goodslist[$key]['attr_name']=$aval["f_name"];
                }
            }
        }
        foreach ($orderlist as $key=>$val)
        {
            foreach ($goodslist as $gval)
            {
                if($gval['order_id'] == $val['id'])
                {
                    $orderlist[$key]['goods'][]=$gval;
                }
            }
        }


        json_return(0, "", ['list'=>$orderlist,'total'=>$ordertotal]);
    }
}