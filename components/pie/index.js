import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const today = new Date()
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
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
  console.log("today record statistic ", todayRecords)
  const data = []
  for (let i = 0; i < todayRecords.length; ++i) {
    if (todayRecords[i]) {
      console.log("todayRecords[i]", todayRecords[i])
      data.push({
        name: app.getTaskById(todayRecords[i].taskID).name,
        value: todayRecords[i].total_time
      })
    }
  }
  option.series[0].data = data
  console.log("pie data", data)
  chart.setOption(option);
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
    change: true,
    today: today.format("yyyy-MM-dd")
  },

  test(){
    console.log("test")
    this.setData({
      change: false
    })
    this.setData({
      change: true
    })
  },
  
  onReady() {
  }
});
