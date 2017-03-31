let d = {
  list: [
    {
      name: "文艺路店",
      isBrand: true,
      logo: 1,
      scores: 3.5,
      sale: 4013,
      bao: true,
      piao: true,
      ontime: true,
      fengniao: true,
      startPay: "自动洗车",
      deliverPay: "人工干洗",
      evOnePay: "线上支付",
      journey: "250m",
      time: "35分钟",
      activities: [
        {key: "减", text: "满99减10，满199减30，满499减60"},
        {key: "抵", text: "首次洗车赠现金劵"}
      ]
    },
      {
          name: "天安门店",
          isBrand: true,
          logo: 1,
          scores: 3.5,
          sale: 4013,
          bao: true,
          piao: true,
          ontime: true,
          fengniao: true,
          startPay: "自动洗车",
          deliverPay: "人工干洗",
          evOnePay: "线上支付",
          journey: "250m",
          time: "35分钟",
          activities: [
              {key: "减", text: "满99减10，满199减30，满499减60"},
              {key: "抵", text: "首次洗车赠现金劵"}
          ]
      },
      {
          name: "旗舰店",
          isBrand: true,
          logo: 1,
          scores: 3.5,
          sale: 4013,
          bao: true,
          piao: true,
          ontime: true,
          fengniao: true,
          startPay: "自动洗车",
          deliverPay: "人工干洗",
          evOnePay: "线上支付",
          journey: "250m",
          time: "35分钟",
          activities: [
              {key: "减", text: "满99减10，满199减30，满499减60"},
              {key: "抵", text: "首次洗车赠现金劵"}
          ]
      },
      {
          name: "文艺路店",
          isBrand: true,
          logo: 1,
          scores: 3.5,
          sale: 4013,
          bao: true,
          piao: true,
          ontime: true,
          fengniao: true,
          startPay: "自动洗车",
          deliverPay: "人工干洗",
          evOnePay: "线上支付",
          journey: "250m",
          time: "35分钟",
          activities: [
              {key: "减", text: "满99减10，满199减30，满499减60"},
              {key: "抵", text: "首次洗车赠现金劵"}
          ]
      },
      {
          name: "文艺路店",
          isBrand: true,
          logo: 1,
          scores: 3.5,
          sale: 4013,
          bao: true,
          piao: true,
          ontime: true,
          fengniao: true,
          startPay: "自动洗车",
          deliverPay: "人工干洗",
          evOnePay: "线上支付",
          journey: "250m",
          time: "35分钟",
          activities: [
              {key: "减", text: "满99减10，满199减30，满499减60"},
              {key: "抵", text: "首次洗车赠现金劵"}
          ]
      },
  ],
    orderData: [
        {
            title: "100元快洗服务",
            logo: 14,
            state: "订单已完成",
            time: "2016-09-05 12:11",
            info: "100元快洗服务",
            price: "￥100"
        },
        {
            title: "100元快洗服务",
            logo: 14,
            state: "订单已完成",
            time: "2016-09-05 12:11",
            info: "100元快洗服务",
            price: "￥100"
        }
    ],
  breakFastData: [
    {
      title: "机油一瓶",
      logo: 1,
      state: "订单已完成",
      time: "2016-04-01 09:11",
      info: "机油一瓶+换机汕",
      price: "￥37"
    }
  ]
}
let pics = ["h0","h1","h2","h3","h4","h6","h8","h9","h10","h11","h12","h13","h14","h15","hot3","sale0","sale1","sale2","sale3"]
let len = pics.length
let goods = {
  "美容": [
    {name: "自动洗车", info:"快捷 干净", sale:"月洗801次 好评率100%", price:10, image:1},
    {name: "人工干洗", info:"午餐头~腐竹~宽粉~金针菇~油菜~红薯~娃娃菜~豆皮~千叶豆腐", sale:"月售536份 好评率95%", price:20, image:1},


  ],
  "安装": [
      {name: "自动洗车", info:"快捷 干净", sale:"月洗801次 好评率100%", price:10, image:1},
      {name: "人工干洗", info:"午餐头~腐竹~宽粉~金针菇~油菜~红薯~娃娃菜~豆皮~千叶豆腐", sale:"月售536份 好评率95%", price:20, image:1},


  ],
  "轮胎": [
      {name: "自动洗车", info:"快捷 干净", sale:"月洗801次 好评率100%", price:10, image:1},
      {name: "人工干洗", info:"午餐头~腐竹~宽粉~金针菇~油菜~红薯~娃娃菜~豆皮~千叶豆腐", sale:"月售536份 好评率95%", price:20, image:1},

  ],
  "保养": [
      {name: "自动洗车", info:"快捷 干净", sale:"月洗801次 好评率100%", price:10, image:1},
      {name: "人工干洗", info:"午餐头~腐竹~宽粉~金针菇~油菜~红薯~娃娃菜~豆皮~千叶豆腐", sale:"月售536份 好评率95%", price:20, image:1},

  ]
}
Object.keys(goods).forEach((item, i) => {
  goods[item].forEach((e, j) => {
    goods[item][j].key = i+"-"+j
    //goods[item][j].image = pics[Math.floor(Math.random()*len)]
  })
})
d.goods = goods
export default d
