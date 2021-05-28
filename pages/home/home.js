// var base64 = require("../images/base64")
import CustomPage from '../../base/CustomPage'

const app = getApp()

CustomPage({
  data: {
    TaskEditingIdx : 1,
    checkTask: {
      name: 'newTaskName',
      rules: {
        required: true,
        message: "待办名不符合要求",
        validator:(rule, value, param, models)=>{
          console.log(rule, value, param, models)
        }
      }
    }
  },
  onLoad: function () {
    this.setData({
      dialogAgentAddShow: false,
      max_id: wx.getStorageSync('max_id') || 5,
      
      dialogButtons: [{
        text: '取消'
      }, {
        text: '确定',
        action: this.addTask
      }],
      dialogButtonsEdit: [{
        text: '取消'
      }, {
        text: '确定',
        action: this.updateTask
      }],
      dialogButtonsDetail: [{
        text: '确定',
      }],
      // icon: base64.icon20,
      moreOptions: [{
        text: '详情',
        src: '/pages/cell/icon_love.svg', // icon的路径
        action: this.TaskDetail,
        extClass: 'slideview-button'
      }, {
        text: '编辑',
        extClass: 'test',
        src: '/pages/cell/icon_star.svg', // icon的路径
        action: this.editTask,
        extClass: 'slideview-button'
      }, {
        type: 'warn',
        text: '删除',
        extClass: 'test',
        src: '/pages/cell/icon_del.svg', // icon的路径
        action: this.deleteTask,
        extClass: 'slideview-button'
      }],
      tasks: wx.getStorageSync('tasks') || [{
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
      }],
    });
    this.updateTasks()
  },
  slideButtonTap(e) {
    // 左滑后的按钮按下
    console.log('slide button tap', e.detail)
    const idx = e.currentTarget.dataset.idx;
    const action = this.data.moreOptions[e.detail.index].action
    action && action(idx)
  },
  closeSlide() {
    // 
    this.setData({
      showDetailIndex: null
    })
  },
  showDetail(e) {
    // 左滑事件
    const idx = e.currentTarget.dataset.idx
    this.setData({
      showDetailIndex: this.data.tasks[idx].id
    })
  },
  deleteTask(idx) {
    this.data.tasks.splice(idx, 1)
    this.updateTasks()
  },
  updateTasks() {
    this.setData({
      tasks: this.data.tasks,
      max_id: this.data.max_id
    })
    wx.setStorageSync("tasks", this.data.tasks)
    wx.setStorageSync("max_id", this.data.max_id)
  },
  editTask(idx) {
    this.setData({
      dialogAgentEditShow: true, 
      TaskEditingIdx: idx
    })
  },
  TaskDetail(idx) {
    this.setData({
      dialogAgentDetailShow: true, 
      TaskEditingIdx: idx
    })
  },
  addTask() {
    // 点击确认添加待办后
    this.data.max_id += 1
    this.data.tasks.unshift({
      id: this.data.max_id,
      name: this.data.newTaskName,
      minutes: this.data.newTaskTime,
    })
    this.setData({
      newTaskName: null,
      newTaskTime: null
    })
    this.updateTasks()
  },
  updateTask() {
    // 更新修改
    console.log("before update task check tasks", this.data.tasks)
    this.updateTasks()
  },
  openAddTaskDialog() {
    // 打开添加待办对话框
    this.setData({
      dialogAgentAddShow: true,
    });
  },

  startTask(e) {
    // 点击开始按钮开始待办
    console.log("start task id: " + e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: "../begintimer/begintimer?id=" + parseInt(id)
    })
  },
  tapDialogButton(e, o) {
    // 按下添加待办对话框的按钮
    console.log("tapDialogButton(e) e:", e, "owner;", o)
    e.detail.item.action && e.detail.item.action()
    this.setData({
      dialogAgentAddShow: false,
    })
  },
  tapDialogButtonEdit(e, o) {
    // 按下编辑待办对话框的按钮
    console.log("tapDialogButton(e) e:", e, "owner;", o)
    e.detail.item.action && e.detail.item.action()
    this.setData({
      dialogAgentEditShow: false,
    })
  },
  tapDialogButtonDetail(e, o) {
    // 按下待办详情对话框的按钮
    this.setData({
      dialogAgentDetailShow: false,
    })
  },
  inputNewTaskName(e) {
    // 添加待办对话框待办名输入改变
    // console.log("inputNewTaskName(e) e:", e)
    console.log("inputNewTaskName(e) e.detail.value:", e.detail.value)
    this.data.newTaskName = e.detail.value
  },
  inputNewTaskTime(e) {
    // 添加待办对话框待办时间输入改变
    // console.log("inputNewTaskName(e) e:", e)
    console.log("inputNewTaskTime(e) e.detail.value:", e.detail.value)
    this.data.newTaskTime = e.detail.value
    
  },
  inputTaskEditingName(e) {
    // 编辑待办对话框待办名称输入改变
    // console.log("inputNewTaskName(e) e:", e)
    console.log("inputNewTaskName(e) e.detail.value:", e.detail.value)
    const TaskEditingName = e.detail.value
    // console.log("this.TaskEditingIdx", this.data.TaskEditingIdx)
    this.data.tasks[this.data.TaskEditingIdx].name = TaskEditingName
    // console.log("in inputTaskEditingName this.data.tasks",this.data.tasks)
  },
  inputTaskEditingTime(e) {
    // 编辑待办对话框待办时间输入改变
    // console.log("inputNewTaskName(e) e:", e)
    console.log("inputNewTaskTime(e) e.detail.value:", e.detail.value)
    const TaskEdigingTime = e.detail.value
    this.data.tasks[this.data.TaskEditingIdx].minutes = TaskEdigingTime
  }

});
