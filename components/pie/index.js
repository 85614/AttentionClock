import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const today = new Date()

let _chart

const optionMaker = function() {
  
  let option = {
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 7
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['20%', '40%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }]
    }]
  };
  const todayRecords = app.getSomeDayRecordstatistics(today.getTime())
  // console.log("today record statistic ", todayRecords)
  const data = []
  for (let i = 0; i < todayRecords.length; ++i) {
    if (todayRecords[i]) {
      // console.log("todayRecords[i]", todayRecords[i])
      data.push({
        name: app.getTaskById(todayRecords[i].taskID).name,
        value: todayRecords[i].total_time
      })
    }
  }
  // // for test
  // today.setDate(0)
  // data.push({
  //   name: today + "",
  //   value: 100
  // })
  option.series[0].data = data
  return option
}

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  const option = optionMaker()
  chart.setOption(option);
  _chart = chart
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    },
    today: today.format("yyyy年MM月dd日"),
    curDate: today,
    curState: 0, // 0: 日， 1：周， 2：月，3：年
  },

  // 向前进一个时间段
  forward() {
    let cur = this.data.curDate
    if (this.data.curState === 0) { // 日
      this.data.curDate.setDate(cur.getDate() + 1)
    }
    else if (this.data.curState === 1) { // 周
      this.data.curDate.setDate(cur.getDate() + 7 - cur.getDay());
    }
    else if (this.data.curState === 2) { // 月
      this.data.curDate.setDate(cur.getFullYear(), cur.getMonth() + 1, 1)
    }
    else {  // 年
      this.data.curDate.setDate(cur.getFullYear() + 1, 1, 1)
    }
    this.resetData()
  },

  // 向后退一个时间段
  back() {
    let cur = this.data.curDate
    if (this.data.curState === 0) { // 日
      this.data.curDate.setDate(cur.getDate() - 1)
    }
    else if (this.data.curState === 1) { // 周
      this.data.curDate.setDate(cur.getDate() - 7 - cur.getDay());
    }
    else if (this.data.curState === 2) { // 月
      this.data.curDate.setDate(cur.getFullYear(), cur.getMonth() - 1, 1)
    }
    else {  // 年
      this.data.curDate.setDate(cur.getFullYear() - 1, 1, 1)
    }
    this.resetData()
  },

  // 转换状态
  stateTransition(nxt) {
    this.data.curState = nxt
    if (nxt === 1) { // 周
      this.data.curDate.setDate(cur.getDate() - cur.getDay());
    }
    else if (nxt === 2) { // 月
      this.data.curDate.setDate(cur.getFullYear(), cur.getMonth(), 1)
    }
    else if (nxt === 3) {  // 年
      this.data.curDate.setDate(cur.getFullYear(), 1, 1)
    }
    resetData()
  },

  // 根据新的状态重置数据
  resetData(){
    let option = {
      backgroundColor: "#ffffff",
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['20%', '40%'],
        data: []
      }]
    };

    let records    
    if (this.data.curState === 0) { // 日
      records = app.getSomeDayRecordstatistics(curDate.getTime())
      console.log("getting day records ", records)
    }
    else if (this.data.curState === 1) { // 周
      records = app.getSomeWeekRecordstatistics(curDate.getTime())
      console.log("getting week records ", records)
    }
    else if (this.data.curState === 2) { // 月
      records = app.getSomeMonthRecordstatistics(curDate.getTime())
      console.log("getting month records ", records)
    }
    else { // 年
      records = app.getSomeYearRecordstatistics(curDate.getTime())
      console.log("getting year records ", records)
    }

    const data = []
    for (let i = 0; i < records.length; ++i) {
      if (records[i]) {
        console.log("records[i]", records[i])
        data.push({
          name: app.getTaskById(records[i].taskID).name,
          value: records[i].total_time
        })
      }
    }

    _chart.setOption(option)
  },

  test(){
    console.log("test")
    // this.onShow()
  },
  
  onShow() {
    console.log("pie onShow flush")
    _chart.setOption(optionMaker())
    // today.setDate(0)
  }
});
