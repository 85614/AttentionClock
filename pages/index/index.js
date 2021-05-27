// index.js
// 获取应用实例
const app = getApp()

const util = require('../../utils/util.js')

Page({
  data: {

    time: '1', // 任务需要的总时间（分钟）

    exitTime: '1', // 离开的时间限制（分钟）
    totalExitTime: 0, // 在本次专注中离开的总时间
    exitTimeStr: '', // 离开时间示数
    exit: false, // 是否离开
    exitTimer: null, // 限制时间计时器

    rate: '',
    clockShow: false,
    mTime: 0,  // 已经走过的时间
    timer: null, // 把计时器暴露出来，供其他函数调用
    timeStr: '05:00', // 计时器示数

    okShow: false, // 返回按钮
    pauseShow: true, // 暂停按钮
    continueCancelShow: false, // 继续和放弃按钮

    timestep: 50, // 计时精度（ms）
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    // 系统设备信息
    var res = wx.getSystemInfoSync()
    var rate = 750 / res.windowWidth
    this.setData({
      rate: rate,
    })
    this.data.totalExitTime = 0 // 累计离开时间清0
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  },

  // 开始计时按钮 
  start: function () {
    this.setData({
      clockShow: true,
      timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00'
    })
    // this.drawBg()
    this.drawActive()
  },

  // 返回按钮 
  clock: function () {
    this.data.totalExitTime = 0 // 累计离开时间清0
    this.setData({
      clockShow: false,
      timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00',
      okShow: false,
      totalExitTime: 0,
    })
  },

  // 动圆函数 
  drawActive: function () {
    var _this = this
    var currentTime = parseInt(this.data.time) * 60 * 1000 - _this.data.mTime
    var timestep = _this.data.timestep
    var timer = setInterval(() => {
      currentTime = currentTime - timestep //倒计时文字

      _this.setData({
        mTime: _this.data.mTime + timestep //每100毫秒执行一次，每次时间加100毫秒，并绘图
      })
      var step = _this.data.mTime / (_this.data.time * 60 * 1000) * 2 * Math.PI + 1.5 * Math.PI

      if (step < 3.5 * Math.PI) {
        if (currentTime % 1000) {
          var time_all = currentTime / 1000 //获得倒计时文字总秒数
          var time_m = (parseInt(time_all / 60) >= 10) ? parseInt(time_all / 60) : ('0' + parseInt(time_all / 60)) //获得倒计时文字分钟
          var time_s = (parseInt(time_all % 60) > 10) ? parseInt(time_all % 60) : '0' + parseInt(time_all % 60) //获得剩余倒计时秒数
          _this.setData({
            timeStr: time_m + ':' + time_s
          })
        }
        //开始绘制动圆，每timestep ms绘制一次
        var lineWidth = 7 / _this.data.rate //px
        var ctx = wx.createCanvasContext('progress-active')
        ctx.setLineWidth(lineWidth)
        ctx.setStrokeStyle('#fff')
        ctx.setLineCap('round')
        ctx.beginPath()
        ctx.arc(400 / _this.data.rate / 2, 400 / _this.data.rate / 2, 400 / _this.data.rate / 2 - 2 * lineWidth, 1.5 * Math.PI, step, true)
        ctx.stroke()
        ctx.draw()
      } else {
        // 将完成的数据记录到日志
        var logs = wx.getStorageSync('logs') || []
        var ctx = wx.createCanvasContext('progress-active')
        ctx.draw(false)
        logs.unshift({
          date: util.formatTime(new Date),
          cate: _this.data.cateActive,
          time: _this.data.time
        })
        // console.log(logs); 
        wx.setStorageSync('logs', logs) // 把数据加到缓存
        _this.setData({
          timeStr: '', 
          okShow: true,
          pauseShow: false,
          continueCancelShow: false
        })
        clearInterval(timer)
      }
    }, timestep)
    // 暴露计时器，供其他函数调用 
    this.setData({
      timer: timer
    })
  },

  // // 静圆函数，目前未使用
  // drawBg: function () {
  //   var lineWidth = 7 / this.data.rate; //px
  //   var ctx = wx.createCanvasContext('progress-bg');
  //   ctx.setLineWidth(lineWidth);
  //   ctx.setStrokeStyle('#fff');
  //   // var gradient = context.createLinearGradient(200, 100, 100, 200);
  //   // gradient.addColorStop("0", "#2661DD");
  //   // gradient.addColorStop("0.5", "#40ED94");
  //   // gradient.addColorStop("1.0", "#5956CC");
  //   ctx.setLineCap('round');
  //   ctx.beginPath();
  //   ctx.arc(400 / this.data.rate / 2, 400 / this.data.rate / 2, 400 / this.data.rate / 2 - 2 * lineWidth , 0, 2 * Math.PI);
  //   ctx.stroke();
  //   ctx.draw();
  // },


  // 暂停按钮 
  pause: function () {
    clearInterval(this.data.timer)

    var _this = this
    var currentTime = parseInt(this.data.exitTime) * 60 * 1000
    var timestep = _this.data.timestep
    var timer = setInterval(() => {
      currentTime = currentTime - timestep // 倒计时文字
      _this.data.totalExitTime += timestep
      // var step = _this.data.mTime / (_this.data.time * 60 * 1000) * 2 * Math.PI + 1.5 * Math.PI

      if (currentTime > 0) {
        if (currentTime % 1000) {
          var time_all = currentTime / 1000; // 获得倒计时文字总秒数
          var time_m = (parseInt(time_all / 60) >= 10) ? parseInt(time_all / 60) : ('0' + parseInt(time_all / 60)) // 获得倒计时文字分钟
          var time_s = (parseInt(time_all % 60) > 10) ? parseInt(time_all % 60) : '0' + parseInt(time_all % 60); // 获得剩余倒计时秒数
          _this.setData({
            exitTimeStr: time_m + ':' + time_s
          })
        }
      } else { // 离开时间超出限制
        // 将完成的数据记录到日志
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift({
          date: util.formatTime(new Date),
          cate: _this.data.cateActive,
          time: _this.data.time
        });
        // console.log(logs); 
        wx.setStorageSync('logs', logs) // 把数据加到缓存
        _this.setData({
          exitTimeStr: '', 
          okShow: true,
          pauseShow: false,
          continueCancelShow: false,
        })
        clearInterval(exitTimer)
      }
    }, timestep);

    this.setData({
      pauseShow: false,
      continueCancelShow: true,
      exitTimer: timer,
      exit: true,
    })
  },
  
  continue: function () {
    clearInterval(this.data.exitTimer)
    clearInterval(this.data.timer)
    this.drawActive()
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      exitTimeStr: '',
      exit: false,
    })
    console.log(this.data.totalExitTime)
  },

  // 放弃按钮 ---与完成按钮功能相同
  cancel: function () {
    clearInterval(this.data.timer)
    clearInterval(this.data.exitTimer)
    this.data.totalExitTime = 0 // 累计离开时间清0
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      clockShow: false,
      mTime: 0, // 白圈走的路清零
      exitTimeStr: '',
      exit: false,
      okShow: false,
      totalExitTime: 0 // 累计离开时间清0
    })
  }
})