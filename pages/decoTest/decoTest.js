//index.js
//获取应用实例
const app = getApp();

var wxSys = wx.getSystemInfoSync();
var screenScale = wxSys.screenWidth * 2 / 750;
var numCount = 6;  //元素个数
var numSlot = 5;  //一条线上的总节点数
var mW = wxSys.screenWidth;  //Canvas的宽度
var mH = wxSys.screenWidth * 1.88;
var mCenter = mW / 2; //中心点
var mMiddle = mW / 2 + 30;
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenter - 50; //半径(减去的值用于给绘制的文本留空间)
//获取指定的Canvas
var radCtx = wx.createCanvasContext("radarCanvas");

Page({
  data: {
    imgUrl: "//static.o-home.com/v3/views/wap/page/deco_intro/img/",
    newImgUrl: "https://media.o-home.com/ohome-php/assets/image/deco_test/",
    // 装修问答
    questions: [
      {
        name: "experience",
        qspic: "qs01.jpg",
        speakpic: "speak01.png",
        question: "Q1 你装修过吗？",
        radioList: [
          { answer: "A 装修小白", gear: 1, checked: false },
          { answer: "B 装修过一次", gear: 2, checked: false },
          { answer: "C 多套房的土豪", gear: 3, checked: false }
        ]
      }, {
        name: "time",
        qspic: "qs02.jpg",
        speakpic: "speak02.png",
        question: "Q2 装修多久比较好？",
        radioList: [
          { answer: "A 一个月内要快", gear: 1, checked: false },
          { answer: "B 不超过45天就好", gear: 2, checked: false },
          { answer: "C 无所谓 装的好就好", gear: 3, checked: false }
        ]
      }, {
        name: "budget",
        qspic: "qs03.jpg",
        speakpic: "speak03.png",
        question: "Q3 你的装修预算是多少？",
        radioList: [
          { answer: "A 5-8万", gear: 2, checked: false },
          { answer: "B 8-15万", gear: 4, checked: false },
          { answer: "C 无所谓 豪就行", gear: 5, checked: false }
        ]
      }, {
        name: "style",
        qspic: "qs04.jpg",
        speakpic: "speak04.png",
        question: "Q4 你喜欢下面哪个style？",
        radioList: {
          style: ["choice4-01.png", "choice4-02.png", "choice4-03.png"],
          diban: ["choice4-04.png", "choice4-05.png", "choice4-06.png"]
        }
      }, {
        name: "work",
        qspic: "qs05.jpg",
        speakpic: "speak05.png",
        question: "Q5 这样的选择，你还要做600次，至少跑80家店，跟200人打交道",
        radioList: [
          { answer: "A 没关系，我超喜欢", gear: 3, checked: false },
          { answer: "B 老司机带带我！", gear: 2, checked: false },
          { answer: "C 求你，别让我选", gear: 1, checked: false }
        ]
      }, {
        name: "together",
        qspic: "qs06.jpg",
        speakpic: "speak06.png",
        question: "Q6 谁将和你一起装修？",
        radioList: [
          { answer: "A 和老爸老妈，他们审美超好", gear: 1 },
          { answer: "B 和伴侣一起，顺便考验感情", gear: 2 },
          { answer: "C 我很坚强，都靠自己，汪~", gear: 3 }
        ]
      },
    ],
    loadPic: ["home05_27311a8.png", "home04_efc255f.png", "home03_9412044.png", "home02_0047d69.png", "shafa_91859ae.png"],
    loadNum: 0,
    loadingTimer: null,
    isLoading: false,
    currentPage: 1,
    currentQs: 0,
    changedList: {
      experience: null,
      time: null,
      budget: null,
      style: null,
      diban: null,
      work: null,
      together: null
    },
    wxSys: wxSys,
    // 雷达图数据
    chanelArray1: [
      { name: "budget", text: "财力", score: 0 },
      { name: "together", text: "创造力", score: 0 },
      { name: "work", text: "领导力", score: 0 },
      { name: "time", text: "耐力", score: 0 },
      { name: "experience", text: "经验", score: 0 },
      { name: "style", text: "审美", score: 0 }
    ],
    resultList: [
      {
        name: "开拓者",
        style: "只选贵的富贵风",
        rep: "李湘",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-1.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-1.jpg",
      }, {
        name: "宠爱者",
        style: "城堡庄园公主风",
        rep: "Angelababy",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-2.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-2.jpg",
      }, {
        name: "能力者",
        style: "智能黑科技风",
        rep: "王思聪",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-3.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-3.jpg",
      }, {
        name: "享乐者",
        style: "只选贵的富贵风",
        rep: "大张伟",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-4.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-4.jpg",
      }, {
        name: "随遇而安者",
        style: "毛坯极简出租风",
        rep: "华晨宇",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-5.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-5.jpg",
      }, {
        name: "精致者",
        style: "浪漫宫廷风",
        rep: "许晴",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-6.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-6.jpg",
      }, {
        name: "完美者",
        style: "华美典雅风",
        rep: "刘嘉玲",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-7.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-7.jpg",
      }, {
        name: "品味者",
        style: "私人美术馆风",
        rep: "林依轮",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-8.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-8.jpg",
      }, {
        name: "理智者",
        style: "天生贵族优雅风",
        rep: "郭晶晶霍启刚",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-9.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-9.jpg",
      }, {
        name: "独立者",
        style: "温暖工业风",
        rep: "井柏然",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-10.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-10.jpg",
      }, {
        name: "不羁者",
        style: "简约混搭风",
        rep: "应采儿",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-11.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-11.jpg",
      }, {
        name: "艺术者",
        style: "世外桃源风",
        rep: "杨丽萍",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-12.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-12.jpg",
      }, {
        name: "魔力者",
        style: "无限视野风",
        rep: "周杰伦",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-13.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-13.jpg",
      }, {
        name: "自然者",
        style: "清新原木风",
        rep: "范玮琪",
        stylePic: "https://media.o-home.com/ohome-php/assets/image/deco_test/style-14.jpg",
        repPic: "https://media.o-home.com/ohome-php/assets/image/deco_test/rep-14.jpg",
      },
    ],
    userInfo: "",
    result: "",
    radarImg2: '',
    showModalStatus: false,
    animationData: '',
    isAppointed: false
  },
  onLoad: function () {
    let that = this;

  },
  showPage: function (e) {
    let page = e.currentTarget.dataset.page;
    this.setData({
      currentPage: page
    })
  },
  radioChange: function (e) {
    let name = e.currentTarget.dataset.name;
    let value = e.currentTarget.dataset.value;
    let index = this.data.currentQs;
    let changedList = this.data.changedList;

    changedList[name] = parseInt(value);
    this.setData({
      changedList: changedList
    });

    if (name == "style" || name == "diban") {
      if (changedList.style == null || changedList.diban == null) {
        return;
      }
    }

    index++;
    setTimeout(() => {
      this.setData({
        currentQs: index
      })
    }, 500)
  },
  showResult: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let value = e.currentTarget.dataset.value;
    let changedList = this.data.changedList;

    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showModal({
        title: '提示',
        content: "拒绝授权将不能获取测试结果",
        showCancel: false
      })
      return;
    } else {//同意授权

      this.showLoading();
      changedList[name] = parseInt(value);
      this.setData({
        changedList: changedList,
        userInfo: e.detail.userInfo
      });

      this.getRules();
      this.scoring();

      let result = this.data.result;

      // 下载所有要绘制的图片
      var p1 = this.getImageInfo("https://static.o-home.com/v3/views/wap/page/deco_intro/img/bg_170021e.jpg", "bg")
      var p2 = this.getImageInfo("https://media.o-home.com/ohome-php/assets/image/deco_test/logo1.png", "logo")
      var p3 = this.getImageInfo(result.repPic, "rep")
      var p4 = this.getImageInfo(result.stylePic, "style")
      var p5 = this.getImageInfo(that.data.userInfo.avatarUrl, "avatar")

      Promise.all([p1, p2, p3, p4, p5])
        .then(() => {
          this.setData({
            currentPage: 3
          })
          this.drawResult()
        })
        .catch(data => {
          console.log(data)
        })
    }
  },
  // 适合风格、代表人物筛选规则
  getRules: function () {
    let changedList = this.data.changedList;
    let random, result;

    if (changedList.budget >= 4) {
      random = this.getRandomNum(0, 2);
      result = this.data.resultList[random];
      this.setData({
        result: result
      })
      return;
    }
    if (changedList.together == 3) {
      random = this.getRandomNum(3, 5);
      result = this.data.resultList[random];
      this.setData({
        result: result
      })
      return;
    }
    if (changedList.work == 3) {
      random = this.getRandomNum(6, 7);
      result = this.data.resultList[random];
      this.setData({
        result: result
      })
      return;
    }
    if (changedList.work == 2) {
      result = this.data.resultList[8];
      this.setData({
        result: result
      })
      return;
    }
    random = this.getRandomNum(9, 13);
    result = this.data.resultList[random];
    console.log(result)
    this.setData({
      result: result
    })
  },
  // 打分
  scoring: function () {
    let random;
    let mData = this.data.chanelArray1;
    let changedList = this.data.changedList;
    for (var k in changedList) {
      for (var j = 0; j < mData.length; j++) {
        if (k == mData[j].name) {
          if (k == "style") {
            random = this.getRandomNum(100, Math.round(500 / 3));
            mData[j].score = random;
          } else {
            let gear = changedList[k];
            mData[j].score = this.getRandomNum(Math.ceil(gear * 100 / 3), Math.ceil((gear+1) * 100 / 3))
          }
        }
      }
    }
  },
  // 获取最小值到最大值之前的整数随机数
  getRandomNum: function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
  },
  showLoading: function () {
    let that = this;
    let n = 0;
    this.setData({
      isLoading: true
    })
    this.data.loadTimer = setInterval(() => {
      n = n > 4 ? 0 : n;
      this.setData({
        loadNum: n
      })
      n++;
    }, 1000)
  },
  hideLoading: function () {
    clearInterval(this.data.loadTimer);
    this.setData({
      isLoading: false
    })
  },

  drawResult: function () {
    let that = this;
    let bgUrl = wx.getStorageSync("bgurl");
    // 背景图
    if (typeof (bgUrl) != 'undefined' && bgUrl != '') {
      radCtx.drawImage(bgUrl, 0, 0, mW, mH);
    }
    this.drawRadar();
    this.drawOther();
    //开始绘制
    radCtx.draw(true, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: mW,
        height: mH,
        canvasId: 'radarCanvas',
        success: function (res) {
          console.log(res.tempFilePath)
          that.setData({
            radarImg: res.tempFilePath
          });
          that.hideLoading()
        }
      })
    }, 100))
    console.log("result")
  },
  // 雷达图
  drawRadar: function () {
    var sourceData1 = this.data.chanelArray1
    //调用
    this.drawEdge() //画六边形
    // this.drawArcEdge() //画圆
    this.drawLinePoint(sourceData1)
    //设置数据
    this.drawRegion(sourceData1, 'rgba(255, 0, 0, 0.36)') //第一个人的
    //设置文本数据
    this.drawTextCans(sourceData1)
    //设置节点
    this.drawCircle(sourceData1, 'white')
    // 画头像
    this.drawAvator();
  },
  // 绘制6条边
  drawEdge: function () {
    let lw = 3.2;
    radCtx.setStrokeStyle("#c95000");
    for (var i = 0; i < numSlot; i++) {
      lw = lw - 0.5;
      radCtx.setLineWidth(lw);  //设置线宽
      radCtx.beginPath()
      //计算半径
      var rdius = mRadius / numSlot * (i + 1)
      //画6条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var x = mCenter + rdius * Math.cos(mAngle * j);
        var y = mMiddle + rdius * Math.sin(mAngle * j);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function (mData) {
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k) * mData[k].score / 100;
      var y = mMiddle + mRadius * Math.sin(mAngle * k) * mData[k].score / 100;
      radCtx.moveTo(mCenter, mMiddle);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function (mData, color) {
    radCtx.beginPath();
    for (var m = 0; m < numCount; m++) {
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m].score / 100;
      var y = mMiddle + mRadius * Math.sin(mAngle * m) * mData[m].score / 100;
      radCtx.lineTo(x, y);
    }
    radCtx.closePath();
    radCtx.setFillStyle(color);
    radCtx.fill();
  },
  // //绘制文字
  drawTextCans: function (mData) {
    radCtx.setFillStyle("#c95000")
    radCtx.font = 'normal bold 17px cursive'  //设置字体
    radCtx.setFontSize(17 * screenScale);
    for (var n = 0; n < numCount; n++) {
      var x = mCenter + mRadius * Math.cos(mAngle * n);
      var y = mMiddle + mRadius * Math.sin(mAngle * n);
      // radCtx.fillText(mData[n][0], x, y);
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n].text, x + 5, y + 5);
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(mData[n].text, x - radCtx.measureText(mData[n].text).width - 7, y + 5);
      } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
        radCtx.fillText(mData[n].text, x - radCtx.measureText(mData[n].text).width - 5, y);
      } else {
        radCtx.fillText(mData[n].text, x + 7, y + 2);
      }
    }
  },
  //画点
  drawCircle: function (mData, color) {
    var r = 4; //设置节点小圆点的半径
    for (var i = 0; i < numCount; i++) {
      var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i].score / 100;
      var y = mMiddle + mRadius * Math.sin(mAngle * i) * mData[i].score / 100;

      radCtx.beginPath();
      radCtx.arc(x, y, r, 0, Math.PI * 2);
      radCtx.fillStyle = color;
      radCtx.fill();
    }
  },
  // 画头像
  drawAvator: function () {
    var headUrl = wx.getStorageSync("avatarurl"); //下面用canvas绘制头像 
    // 先画6个点
    var rdius = mRadius * 0.9 / numSlot;
    for (var j = 0; j < numCount; j++) {
      //坐标
      var x = mCenter + rdius * Math.cos(mAngle * j);
      var y = mMiddle + rdius * Math.sin(mAngle * j);
      radCtx.beginPath();
      radCtx.arc(x, y, 1.8, 0, Math.PI * 2);
      radCtx.fillStyle = "white";
      radCtx.fill();
    }

    radCtx.save(); // 保存当前ctx的状态 
    radCtx.beginPath();
    radCtx.setLineWidth(2);
    radCtx.arc(screenScale * 187.5, screenScale * 215, screenScale * 25, 0, 2 * Math.PI, false);
    radCtx.strokeStyle = 'white';
    radCtx.stroke();
    radCtx.clip(); //裁剪上面的圆形 

    if (typeof (headUrl) != 'undefined' && headUrl != '') {
      radCtx.drawImage(headUrl, screenScale * 162.5, screenScale * 190, screenScale * 50, screenScale * 50); // 在刚刚裁剪的园上画图  
    }
    radCtx.restore(); // 还原状态
  },
  drawOther: function () {
    let result = this.data.result;
    let styleUrl = wx.getStorageSync("styleurl");
    let repUrl = wx.getStorageSync("repurl");
    let logoUrl = wx.getStorageSync("logourl");
    let width = screenScale * 225;
    let height = screenScale * 63;
    let x = screenScale * 75;
    let y = 0;
    let r = 5;

    // 上面圆角矩形
    radCtx.save();
    radCtx.beginPath(); // draw top and top right corner 
    radCtx.moveTo(x, y);
    radCtx.lineTo(x + width, y); // draw right side and bottom right corner 
    radCtx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
    radCtx.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
    radCtx.lineTo(x, y);
    radCtx.shadowColor = '#fe7a23';
    radCtx.shadowOffsetX = 3;
    radCtx.shadowOffsetY = 3;
    radCtx.shadowBlur = 30;
    radCtx.setFillStyle('#ffd800');
    radCtx.fill();
    radCtx.restore();
    // 人格文字
    radCtx.setFillStyle("#000")
    radCtx.font = 'normal 14px Arial'  //设置字体
    radCtx.setTextAlign('center')
    radCtx.fillText(this.data.userInfo.nickName + "的隐藏家装人格", screenScale * 187.5, screenScale * 25)
    radCtx.font = "normal bold 22px Arial"  //设置字体
    radCtx.fillText(result.name, screenScale * 187.5, screenScale * 53)
    // 下面边框
    radCtx.setLineWidth(2)
    radCtx.strokeStyle = "white";//填充边框颜色
    radCtx.strokeRect(screenScale * 37.5, screenScale * 365, screenScale * 300, screenScale * 260);//对边框的设置
    radCtx.setFillStyle('#fff');
    radCtx.fillRect(screenScale * 41.5, screenScale * 369, screenScale * 292, screenScale * 252);
    // 适合风格、代表人物
    radCtx.save();
    radCtx.setLineWidth(1)
    radCtx.strokeStyle = "#fe7a23";//填充边框颜色
    radCtx.strokeRect(screenScale * 52, screenScale * 379, screenScale * 37, screenScale * 37);//对边框的设置
    radCtx.clip()
    radCtx.restore();

    radCtx.setFillStyle("#fe7a23")
    radCtx.font = 'normal 12px Arial'  //设置字体
    radCtx.setFontSize(12 * screenScale)
    radCtx.setTextAlign('left')
    radCtx.fillText("适合风格：" + result.style, screenScale * 93, screenScale * 392)
    radCtx.fillText("代表人物：" + result.rep, screenScale * 93, screenScale * 409)
    if (typeof (repUrl) != 'undefined' && repUrl != '') {
      radCtx.drawImage(repUrl, screenScale * 53, screenScale * 380, screenScale * 35, screenScale * 35); // 代表人物图
    }
    if (typeof (styleUrl) != 'undefined' && styleUrl != '') {
      radCtx.drawImage(styleUrl, screenScale * 52, screenScale * 422, screenScale * 271, screenScale * 121); //风格图
    }
    if (typeof (logoUrl) != 'undefined' && logoUrl != '') {
      radCtx.drawImage(logoUrl, screenScale * 146, screenScale * 640, screenScale * 83, screenScale * 40); //底部logo
    }
  },
  getImageInfo: function (path, key) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: path,
        success: function (res) {
          wx.setStorageSync(key + "url", res.path)
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },
  share: function (e) {
    let that = this;
    let radarImg2 = this.data.radarImg2;
    if (radarImg2 == '') {
      wx.showLoading({
        title: '请稍等...',
      })
      wx.getImageInfo({
        src: 'https://ox.o-home.com/attachment/images/9/2019/02/pooizDJEiDZuJ690hgeOOJ9h0OddGO.jpg',
        success(res) {
          radCtx.clearRect(0, 0, mW, mH);  //清除画布
          radCtx.drawImage(that.data.radarImg, 0, 0, mW, mH);
          radCtx.drawImage(res.path, screenScale * 256, screenScale * 548, screenScale * 73, screenScale * 73);
          radCtx.setFillStyle("#000")
          radCtx.font = 'normal 14px Arial'  //设置字体
          radCtx.setTextAlign('left')
          radCtx.fillText("扫一扫", screenScale * 52, screenScale * 570)
          radCtx.fillText("测试你的隐藏家装人格", screenScale * 52, screenScale * 587)
          radCtx.fillText("长按图片保存", screenScale * 52, screenScale * 603)
          //开始绘制
          console.log(333)
          radCtx.draw(true, setTimeout(function () {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: mW,
              height: mH,
              canvasId: 'radarCanvas',
              success: function (res) {
                wx.previewImage({
                  current: res.tempFilePath, // 当前显示图片的http链接  
                  urls: [res.tempFilePath], // 需要预览的图片http链接列表  
                })
                that.setData({
                  radarImg2: res.tempFilePath
                })
                wx.hideLoading()
              }
            })
          }, 100))
        }
      })
    } else {
      wx.previewImage({
        current: radarImg2, // 当前显示图片的http链接  
        urls: [radarImg2], // 需要预览的图片http链接列表  
      })
    }
  },
  // 弹窗
  powerDrawer(e) {
    //var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.modalUtil(currentStatu, 'showModalStatus')
    console.log(e)
    console.log(currentStatu)
  },
  modalUtil(currentStatu, attr) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0 //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })
      //关闭  
      if (currentStatu == "close") {
        this.setData({
          [attr]: false
        });
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData({
        [attr]: true
      });
    }
  },
  appoint(e) {
    let that = this;
    let phone = e.detail.value.phoneNumber;

    if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号码！',
        showCancel: false
      })
      return;
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码！',
        showCancel: false
      })
      return;
    }
    var data = {
      //用户名必填
      Nickname: "",
      //电话号码
      Phone_Number: phone,
      //地区
      Location: '',
      //标记
      Data_Type: 'XCX',
      //来源
      comefrom: 'XCX',
      //为1的话可以不用用户名
      mark: 1,
      //1为抢单,0为派单
      is_rob: 0,
      //面积
      mianji: '',
      //是否发短信1为发送
      send: 0,
      //备注
      remark: "小程序装修人格测试",
      //员工编号
      // salesCode: salesCode,
      // storeCode: storeCode,
      //智能客服类型
      KefuType: "none"
    };
    var swoopNum = that.GetStorageSync("ohome_zxcs");
    if (swoopNum > 5) {
      wx.showModal({
        title: '温馨提示',
        content: "对不起,今天的预约名额已用完！",
        showCancel: false
      });
      return false;
    }
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
            title: '温馨提示',
            content: res.data.message,
            showCancel: false
          })
        } else {
          if (!swoopNum) {
            that.SetStorageSync("ohome_zxcs", 1);
          } else {
            that.SetStorageSync("ohome_zxcs", parseInt(swoopNum) + 1);
          }
          that.setData({
            isAppointed: true
          })
        }
      }
    });
  },
  // 点击复制文链接
  copyLink: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: "https://pan.baidu.com/s/1coDfSlSCcHmn6DlcUK2gqw",
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
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
  onShareAppMessage: function () {
    return {
      title: '30秒揭秘「我」的家装人格',
      desc: '我这样优秀的人，该住什么样的家？',
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
