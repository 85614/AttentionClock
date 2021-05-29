import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

let theMonth = new Date()

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
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
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }]
  };
  option.xAxis.data = []
  option.series[0].data = []
  const dAxisData = option.xAxis.data
  const series0Data  = option.series[0].data
  const dis = app.getSomeMonthDistribution(theMonth.getTime())
  let i = 0;
  for (; i < dis.length; ++i) 
    if (dis[i])
      break
  for (; i < dis.length; ++i) {
    dAxisData.push(theMonth.getMonth() + "-" + i)
    series0Data.push(dis[i] || 0)
  }
  for (i = dis.length-1; i >=0; --i) {
    if (dis[i])
      break
    dAxisData.pop()
    series0Data.pop()
  } 
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
    monthStr: theMonth.format("yyyy年MM月")
  },

  onShow() {
    console.log("pie onShow flush")
    this.setData({
      change: false
    })
    this.setData({
      change: true
    })
  }
});
