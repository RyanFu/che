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

    //检测订单
    public function checkorder()
    {
        //校验商品属性库存   价格  计算价格。
        $goodslist = json_decode($_POST['goods'], true);
        $editarr = [];
        $total = 0;
        $order_coupon = 0;
        file_put_contents("a.log", print_r($goodslist, true));
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
            //校验优惠劵有效性，计算价格
            if ($val['choosenum'] > 0) {
                $coupon_total = 0;
                foreach ($val['couponlist'] as $cv) {
                    //检测此劵有效性
                    $sql = "select c.*,uc.name,uc.desc,uc.thumb,uc.type,uc.details,uc.worth,uc.class_list," .
                        "uc.goods_list,uc.manjian from hh_user_coupon as c left join hh_conpon as uc" .
                        "on c.coupon_id=uc.id where c.id =" . $cv['id'];
                    $thecoupon = M()->query($sql);
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
                        in_array($val['id'], $coupongoods) and $isok = true;
                    }
                    if (!$isok && $thecoupon['class_list']) {
                        $couponclass = explode(',', thecoupon['class_list']);
                        in_array($val['classify'], $couponclass) and $isok = true;
                    }
                    $isok or json_return(5, "优惠劵" . $cv["name"] . "不能使用于商品 " . $val['goods']['name'], ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                    //处理满减劵
                    if ($thecoupon['type'] == 1) {
                        $jian = unserialize($thecoupon['manjian'])[0]["jian"];
                        $man = unserialize($thecoupon['manjian'])[0]["man"];
                        //是否达到满减数额
                        $val['total'] >= $man or json_return(6, "优惠劵" . $cv["name"] . "未达到满减金额 " . $val['goods']['name'], ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                        $coupon_total += $jian;
                    } else {
                        //处理抵扣劵
                        //是否达到最底消费
                        $val['total'] >= $thecoupon['min_consume'] or json_return(6, "优惠劵" . $cv["name"] . "未达到使用的最低金额 " . $val['goods']['name'], ["type" => $val['goods']['type'], 'id' => $cv['id']]);
                        $coupon_total += $thecoupon['worth'];
                    }
                }
                $coupon_total > $val['total'] or $coupon_total = $val['total'];
                $order_coupon += $coupon_total;
            }
        }
        //余额有效性检测
        $this->memberinfo['money'] > $_POST["balance"] or json_return(7, "余额不足");
        //效验提交的需支付的金额
        $pay=$total-$coupon_total-$_POST["balance"];
        $pay>=0&&$pay==$_POST['pay'] or json_return(8,"待付金额有误");




        //生成商品订单和支付订单
        $order_sn = $this->build_order_no();
        $order = array(
            "order_sn" => $order_sn,
        );


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
              uc.goods_list,uc.manjian from hh_user_coupon as c left join hh_conpon as uc
               on c.coupon_id=uc.id where c.uid = " . $this->memberinfo[id] . " and c.status = 0 and c.effective 
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
                $coupon[$k]['worth'] = unserialize($coupon[$k]['manjian'])[0]["jian"];
                $coupon[$k]['worth_title'] = "减";
                $coupon[$k]['worth_man_title'] = "满";
                $coupon[$k]['worth_man'] = unserialize($coupon[$k]['manjian'])[0]["man"];
            } else {
                $coupon[$k]['worth_title'] = "￥";
                $coupon[$k]['worth_man_title'] = "消费";
                $coupon[$k]['worth_man'] = $coupon[$k]["min_consume"] ? $coupon[$k]["min_consume"] : 0;
            }
        }
        file_put_contents("a.log", print_r($coupon, true));
        return array_values($coupon);
    }

    //提交订单
    function subOrder()
    {


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

}