// app.js
const themeListeners = []

App({
  onLaunch() {
    console.log('App Launch')
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

      }, {

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

  getRecord() {

  },

  setRecord() {

  },

  deleteRecord() {

  },

  addRecord(record) {
    this.globalData.record.push(record)
  },





})