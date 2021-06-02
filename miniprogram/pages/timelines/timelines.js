// pages/timelines/timelines.js

const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    curYear: new Date().getFullYear(), // 年份
    curMonth: new Date().getMonth() + 1,// 月份 1-12
    day: new Date().getDate(), // 日期 1-31 若日期超过该月天数，月份自动增加
    header_show: true, // 主标题是否显示
    prev: true, // 上一个月按钮是否显示
    next: true, // 下一个月按钮是否显示
    hasData: false, // 选中的日期是否存在数据
    dialogAddShow: false, // 补充记录的对话框是否出现
    dialogDetaileShow: false, // 记录详情的对话框是否出现
    dialogEditShow: false, // 记录修改的对话框是否出现
    newStartTime: new Date().getHours().toString() + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes(): new Date().getMinutes()),
    taskArryindex: 0,
    moreOptions: [
      {
        text: "详细",
        extClass: 'slideview-button'
      },
      {
        text: "编辑",
        extClass: 'slideview-button'
      },
      {
        type: 'warn',
        text: "删除",
        extClass: 'slideview-button'
      }
    ],

    dialog_add_buttons: [
      {
        text: "取消"
      },
      {
        text: "确定",
      }
    ],
    dialog_detail_buttons: [
      {
        text: "关闭"
      }
    ],
    dialog_edit_buttons: [
      {
        text: "取消"
      },
      {
        text: "确定",
      }
    ],
    dialog_delete_buttons: [
      {
        text: "取消"
      },
      {
        text: "确定",
      }
    ],
  },

  onShow: function() {
    console.log('timelines onShow')
    // console.log(app.getAllTasks())
    console.log('this.data.newDate', this.data.newDate)
    const todayRecord = app.getOneDayAllRecordMS(new Date(this.data.newDate || Date.now()).getTime())
    const taskRecords = []
    const taskArry = []
    const validTasks = app.getValidTasks()
    for (let i = 0; i < todayRecord.length; ++i){
      console.log(app.get_formated_record(todayRecord[i]))
      taskRecords.push(app.get_formated_record(todayRecord[i]))
    }
    for(let i = 0; i < validTasks.length; i++) {
      taskArry.push(app.getTaskById(validTasks[i].id).name)
    }
    this.setData({
      hasData: taskRecords != 0,
      taskRecords: taskRecords,
      taskArry: taskArry,
      validTasks,
      newDate: new Date().format("yyyy-MM-dd")
    })
  },
  // 日历选择
  bindselectDate: function(e) {
    this.setData({
      hasData: false,
      newDate: e.detail.date,
      taskRecords: []
    })
    const todayRecord = app.getOneDayAllRecordMS(new Date(e.detail.date).getTime())
   if(todayRecord.length != 0) {
     const taskRecords = []
     for (let i = 0; i < todayRecord.length; ++i){
        taskRecords.push(app.get_formated_record(todayRecord[i]))
      }
     this.setData({
        hasData: true,
        taskRecords
     })
   }
  //  wx.setStorageSync('taskRecords', this.data.taskRecords)
  },

  // 添加记录
  addRecords: function() {
    this.setData({
      dialogAddShow: true
    })
  },

  tapDialogAddButton: function(e, o) {
    if(e.detail.index == 1) {
      const newDate = this.data.newDate + " " + this.data.newStartTime
      const newRecord = {
        taskID: this.data.validTasks[this.data.taskArryindex].id,
        id: app.getNextRecordId(),
        startTime: new Date(newDate).getTime(),
        isFinish: 1,
        exitTime: 0,
        taskTime: parseInt(this.data.newTime)
      }
      const newTaskRecord = app.make_record(newRecord)
      this.data.taskRecords.push(app.get_formated_record(newTaskRecord))
      app.addRecord(newTaskRecord)
      console.log(newTaskRecord)
      this.setData({
        taskRecords: this.data.taskRecords,
        hasData: true
      })
    }
    this.setData({
      dialogAddShow: false,
    })
    // wx.setStorageSync('taskRecords', this.data.taskRecords)

  },

  bindTimeChange:function(e) {
    this.setData({
      newStartTime: e.detail.value
    })
  },

  bindNewTime: function(e) {
    const newTime = e.detail.value
    this.setData({
      newTime
    })
  },

  bindTaskChange: function(e) {
    this.setData({
      taskArryindex: parseInt(e.detail.value)
    })
  },
  showMoreOptions: function(e) {
    console.log(e)
    const idx = e.currentTarget.dataset.idx
    this.setData({
      showMoreOptionsIndex: this.data.taskRecords[idx].id
    })
  },

  hideMoreOptions: function() {
    this.setData({
      showMoreOptionsIndex: null
    })
  },

  hideSlide: function() {
    this.setData({
      showMoreOptionsIndex: null
    })
  },

  tapSlideViewButtons: function(e) {
    if(e.detail.index == 0) {
      const dialogDetaileTitle = this.data.taskRecords[e.currentTarget.dataset.idx].taskName
      const dialogDetailStartTime = this.data.taskRecords[e.currentTarget.dataset.idx].taskStartTime
      const dialogDetailEndTime = this.data.taskRecords[e.currentTarget.dataset.idx].taskEndTime
      const dialogDetailTime = this.data.taskRecords[e.currentTarget.dataset.idx].taskTime
      const dialogDetailStatus = this.data.taskRecords[e.currentTarget.dataset.idx].status
      this.setData({
        dialogDetaileShow: true,
        dialogDetaileTitle,
        dialogDetailStartTime,
        dialogDetailEndTime,
        dialogDetailTime,
        dialogDetailStatus,
      })
    } else if(e.detail.index == 1) {
      const dialogEditIndex = e.currentTarget.dataset.idx
      const dialogEditID = e.currentTarget.dataset.recordid
      this.setData({
        dialogEditShow: true,
        dialogEditTitle: "编辑记录",
        dialogEditIndex,
        dialogEditID
      })
    } else if(e.detail.index == 2) {
      const dialogDeleteIndex = e.currentTarget.dataset.recordid
      this.setData({
        dialogDeleteShow: true,
        dialogDeleteTitle: "删除记录",
        dialogDeleteIndex
      })
    }
  },

  tapDialogDetailButton: function(e) {
    this.setData({
      dialogDetaileShow: false,
      showMoreOptionsIndex: null
    })
  },

  tapDialogEditButton: function(e) {
    if(e.detail.index == 1) {
      this.data.taskRecords[this.data.dialogEditIndex].taskTime = this.data.dialogEditTime
      const editRecord = {
        taskID: this.data.taskRecords[this.data.dialogEditIndex].taskID,
        id: this.data.taskRecords[this.data.dialogEditIndex].id,
        startTime: this.data.taskRecords[this.data.dialogEditIndex].startTime,
        isFinish: this.data.taskRecords[this.data.dialogEditIndex].isFinish,
        exitTime: this.data.taskRecords[this.data.dialogEditIndex].exitTime,
        taskTime: parseInt(this.data.taskRecords[this.data.dialogEditIndex].taskTime)
      }
      app.setRecord(this.data.dialogEditID, app.make_record(editRecord))
      this.setData({
        taskRecords: this.data.taskRecords
      })
    }
    this.setData({
      dialogEditShow: false,
      dialogEditIndex: null,
      showMoreOptionsIndex: null,
      dialogEditTime: null
    })
    // wx.setStorageSync('taskRecords', this.data.taskRecords)
  },

  dialogEditInput: function(e) {
    const dialogEditTime = e.detail.value
    this.setData({
      dialogEditTime: dialogEditTime
    })
  },

  tapDialogDeleteButton: function(e) {
    const index = this.data.dialogDeleteIndex
    if(e.detail.index == 1) {
      app.deleteRecord(index)
      const todayRecord = app.getOneDayAllRecordMS(new Date(this.data.newDate).getTime())
      const taskRecords = []
      for (let i = 0; i < todayRecord.length; ++i){
        console.log(app.get_formated_record(todayRecord[i]))
        taskRecords.push(app.get_formated_record(todayRecord[i]))
      }
      this.setData({
        taskRecords: taskRecords,
        dialogDeleteShow: false,
        dialogDeleteIndex: null,
        showMoreOptionsIndex: null,
      })
    } else {
      this.setData({
        dialogDeleteShow: false,
        dialogDeleteIndex: null,
        showMoreOptionsIndex: null,
      })
    }
    // wx.setStorageSync('taskRecords', this.data.taskRecords)
  }


})