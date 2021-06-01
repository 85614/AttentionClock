// index.js
// 获取应用实例
const app = getApp()

const util = require('../../utils/util.js')

Page({
  data: {

    time: '1', // 任务需要的总时间（分钟
    taskTimeStr: '',

    exitTime: '1', // 离开的时间限制（分钟）
    totalExitTime: 0, // 在本次专注中离开的总时间
    totExitTimeStr: '',
    exitTimeStr: '', // 离开时间示数
    exit: false, // 是否出于离开状态
    exitTimer: null, // 限制时间计时器

    rate: '',
    clockShow: false, // ⏲页面是否显示
    mTime: 0,  // 任务已经走过的时间
    timer: null, // 把计时器暴露出来，供其他函数调用
    timeStr: '05:00', // 计时器示数

    okShow: false, // 返回按钮
    pauseShow: true, // 暂停按钮
    continueCancelShow: false, // 继续和放弃按钮

    timestep: 50, // 计时精度（ms）

    fail: false, // 是否任务失败
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function (option) {
    console.log("onLoad")
    console.log("optiin:", option)
    // 系统设备信息
    let res = wx.getSystemInfoSync()
    let rate = 750 / res.windowWidth
    this.data.id = option.id
    this.data.time = app.getTaskById(parseInt(option.id)).minutes

    this.setData({    
      rate: rate,
      taskTimeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00',
    })
    this.start()
    // this.data.totalExitTime = 0 // 累计离开时间清0
    wx.hideHomeButton()
  },

  onHide: function () {
    const _this = this
    console.log("onHide")
    // if (!_this.exit) { onHide不再暂停
    //   this.pause()
    // }
  },

  onShow: function () {
    console.log("onShow")
    // wx.hideHomeButton() 移到onLoad
  },

  onUnload: function () {
    console.log("OnUnload")
    let _this = this
    // this.setData({
    //   pauseShow: true,
    //   continueCancelShow: false,
    //   clockShow: false,
    //   mTime: 0, // 白圈走的路清零
    //   exitTimeStr: '',
    //   exit: false,
    //   okShow: false,
    //   totalExitTime: 0, // 累计离开时间清0
    //   fail: false,
    // })

    // 如果失败，则存储记录
    // if (!_this.data.okShow) {
    //   app.addRecord({
    //     taskID: _this.data.id,
    //     recordID: app.getNextRecordId(),
    //     startTime: _this.data.startTime,  // format time
    //     isFinish: 0,
    //     exitTime: _this.data.totalExitTime,  // ms
    //     durationTime: _this.data.mTime, // ms
    //   })
    // }

    clearInterval(this.data.timer)
    clearInterval(this.data.exitTimer)
    // this.data.totalExitTime = 0 // 累计离开时间清0
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
      timeStr: this.data.taskTimeStr,
      startTime: new Date()
    })
    // this.drawBg()
    this.drawActive()
  },

  // 返回按钮 
  clock: function () {
    this.data.totalExitTime = 0 // 累计离开时间清0
    this.setData({
      clockShow: false,
      timeStr: this.data.taskTimeStr,
      okShow: false,
      totalExitTime: 0,
      fail: false,
    })
  },

  // 动圆函数 
  drawActive: function () {
    clearInterval(this.data.timer)
    clearInterval(this.data.exitTimer)
    let _this = this
    let currentTime = parseInt(this.data.time) * 60 * 1000 - _this.data.mTime
    let timestep = _this.data.timestep
    let timer = setInterval(() => {
      currentTime = currentTime - timestep //倒计时文字

      _this.setData({
        mTime: _this.data.mTime + timestep //每timestep ms执行一次，每次时间加timestep，并绘图
      })
      let step = _this.data.mTime / (_this.data.time * 60 * 1000) * 2 * Math.PI + 1.5 * Math.PI

      if (step < 3.5 * Math.PI) {
        if (currentTime % 1000) {
          let timeStr = _this.getFormat(currentTime)
          _this.setData({
            timeStr: timeStr
          })
        }
        //开始绘制动圆，每timestep ms绘制一次
        let lineWidth = 7 / _this.data.rate //px
        let ctx = wx.createCanvasContext('progress-active')
        ctx.setLineWidth(lineWidth)
        ctx.setStrokeStyle('#fff')
        ctx.setLineCap('round')
        ctx.beginPath()
        ctx.arc(400 / _this.data.rate / 2, 400 / _this.data.rate / 2, 400 / _this.data.rate / 2 - 2 * lineWidth, 1.5 * Math.PI, step, true)
        ctx.stroke()
        ctx.draw()
      } else {
        clearInterval(timer)
        // 将完成的数据记录到日志
        // let logs = wx.getStorageSync('logs') || []
        let ctx = wx.createCanvasContext('progress-active')
        ctx.draw(false)
        // logs.unshift({
        //   date: util.formatTime(new Date),
        //   cate: _this.data.cateActive,
        //   time: _this.data.time
        // })
        // // console.log(logs); 
        // wx.setStorageSync('logs', logs) // 把数据加到缓存
        _this.setData({
          timeStr: '', 
          okShow: true,
          pauseShow: false,
          continueCancelShow: false,
          totExitTimeStr: this.getFormat(this.data.totalExitTime),
        })

        console.log('添加记录', app.get_formated_record({
          taskID: _this.data.id,
          recordID: app.getNextRecordId(),
          startTime: _this.data.startTime,  // format time
          isFinish: 1,
          exitTime: _this.data.totalExitTime,  // ms
          durationTime: _this.data.mTime, // ms
        }))

        // 存储成功记录
        app.addRecord({
          taskID: _this.data.id,
          recordID: app.getNextRecordId(),
          startTime: _this.data.startTime,  // format time
          isFinish: 1,
          exitTime: _this.data.totalExitTime,  // ms
          durationTime: _this.data.mTime, // ms
        })


        
      }
    }, timestep)
    // 暴露计时器，供其他函数调用 
    this.setData({
      timer: timer
    })
  },

  // // 静圆函数，目前未使用
  // drawBg: function () {
  //   let lineWidth = 7 / this.data.rate; //px
  //   let ctx = wx.createCanvasContext('progress-bg');
  //   ctx.setLineWidth(lineWidth);
  //   ctx.setStrokeStyle('#fff');
  //   // let gradient = context.createLinearGradient(200, 100, 100, 200);
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
    clearInterval(this.data.exitTimer)
    if (!this.data.setGiveUp) {
      this.setData({
        pauseShow: false,
        continueCancelShow: true,
        exit: true,
      })
    }
    else {
      this.data.pauseShow = false
      this.data.continueCancelShow = true
      this.data.exit = true
    }
    let _this = this
    let currentTime = parseInt(this.data.setGiveUp ? 0 : this.data.exitTime) * 60 * 1000
    // this.data.setGiveUp = false
    let timestep = _this.data.timestep
    let timer
    this.data.exitTimer = timer = setInterval(() => {
      currentTime = currentTime - timestep // 倒计时文字
      _this.data.totalExitTime += timestep
      // let step = _this.data.mTime / (_this.data.time * 60 * 1000) * 2 * Math.PI + 1.5 * Math.PI

      if (currentTime > 0) {
        if (currentTime % 1000) {
          let strTime = _this.getFormat(currentTime)
          _this.setData({
            exitTimeStr: strTime
          })
        }
      } else { // 离开时间超出限制
        clearInterval(this.data.exitTimer)
        _this.setData({
          okShow: true,
          pauseShow: false,
          continueCancelShow: false,
          fail: true,
          totExitTimeStr: this.getFormat(this.data.totalExitTime),
        })
        
        
        console.log('添加记录', app.get_formated_record({
          taskID: _this.data.id,
          recordID: app.getNextRecordId(),
          startTime: _this.data.startTime,  // format time
          isFinish: 0,
          exitTime: _this.data.totalExitTime,  // ms
          durationTime: _this.data.mTime, // ms
        }))
        app.addRecord({
          taskID: _this.data.id,
          recordID: app.getNextRecordId(),
          startTime: _this.data.startTime,  // format time
          isFinish: 0,
          exitTime: _this.data.totalExitTime,  // ms
          durationTime: _this.data.mTime, // ms
        })
      

        // 将失败的数据记录到日志
        // let logs = wx.getStorageSync('logs') || [];
        // logs.unshift({
        //   date: util.formatTime(new Date),
        //   cate: _this.data.cateActive,
        //   time: _this.data.time
        // });
        // // console.log(logs); 
        // wx.setStorageSync('logs', logs) // 把数据加到缓存


      }
    }, timestep);
    // _this.setData({
    //   exitTimer: timer,
    // })

  },
  
  giveUp: function() {
    this.setData({
      setGiveUp: true
    })
    this.pause()
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
    console.log("back")
    let _this = this
    // this.setData({
    //   pauseShow: true,
    //   continueCancelShow: false,
    //   clockShow: false,
    //   mTime: 0, // 白圈走的路清零
    //   exitTimeStr: '',
    //   exit: false,
    //   okShow: false,
    //   totalExitTime: 0, // 累计离开时间清0
    //   fail: false,
    // })

    // app.addRecord({
    //   taskID: _this.data.id,
    //   recordID: (app.recordID)++,
    //   startTime: _this.data.startTime,  // format time
    //   isFinish: 0,
    //   exitTime: _this.data.totalExitTime,  // ms
    //   durationTime: _this.data.mTime, // ms
    // })

    clearInterval(this.data.timer)
    clearInterval(this.data.exitTimer)
    // this.data.totalExitTime = 0 // 累计离开时间清0

    wx.switchTab({
      url: '../home/home'
    })
  },

  getFormat: function (currentTime) {
    let time_all = currentTime / 1000; // 获得倒计时文字总秒数
    let time_m = (parseInt(time_all / 60) >= 10) ? parseInt(time_all / 60) : ('0' + parseInt(time_all / 60)) // 获得倒计时文字分钟
    let time_s = (parseInt(time_all % 60) >= 10) ? parseInt(time_all % 60) : '0' + parseInt(time_all % 60); // 获得剩余倒计时秒数
    return time_m + ':' + time_s
  }
})