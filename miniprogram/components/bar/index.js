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
      this.selectComponent('#mychart-dom-bar').init((canvas, width, height, dpr) => {
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
  },
  optionMaker() {
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
          name: '时间',
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
    this.setData({ noData: data.length === 0 })
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
}
});
