import * as echarts from '../../ec-canvas/echarts';

const app = getApp();


const WeekState = {
  forward: function(d) {
    d.setDate(d.getDate()+7)
  },
  back: function(d){
    d.setDate(d.getDate()-7)
  },
  getRecords: function(d) {
    return app.getSomeWeekDistribution(d.getTime())
  },
  xAxisLabel: function(d, i) {
    const strs = '天一二三四五六'
    return "星期" + strs[i]
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
    return app.getSomeMonthDistribution(d.getTime())
  },
  xAxisLabel: function(d, i) {
    return (d.getMonth() + 1) + "-" + i
  }
}

const YearState = {
  forward: function(d) {
    d.setFullYear(d.getFullYear()+1)
  },
  back: function(d){
    d.setFullYear(d.getFullYear()-1)
  },
  getRecords: function(d) {
    return app.getSomeYearDistribution(d.getTime())
  },
  xAxisLabel: function(d, i) {
    return d.getFullYear() + "-" + (i + 1)
  }
}

let curState = WeekState

let curDate = new Date()









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
    buttonWeek: 1,
    buttonMonth: 2,
    buttonYear: 3,
    buttonChecked: 1,
  },
  lifetimes: {
    attached: function(){
      this.selectComponent('#mychart-dom-line').init((canvas, width, height, dpr) => {
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

  test(){
    console.log("test")
    this.onShow()
  },
  resetData() {
    this.setData({
      dateStr: curDate.format("yyyy年MM月dd日"),
    })
    if (this.data.chart)
      this.data.chart.setOption(this.optionMaker())
  },
  onShow() {
    console.log('bar onShow')
    this.resetData()
  },
  

  buttonWeekTap(e) {
    curState = WeekState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonWeek
    })
    this.resetData()
  },

  buttonMonthTap(e) {
    curState = MonthState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonMonth
    })
    this.resetData()
  },

  buttonYearTap(e) {
    curState = YearState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonYear
    })
    this.resetData()
  },

  lastDate() {
    curState.back(curDate)
    this.resetData()
  },
  nextDate() {
    curState.forward(curDate)
    this.resetData()
  },
  optionMaker() {
    let option = {
      
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        axisLabel: {
          formatter: '{value}min'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        // show: false
      },
      series: [{
        name: '时间',
        type: 'line',
        smooth: true,
        data: [18, 36, 65, 30, 78, 40, 33]
      }]
    };
    option.xAxis.data = []
    option.series[0].data = []
    const dAxisData = option.xAxis.data
    const series0Data  = option.series[0].data
    const dis = curState.getRecords(curDate)
    this.setData({ noData: dis.length === 0 })
    let i = 0;
    for (; i < dis.length; ++i) 
      if (dis[i])
        break
    for (; i < dis.length; ++i) {
      dAxisData.push( curState.xAxisLabel(curDate, i))
      series0Data.push(dis[i] || 0)
    }
    return option
  }
}
});
