import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const curDate = new Date()

let chart

const dayState = {
  forward: function(d) {
    d.setDate(d.getDate()+1)
  },
  back: function(d){
    d.setDate(d.getDate()-1)
  },
  getRecords: function(d) {
    return app.getSomeDayRecordstatistics(d.getTime())
  }
}

const WeekState = {
  forward: function(d) {
    d.setDate(d.getDate()+7)
  },
  back: function(d){
    d.setDate(d.getDate()-7)
  },
  getRecords: function(d) {
    return app.getSomeWeekRecordstatistics(d.getTime())
  }
}

const MonthState = {
  forward: function(d) {
    d.setMonth(d.getMonth()+1)
  },
  back: function(d){
    d.setMonth(d.getMonth()-1)
  },
  getRecords: function(d) {
    return app.getSomeMonthRecordstatistics(d.getTime())
  },
}

const YearState = {
  forward: function(d) {
    d.setFullYear(d.getFullYear()+1)
  },
  back: function(d){
    d.setFullYear(d.getFullYear()-1)
  },
  getRecords: function(d) {
    return app.getSomeYearRecordstatistics(d.getTime())
  },

}

let curState = dayState


Component({
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
      lazyLoad: true,
      // onInit: initChart
    },
    dateStr: curDate.format("yyyy年MM月dd日"),
    buttonDay: 0,
    buttonWeek: 1,
    buttonMonth: 2,
    buttonYear: 3,
    buttonChecked: 0,
  },
  lifetimes: {
    attached: function(){
      this.selectComponent('#mychart-dom-pie').init((canvas, width, height, dpr) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.data.chart = chart;
        this.data.chart.setOption(this.optionMaker())

        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
    }
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.resetData()
    },
  },
methods:{

  // 根据新的状态重置数据
  resetData(){
    this.setData({
      dateStr: curDate.format("yyyy年MM月dd日"),
    })
    if (this.data.chart)
      this.data.chart.setOption(this.optionMaker())
  },

  test(){
    console.log("test")
    // this.onShow()
  },
  
  onShow() {
    console.log("pie onShow flush")
    this.resetData()
  },

  buttonDayTap (e) {
    curState = dayState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonDay
    })
    this.resetData()
  },

  buttonWeekTap (e) {
    curState = WeekState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonWeek
    })
    this.resetData()
  },

  buttonMonthTap (e) {
    curState = MonthState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonMonth
    })
    this.resetData()
  },

  buttonYearTap (e) {
    curState = YearState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonYear
    })
    this.resetData()
  },

  lastDate(){
    curState.back(curDate)
    this.resetData()
  },
  nextDate(){
    curState.forward(curDate)
    this.resetData()
  },
  optionMaker() {
  
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
    const records = curState.getRecords(curDate)
    const data = []
    for (let i = 0; i < records.length; ++i) {
      if (records[i]) {
        // console.log("records[i]", records[i])
        data.push({
          name: app.getTaskById(records[i].taskID).name,
          value: records[i].total_time
        })
      }
    }
    this.setData({
      noData: data.length === 0
    })
    option.series[0].data = data
    return option
  }
}
});
