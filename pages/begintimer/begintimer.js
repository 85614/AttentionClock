// index.js
// 获取应用实例
const app = getApp()

const util = require('../../utils/util.js')

Page({
  data: {

    time: '1', // 任务需要的总时间（分钟
    
    id: 0,
  },
  
  onLoad: function (option) {
    console.log("onLoad")
    console.log("option:", option)
    this.data.id = parseInt(option.id)
    // 系统设备信息
    var res = wx.getSystemInfoSync()
    var rate = 750 / res.windowWidth
    let tasks =  wx.getStorageSync('tasks')

    

    this.setData({
      rate: rate,
      taskTimeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00',
    })
    // this.data.totalExitTime = 0 // 累计离开时间清0
  },

  onHide: function () {
    const _this = this
    console.log("onHide")
    if (!_this.exit) {
      this.pause()
    }
  },

  onShow: function () {
    console.log("onShow")
    
  },

  OnUnload: function () {
    console.log("OnUnload")
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
    const id = e.currentTarget.dataset.id;
    const task = getTasks()

    wx.redirectTo({
      url: "../timer/timer?id=" + parseInt(this.data.id)
    })
  }


})