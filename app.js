// app.js
const themeListeners = []

const oneDayMs = 1000 * 60 *60 *24 // 一天的毫秒数

App({
  onLaunch() {
    console.log('App Launch')
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

  getTasks() { // 待完善
    return this.globalData.tasks
  },

  getTaskById(id) { // 待完善

    return this.globalData.tasks[id]
  },

  getRecord(id) {
    // 把id为id的record
    const record = this.globalData.record
    for (let i = 0; i < record.length; ++i) {
      if (record[i].id == id)
        return record[i]
    }
  },

  setRecord(id, r) {
    // 把id为id的record
    const record = this.globalData.record
    for (let i = 0; i < record.length; ++i) {
      if (record[i].id == id)
        record[i] =r
    }
  },

  deleteRecord(id) {
    // 删除record
    const record = this.globalData.record
    for (let i = 0; i < record.length; ++i) {
      if (record[i].id == id)
        record.splice(i, 1)
    }
  },

  addRecord(record) {
    // 添加一条记录
    this.globalData.record.push(record)
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
    console.log(todayRecord)
    for (let i = 0; i < todayRecord.length; ++i)
      console.log(this.get_formated_record(todayRecord[i]))
    // 下面三种方式都可以获得从 1970/01/01 至今的毫秒数

    this.printRange(...this.getDayRangeMS(Date.now()))
    this.printRange(...this.getWeekRangeMS(Date.now()))
    this.printRange(...this.getMonthRangeMS(Date.now()))
    this.printRange(...this.getYearRangeMS(Date.now()))
    this.printRange(...this.getDayRangeMS(new Date().getTime()))
    this.printRange(...this.getDayRangeMS(new Date(2021, 5 - 1, 29).getTime()))
  },

  getOneDayAllRecordMS(ms) {
    return this.getRecordTimeRange(...this.getDayRangeMS(ms))
  },

  getRecordTimeRange(d_start, d_end) {
    const record = this.globalData.record
    const ms_start = d_start.getTime()
    const ms_end = d_end.getTime()
    let ans = []
    for (let i = 0; i < record.length; ++i) {
      if (record[i].startTime >= ms_start && record[i].startTime < ms_end)
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
    // 获取累积专注次数
    // 获取累积专注时长/分钟
    // 获取累积专注天数
    // 获取累积日均时长/分钟

    // 获取某一天的专注次数
    // 获取某一天的专注时长/分钟

    // 获取某天、某周、某月、不同事件的总专注时间



    // 获取某月工作时段分布


    // 获取某月，每天的专注时间

    // 或群某年，每年的专注时间

  get_formated_record(r) {
   
    const rc = {
      id: r.recordID,
      taskId: r.taskID,
      taskName: this.globalData.tasks[r.taskID].name,
      taskStartTime: new Date(r.startTime).format("yyyy-MM-dd hh:mm"),
      taskEndTime: new Date(r.startTime + r.durationTime).format("yyyy-MM-dd hh:mm"),
      taskTime: parseInt(r.durationTime / 1000 / 60),
      status: r.isFinish ? "已完成" : "中途放弃"
    }
    console.log(this.make_record(rc))
    return Object.assign({}, r ,{
      id: r.recordID,
      taskId: r.taskID,
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