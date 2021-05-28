// pages/timelines/timelines.js
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
    taskArry: ["math", "Chinese", "tech"], // 所有的待办事项
    taskArryindex: 0,
    moreOptions: [
      {
        text: "详细",
        extClass: 'slideview-button'
      },
      {
        text: "编辑",
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
  },

  onLoad: function() {
    this.setData({
      taskRecords: wx.getStorageSync('taskRecords') || [
        {
          id: 0,
          taskName: "math",
          taskStartTime: "2021-5-17 15:32",
          taskEndTime: "2021-5-17 15:34",
          taskTime: 25,
          note: "haha",
          status: "已完成"
        },
        {
          id: 1,
          taskName: "Chinese",
          taskStartTime: "2021-5-17 15:32",
          taskEndTime: "2021-5-17 15:34",
          taskTime: 25,
          note: "haha",
          status: "已完成"
        },
        {
          id: 2,
          taskName: "tech",
          taskStartTime: "2021-5-17 15:32",
          taskEndTime: "2021-5-17 15:34",
          taskTime: 25,
          note: "haha",
          status: "已完成"
        }
      ]
    })
  },
  // 日历选择
  bindselectDate: function(e) {
    console.log(e)
    this.setData({
      hasData: true
    })
  },

  // 添加记录
  addRecords: function() {
    this.setData({
      dialogAddShow: true
    })
  },

  tapDialogAddButton: function(e, o) {
    if(e.detail.index == 1) {
      this.data.taskRecords.push({
        id: this.data.taskRecords[this.data.taskRecords.length - 1].id + 1,
        taskName: this.data.taskArry[this.data.taskArryindex],
        taskStartTime: "2021-5-17 15:32",
        taskEndTime: "2021-5-17 15:34",
        taskTime: 25,
        note: "左滑填写心得",
        status: "已完成"
      })
      this.setData({
        taskRecords: this.data.taskRecords,
        hasData: true
      })
    }
    this.setData({
      dialogAddShow: false,
    })
    wx.setStorageSync('taskRecords', this.data.taskRecords)
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
      taskArryindex: e.detail.value
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
      const dialogDetailNote = this.data.taskRecords[e.currentTarget.dataset.idx].note
      this.setData({
        dialogDetaileShow: true,
        dialogDetaileTitle,
        dialogDetailStartTime,
        dialogDetailEndTime,
        dialogDetailTime,
        dialogDetailStatus,
        dialogDetailNote,
      })
    } else if(e.detail.index == 1) {
      const dialogEditIndex = e.currentTarget.dataset.idx
      this.setData({
        dialogEditShow: true,
        dialogEditTitle: "编辑记录",
        dialogEditIndex
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
      console.log(this.data.dialogEditIndex)
      this.data.taskRecords[this.data.dialogEditIndex].taskTime = this.data.dialogEditTime
      this.data.taskRecords[this.data.dialogEditIndex].note = this.data.dialogEditNote
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
  },

  dialogEditInput: function(e) {
    const dialogEditTime = e.detail.value
    this.setData({
      dialogEditTime: dialogEditTime
    })
  },

  dialogEditInputNote: function(e) {
    const dialogEditNote = e.detail.value
    this.setData({
      dialogEditNote: dialogEditNote
    })
  }


})