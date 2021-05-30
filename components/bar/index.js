import * as echarts from '../../ec-canvas/echarts';

const app = getApp()

let chart

const dayState = {
  forward: function(d) {
    d.setDate(d.getDate()+1)
  },
  back: function(d){
    d.setDate(d.getDate()-1)
  },
  getRecords: function(d) {
    return app.getSomeDayDayDistribution(d.getTime())
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
    return app.getSomeWeekDayDistribution(d.getTime())
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
    return app.getSomeMonthDayDistribution(d.getTime())
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
    return app.getSomeYearDayDistribution(d.getTime())
  },

}

let curState = dayState

let curDate = new Date()

const optionMaker = function() {
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          formatter: '{value}min',
          color: '#666'
        }
      }
    ],
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: [],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '热度',
        type: 'bar',
        label: {
          // normal: {
          //   show: true,
          //   position: 'inside'
          // }
        },
        data: [],
        itemStyle: {
          emphasis: {
            color: '#37a2da'
          }
        }
      },
    ]
  }
  const data = curState.getRecords(curDate)
  const series0data = option.series[0].data
  const xAxis0data = option.xAxis[0].data
  console.log(curDate, "日工作时间段分布data", data)
  let i = 0;
  for (; i < data.length; ++i) {
    if (data[i])
      break
  }
  for (; i < data.length; ++i) {
    series0data.push(data[i])
    xAxis0data.push(i+'点')
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

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: ['热度', '正面', '负面']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '热度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '正面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: [120, 102, 141, 174, 190, 250, 220],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '负面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'left'
          }
        },
        data: [-20, -32, -21, -34, -90, -130, -110],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart.setOption(optionMaker());
  return chart;
}

const resetChart = () => {
  if (chart) {
    chart.setOption(optionMaker())
  }
  console.log('bar reset chart')
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
    buttonDay: 0,
    buttonWeek: 1,
    buttonMonth: 2,
    buttonYear: 3,
    buttonChecked: 0,
    resetDataFun: resetChart
  },
  test(){
    console.log('bar test')
    // this.onShow()
  },
    // 根据新的状态重置数据
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
  buttonDayTap(e) {
    curState = dayState
    console.log(e)
    this.setData({
      buttonChecked: this.data.buttonDay
    })
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
