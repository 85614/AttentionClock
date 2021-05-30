//app.js
const themeListeners = []
const oneDayMs = 1000 * 60 *60 *24 // 一天的毫秒数
let db // 云数据库的引用

App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    db = wx.cloud.database() // 获取数据库的引用

    console.log('App Launch')
    this.getRecords()
    this.getTasks()
    this.AddFormatToDate()
    this.test()
  },

  onShow: function () {
    console.log('App Show')
    
  },
  onHide: function () {
    console.log('App Hide')
  },
  themeChanged(theme) {
    this.globalData.theme = theme
    themeListeners.forEach((listener) => {
      listener(theme)
    })
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener)
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener)
    if (index > -1) {
      themeListeners.splice(index, 1)
    }
  },

  // 全局数据记录
  globalData: {
    userInfo: null,
    hasLogin: false,
    theme: 'light',
    GRID_DEMO_URL: '/example/index',
    iconTabbar: '/example/images/icon_tabbar.png',
    tasks: [{
        id: 0,
        name: "待办是您要专注的事",
        minutes: 1,
      }, {
        id: 1,
        name: "右上角 + 号添加待办",
        minutes: 10,
      }, {
        id: 2,
        name: "左滑待办编辑或删除",
        minutes: 25,
      }, {
        id: 3,
        name: "点击开始按钮来专注计时",
        minutes: 25,
      }
    ],


    record: [{
        taskID: 1,
        recordID: 1,
        startTime: 123456789,  // format time
        isFinish: 1,
        exitTime: 12345,  // ms
        durationTime: 1234, // ms

      }
    ],

    recordID: 0
  },

  getTasks() { // 从数据库中获取全部任务记录
    const _this = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTasks',
      // 传给云函数的参数
      data: {
      },
    })
    .then(res => {
      console.log(res.result.data)
      this.globalData.taks = res.result.data
    })
    .catch(console.error)
    
    return this.globalData.tasks
  },

  getRecords() { // 从数据库中获取全部
    const _this = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getRecords',
      // 传给云函数的参数
      data: {
      },
    })
    .then(res => {
      console.log(res.result.data)
      this.globalData.taks = res.result.data
    })
    .catch(console.error)
    
    return this.globalData.records
  },

  getTaskById(id) { // 待完善

    return this.globalData.tasks[id]
  },

  getRecord(id) {
    // 把id为id的record
    const record = this.globalData.record
    for (let i = 0; i < record.length; ++i) {
      if (record[i].recordID === id)
        return record[i]
    }
  },

  setRecord(id, r) {
    // 把id为id的record
    const record = this.globalData.record
    for (let i = 0; i < record.length; ++i) {
      if (record[i].recordID == id){
        record[i] =r
      }
    }
  },

  deleteRecord(id) {
    // 删除record
    const record = this.globalData.record
    let ID
    for (let i = 0; i < record.length; ++i) {
      if (record[i].recordID == id){
        ID = record[i]._id
        record.splice(i, 1)
        console.log("you have delete record", i)
      }
    }
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delRecord',
      // 传给云函数的参数
      data: {
        _id: ID
      },
    })
    .then(res => {
      
    })
    .catch(console.error)

  },

  addRecord(record) {
    // 添加一条记录
    this.globalData.record.push(record)
  },
  
  getNextRecordId(){
    return this.globalData.record.length
  },

  getDayRangeMS(ms) {
    const d0 = new Date(ms)
    console.log(d0, "当日")
    const theDay = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate())
    let nextDay = new Date(Date.parse(theDay) + oneDayMs)
    return [theDay, nextDay]
  },

  getWeekRangeMS(ms) {
    let d0 = new Date(ms)
    console.log(d0, "本周")
    d0 = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate())

    const ms_start = Date.parse(d0) - oneDayMs * d0.getDay()
    const ms_end = ms_start + oneDayMs * 7
    return [new Date(ms_start), new Date(ms_end)]
  },

  getMonthRangeMS(ms) {
    let d0 = new Date(ms)
    console.log(d0,  "当月")
    d0 = new Date(d0.getFullYear(), d0.getMonth())
    let ms_end = Date.parse(d0) + oneDayMs * 40
    let d1 = new Date(ms_end)
    d1 = new Date(d1.getFullYear(), d1.getMonth())
    return [d0, d1]
  },

  
  getYearRangeMS(ms) {
    const d0 = new Date(ms)
    console.log(d0, "本年")
    return [new Date(d0.getFullYear(), 0), new Date(d0.getFullYear() + 1, 0)]
  },

  printRange(start, end) {
    console.log("时间范围:", start, "到", end)
  },
  
  test(){
    const todayRecord = this.getOneDayAllRecordMS(Date.now())
    // console.log(todayRecord)
    // for (let i = 0; i < todayRecord.length; ++i)
    //   console.log(this.get_formated_record(todayRecord[i]))
    // 下面三种方式都可以获得从 1970/01/01 至今的毫秒数

    // this.printRange(...this.getDayRangeMS(Date.now()))
    // this.printRange(...this.getWeekRangeMS(Date.now()))
    // this.printRange(...this.getMonthRangeMS(Date.now()))
    // this.printRange(...this.getYearRangeMS(Date.now()))
    // this.printRange(...this.getDayRangeMS(new Date().getTime()))
    // this.printRange(...this.getDayRangeMS(new Date(2021, 5 - 1, 29).getTime()))
    // console.log(this.getSomeDayRecordstatistics(Date.now()))
    // console.log(this.getSomeWeekRecordstatistics(Date.now() - oneDayMs*30))
    // console.log(this.getSomeMonthRecordstatistics(Date.now() - oneDayMs * 300))
    // console.log(this.getSomeYearRecordstatistics(Date.now() - oneDayMs * 1000))
    
  },

  getOneDayAllRecordMS(ms) {
    // 获取当天的所有记录
    // 传入参数可以是下面这样
    // new Date(2021, 5 - 1, 29).getTime())
    // Date.now()
    return this.getRecordTimeRange(...this.getDayRangeMS(ms))
  },

  getRecordTimeRange(d_start, d_end) {
    console.log(d_start, "到", d_end, "的所有记录")
    const record = this.globalData.record
    const ms_start = d_start.getTime()
    const ms_end = d_end.getTime()
    let ans = []
    for (let i = 0; i < record.length; ++i) {
      if (record[i] && record[i].startTime >= ms_start && record[i].startTime < ms_end)
        ans.push(record[i])
    }
    if (ans.length === 0) {
      console.log("无数据，填充数据以测试")
      this.addRecordForTest(ms_start, ms_end)
      return this.getRecordTimeRange(d_start, d_end)
    }
    return ans
  },
  addRecordForTest(ms_start, ms_end) {
    const n = 10;
    for (let i = 0; i < n; ++i) {
      this.addRecord({
        taskID: i % this.globalData.tasks.length,
        recordID: this.globalData.recordID++,
        startTime: ms_start + i * parseInt((ms_end-ms_start) / n),
        isFinish: i == 0 ? 0 : 1,
        exitTime: i,  // ms
        durationTime: parseInt((ms_end-ms_start) / n), // ms
      })
    }
  },

  AddFormatToDate(){
    // 让Date有format函数
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }

      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }

      return fmt;
    }
  },
    get_finished_count() {
      // 获取累积已完成的专注次数
      let count = 0
      const record = this.globalData.record
      for (let i = 0; i < record.length; ++i)
        if (record[i] && record[i].isFinish)
          ++count;
      return count;
    },
    get_finished_total_time() {
      // 获取累积专注时长/分钟
      let count = 0
      const record = this.globalData.record
      for (let i = 0; i < record.length; ++i)
        if (record[i] && record[i].isFinish)
          count += parseInt(record[i].durationTime / 1000 / 60)
      return count
    },

    // 获取累积专注天数，算了吧
    // 获取累积日均时长/分钟，算了吧

    getRangeRecordStatistics(d_start, d_end){
      // 获取从d_start 到d_end的不同task的情况
      console.log(d_start, "到", d_end, "的记录统计情况")
      let ans = []
      const record = this.globalData.record
      const ms_start = d_start.getTime()
      const ms_end = d_end.getTime()
      for (let i = 0; i < record.length; ++i){
        const r = record[i]
        if (r && r.isFinish && r.startTime >= ms_start && r.startTime < ms_end) {
          ans[r.taskID] = ans[r.taskID] || {
            taskID: r.taskID,
            count: 0,
            total_time: 0
          }
          ans[r.taskID].count ++;
          ans[r.taskID].total_time += parseInt(r.durationTime / 1000 / 60)
        }
      }
      if (ans.length === 0) {
        console.log("无数据，填充数据以测试")
        this.addRecordForTest(ms_start, ms_end)
        return this.getRangeRecordStatistics(d_start, d_end)
      }
      return ans
    },
    // 获取某一天的专注次数
    // 获取某一天的专注时长/分钟

    // 获取某天、某周、某月、不同事件的总专注时间

    getSomeDayRecordstatistics(ms){
      // 获取某天的记录统计结果
      return this.getRangeRecordStatistics(...this.getDayRangeMS(ms))
    },

    getSomeWeekRecordstatistics(ms){
      // 获取某天的记录统计结果
      return this.getRangeRecordStatistics(...this.getWeekRangeMS(ms))
    },
    getSomeMonthRecordstatistics(ms){
      // 获取某天的记录统计结果
      return this.getRangeRecordStatistics(...this.getMonthRangeMS(ms))
    },
    getSomeYearRecordstatistics(ms){
      // 获取某天的记录统计结果
      return this.getRangeRecordStatistics(...this.getYearRangeMS(ms))
    },

    getSomeMonthDistribution(ms){
      // 获取一个月内每天的工作时间
      this.addRecordForTest(ms - oneDayMs * 30, ms)
      const monthData = this.getRecordTimeRange(...this.getMonthRangeMS(ms))
      let ans = []
      for (let i = 0; i < monthData.length; ++i){
        const x = monthData[i]
        const d = new Date(x.startTime).getDate()
        ans[d] = ans[d] || 0
        ans[d] += parseInt(x.durationTime / 1000 / 60)
      }
      // console.log('月分布', ans)
      return ans
    },
    
    getSomeYearDistribution(ms){
      // 获取一年内每个月的工作时间
      this.addRecordForTest(ms - oneDayMs * 465, ms)
      const monthData = this.getRecordTimeRange(...this.getYearRangeMS(ms))
      let ans = []
      for (let i = 0; i < monthData.length; ++i){
        const x = monthData[i]
        const d = new Date(x.startTime).getMonth()
        ans[d] = ans[d] || 0
        ans[d] += parseInt(x.durationTime / 1000 / 60)
      }
      // console.log('月分布', ans)
      return ans
    },
    // 获取某月工作时段分布

    getSomeMonthDayDistribution(ms) {
      // 获取一个月 一天内每个时间段的工作事件
      return this.getDayDistribution(...this.getMonthRangeMS(ms))
    },
    
    getDayDistribution(d_start, d_end) {
      // 获取 某一时间段内的工作时间分布（在一天中每个时间段内，分别工作了多少时间）
      this.addRecordForTest(d_start.getTime(), d_end.getTime())
      const monthData = this.getRecordTimeRange(d_start, d_end)
      let ans = []
      for (let i = 0; i < monthData.length; ++i) {
        const x = monthData[i]
        let d = new Date(x.startTime).getHours()
        let total_minutes = parseInt(x.durationTime / 1000 / 60)
        while (total_minutes > 0) {
          d = (d + 1) % 24
          let t = total_minutes > 60 ? 60 : total_minutes
          ans[d] = (ans[d] || 0) + t
          total_minutes -= t
        }
      }
      // console.log('月分布', ans)
      return ans
    },
    
    
    // 获取某月，每天的专注时间

    // 或群某年，每年的专注时间

  get_formated_record(r) {
    // 获取信息是字符串的记录
    return Object.assign({}, r ,{
      id: r.recordID,
      taskName: this.globalData.tasks[r.taskID].name,
      taskStartTime: new Date(r.startTime).format("yyyy-MM-dd hh:mm"),
      taskEndTime: new Date(r.startTime + r.durationTime).format("yyyy-MM-dd hh:mm"),
      taskTime: parseInt(r.durationTime / 1000 / 60),
      status: r.isFinish ? "已完成" : "中途放弃"
    })

  },

  make_record(r) {
    // 生成原始record数据
    return Object.assign({}, r ,{
      taskID: r.taskID,
      recordID: r.id,
      startTime:  r.startTime,
      isFinish: r.isFinish || 1,
      exitTime: r.exitTime || 0,  // ms
      durationTime: r.taskTime * 1000 * 60,
    })
  }


})