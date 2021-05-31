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

let chart

const optionMaker = function() {

  let option = {
    title: {
      text: '测试下面legend的红色区域不应被裁剪',
      left: 'center'
    },
    legend: {
      data: ['A', 'B', 'C'],
      top: 50,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
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
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: 'B',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };

  option = {
    
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

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  
  chart.setOption(optionMaker());
  return chart;
}

const resetChart = () => {
  if (chart) {
    chart.setOption(optionMaker())
  }
  console.log('line reset chart')
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
    dateStr: curDate.format("yyyy年MM月dd日"),
    buttonWeek: 1,
    buttonMonth: 2,
    buttonYear: 3,
    buttonChecked: 1,
    resetDataFun: resetChart
  },

  test(){
    console.log("test")
    this.onShow()
  },
  resetData() {
    this.setData({
      dateStr: curDate.format("yyyy年MM月dd日"),
    })
    chart.setOption(optionMaker())
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
  }
});
