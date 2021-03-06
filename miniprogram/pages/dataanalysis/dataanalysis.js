import CustomPage from '../../base/CustomPage'

const app = getApp()

let curDate = new Date()

CustomPage({

  /**
   * 页面的初始数据
   */
  data: {
    total_time: 0
  },

  test() {
    console.log("test")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("data center onshow")
    this.setData({
      total_time: app.get_finished_total_time(),
      total_count: app.get_finished_count(),
    })
    this.updateSomeDayData()
  },


  updateSomeDayData(){
    let today_count = 0
    let today_time = 0;
    const records = app.getSomeDayRecordstatistics(curDate.getTime())
    const dateStr = curDate.format("yyyy-MM-dd")
    for (let i = 0; i < records.length; ++i) {
      today_count += records[i] ? records[i].count : 0
      today_time += records[i] ? records[i].total_time : 0
    }
    this.setData({
      total_time: app.get_finished_total_time(),
      total_count: app.get_finished_count(),
      today_count,
      today_time,
      dateStr
    })
  },

  lastDate(){
    curDate.setDate(curDate.getDate() - 1)
    this.updateSomeDayData()
  },
  nextDate(){
    curDate.setDate(curDate.getDate() + 1)
    this.updateSomeDayData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})