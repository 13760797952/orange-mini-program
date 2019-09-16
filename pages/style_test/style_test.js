//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: "//static.o-home.com/v3/views/wap/page/questionnaire2/img",
    choices: {
      house: [
        {
          bfImg: "h_1_4e42c49.png",
          atImg: "h_1h_f959708.png",
          text: "一居"
        }, {
          bfImg: "h_2_3b5d4fb.png",
          atImg: "h_2h_5376f61.png",
          text: "二居"
        }, {
          bfImg: "h_3_292780c.png",
          atImg: "h_3h_2fc69a0.png",
          text: "三居"
        }, {
          bfImg: "h_4_516e4e5.png",
          atImg: "h_4h_a5fa30c.png",
          text: "四居"
        }
      ],
      sex: [
        {
          bfImg: "2_xb_1_00b1989.png",
          atImg: "2_xb_1h_29224d3.png",
          text: "男"
        }, {
          bfImg: "2_xb_2_28e5f4d.png",
          atImg: "2_xb_2h_022ed63.png",
          text: "女"
        },
      ],
      age: [
        {
          bfImg: "2_nl_1_c5147d9.png",
          atImg: "2_nl_1h_978e79a.png",
          text: "35岁以下"
        }, {
          bfImg: "2_nl_2_7a7e27c.png",
          atImg: "2_nl_2h_edc6781.png",
          text: "35-45岁"
        }, {
          bfImg: "2_nl_3_46121cd.png",
          atImg: "2_nl_3h_0effcfa.png",
          text: "45岁以上"
        },
      ],
      animal: [
        {
          img: "tiger_fdc0257.jpg",
          text: "老虎"
        }, {
          img: "owl_d3c2f26.jpg",
          text: "猫头鹰"
        }, {
          img: "koala_a895594.jpg",
          text: "考拉"
        }, {
          img: "peafowl_ea5e3cf.jpg",
          text: "孔雀"
        },
      ],
      draw: [
        {
          img: "draw_1_c1a7b7e.jpg",
          text: "A"
        }, {
          img: "draw_2_9557533.jpg",
          text: "B"
        }, {
          img: "draw_3_0f5c5d7.jpg",
          text: "C"
        }, {
          img: "draw_4_e3e156d.jpg",
          text: "D"
        }
      ]
    },
    aniResult: [
      {
        "img": "tiger_fdc0257.jpg",
        "name": "老虎",
        "style": "掌控力强，做决定不犹豫，此外，计划性强是您的显著特征，对散漫和无计划几乎0容忍。"
      },{
        "img": "owl_d3c2f26.jpg",
        "name": "猫头鹰",
        "style": "凡事力求精准，对品质和质量要求很高。做事极有条理，擅长分析，逻辑性极强。不论是工作中还是生活中，都是相当有责任感的人。"
      },{
        "img": "koala_a895594.jpg",
        "name": "考拉",
        "style": "行事稳健是您最显著的特征，做事踏实，您是路遥知马力的正面典型。性情温和，力求避免冲突。偶尔因为要顾全太多人，而略显纠结。"
      },{
        "img": "peafowl_ea5e3cf.jpg",
        "name": "孔雀",
        "style": "热情又幽默，乐观也和善，跳跃式的思维是你的显著特征，让你的好点子层出不穷。"
      }
    ],
    drawResult: [
      {
        "style": "简约但不简单的现代风",
        "img": [
          "xd-01_704fd65.jpg",
          "xd-02_b1d382b.jpg",
          "xd-03_13db2bc.jpg",
          "xd-04_1dd17ae.jpg"
        ]
      },{
        "style": "大气稳重的欧式风格",
        "img": [
          "os-01_ebff81f.jpg",
          "os-02_6603b76.jpg",
          "os-03_5ebc86d.jpg",
          "os-04_7d3988d.jpg"
        ]
      },{
        "style": "配色清新、清爽的田园风",
        "img": [
          "ty-01_29d5fdc.jpg",
          "ty-02_58dd600.jpg",
          "ty-03_c0e7253.jpg",
          "ty-04_76f1ec1.jpg"
        ]
      },{
        "style": "怀旧与典雅的中国风",
        "img": [
          "zs-01_f0246b8.jpg",
          "zs-02_4d22b71.jpg",
          "zs-03_a4ec025.jpg",
          "zs-04_49538a3.jpg"
        ]
      }
    ],
    sgjd: {
      img: ["zxjd_1_861ff8f.jpg", "zxjd_2_00ea703.jpg", "zxjd_3_fa3cdad.jpg"],
      text: [
        "为您提供VIP服务，有问题，直接通过app一键告知。不会出现有问题，找不到责任人的情况。装修进程和装修质量尽在掌控！",
        "施工1：1还原效果图，所见即所得；蕴含着90道工艺和240道工法，每一步您全程可见！",
        "装修管家每日发送施工报告，工作再忙，施工质量也能尽在掌握！"
      ]
    },
    showCSIndex: 1,
    changed: {
      house: null,
      sex: null,
      age: null,
      animal: null,
      draw: null
    },
    phoneNumber: '',
    vailCode: '',
    is_getCode: false,
    codeBtnText: '获取验证码',
    sgjdIndex: 0,
    showResult: false
  },
  onLoad: function () {
   
  },
  ceshiNext: function (e){
    let name = e.currentTarget.dataset.name;
    let value = e.currentTarget.dataset.value;
    let changed = this.data.changed;
    let csIndex = this.data.showCSIndex;
    if(name=='age'&&changed.sex==null){
      wx.showToast({
        title: '请选择您的性别！',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    changed[name] = value;
    this.setData({
      changed: changed
    });
    if(name!='sex'){
      setTimeout(()=>{
        csIndex++;
        this.setData({
          showCSIndex: csIndex
        })
      },500)
    }
  },
  ceshiPrev: function (){
    let csIndex = this.data.showCSIndex;
    csIndex--;
    this.setData({
      showCSIndex: csIndex
    })
  },
  inputMobile: function (e){
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  getVailCode: function (e){
    let that = this;
    let phone = this.data.phoneNumber;
    if (phone == "") {
      wx.showToast({
        title: '请输入您的手机号！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.showLoading({
      title: '请求中..',
    });
    wx.request({
      url: 'https://ocapi.o-home.com/web/sms_validation/sendValidationCode/'+phone,//相应的域名链接
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data;
        if (data.code==0) {
          that.setData({
            is_getCode: true
          });
          wx.showToast({
            title: data.message,
            icon: 'success',
            duration: 1500
          });
          that.settime();
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 1500
          });
        }
        if (data.error) {
          wx.showToast({
            title: '请稍后重试！',
            icon: 'none',
            duration: 1500
          });
        }
      },
      complete: function (){
        wx.hideLoading();
      }
    })
  },
  settime: function () { //开启验证码倒计时
    let that = this;
    let countdown = 60;
    var timer = setInterval(function (){
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        countdown = 60;
        that.setData({
          codeBtnText: "重新获取",
          is_getCode: false
        });
      } else {
        that.setData({
          codeBtnText: "已发送(" + countdown + ")"
        })
      }
    }, 1000)
  },
  inputCode: function (e){
    this.setData({
      vailCode: e.detail.value
    })
    console.log(e.detail.value)
  },
  getStyle: function (e){
    let that = this;
    let codeData = {
      phoneNumber: e.detail.value.mobile,
      code: this.data.vailCode
    };
    if (codeData.phoneNumber == "") {
      wx.showToast({
        title: '请输入您的手机号！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(codeData.phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (codeData.code == "") {
      wx.showToast({
        title: '请输入接收的验证码！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    var reg = new RegExp("^[0-9]{4}$");
    if (!reg.test(codeData.code)) {
      wx.showToast({
        title: '验证码为4位数字！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.showLoading({
      title: '请求中..',
    });
    wx.request({
      url: 'https://ocapi.o-home.com/web/sms_validation/validateCode',//相应的域名链接
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: codeData,
      success: function (res) {
        console.log(res)
        let data = res.data;
        if (data.code == 0) {
          wx.showToast({
            title: data.message,
            icon: 'success',
            duration: 1500
          });
          let choices = that.data.choices;
          let changed = that.data.changed;
          let obj = {
            Phone_Number: codeData.phoneNumber,
            remark: "户型：" + choices.house[changed.house].text 
                    + ";性别：" + choices.sex[changed.sex].text 
                    + ";年龄：" + choices.age[changed.age].text
          };
          that.appoint(obj);
          that.setData({
            showResult: true
          })
        } else {
          wx.showToast({
            title: "验证失败！",
            icon: 'none',
            duration: 1500
          });
        }
        if (data.error) {
          wx.showToast({
            title: '请稍后重试！',
            icon: 'none',
            duration: 1500
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  appoint: function (obj,callBack=()=>{}) {
    var that = this;
    var data = {
      //用户名必填
      Nickname: "",
      //电话号码
      Phone_Number: obj.Phone_Number,
      //地区
      Location: '',
      //标记
      Data_Type: 'XCXSTYLE',
      //来源
      comefrom: 'WX',
      //为1的话可以不用用户名
      mark: 1,
      //1为抢单,0为派单
      is_rob: 0,
      //面积
      mianji: '',
      //是否发短信1为发送
      send: 0,
      //备注
      remark: "小程序/风格测试:"+obj.remark,
      //员工编号
      // salesCode: salesCode,
      // storeCode: storeCode,
      //智能客服类型
      KefuType: 'none'
    };
    if (data.Phone_Number == "") {
      wx.showToast({
        title: '请输入您的手机号！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(data.Phone_Number)) {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    var swoopNum = that.GetStorageSync("swoopNum");
    if (swoopNum > 4) {
      wx.showModal({
        title: '提示',
        content: "今天的名额已经用完啦！",
        showCancel: false
      });
      return false;
    }
    wx.showLoading({
      title: '请求中..',
    });
    wx.request({
      url: 'https://www.o-home.com/wap/swoop/saveSwoop',//相应的域名链接
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.error || !res.data.code) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        } else {
          if (!swoopNum) {
            that.SetStorageSync("swoopNum", 1);
          } else {
            that.SetStorageSync("swoopNum", parseInt(swoopNum) + 1);
          }
          callBack()
        }
      },
      complete: function (){
        wx.hideLoading();
      }
    })
  },
  SetStorageSync: function (key, value) {
    wx.setStorageSync(key, value)
    var timestamp = new Date().getTime()
    // 设置24小时后过期
    var remove_time = 3600000 * 24 + timestamp
    wx.setStorageSync(key + 'remove', remove_time)
  },
  GetStorageSync: function (key, value) {
    var remove_time = wx.getStorageSync(key + 'remove')
    var timestamp = new Date().getTime()
    var res = ''
    if (timestamp > remove_time) {
      // 过期
      wx.removeStorageSync(key)
    } else {
      res = wx.getStorageSync(key)
    }
    return res
  },
  swiperChange: function (e){
    let current = e.detail.current;
    console.log(current)
    this.setData({
      sgjdIndex: current
    })
  },
  onShareAppMessage: function () {
    return {
      title: '',
      path: '',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  }
})
