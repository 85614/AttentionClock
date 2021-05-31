// var base64 = require("../images/base64")
import CustomPage from '../../base/CustomPage'

const app = getApp()

CustomPage({
  data: {
    dialogAgentDeleteShow: false,
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
      dialogButtons: [{
        text: '取消'
      }, {
        text: '确定',
        value: true
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
      tasks: app.getTasks()
    })
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
    this.setData({
      dialogAgentDeleteShow: true, 
      TaskDeletingIdx: idx
    })
  },
  updateTasks() {
    this.setData({
      tasks: this.data.tasks,
    })
  },
  editTask(idx) {
    this.setData({
      dialogAgentEditShow: true, 
      TaskEditingIdx: idx
    })
    this.data.TaskEditingName = this.data.tasks[idx].name
    this.data.TaskEdigingTime = this.data.tasks[idx].minutes
  },
  TaskDetail(idx) {
    this.setData({
      dialogAgentDetailShow: true, 
      TaskEditingIdx: idx
    })
  },
  addTask() {
    // 点击确认添加待办后
    const t = {
      id: app.getNextTaskId(),
      name: this.data.newTaskName,
      minutes: parseInt(this.data.newTaskTime),
      valid: true
    }
    this.data.tasks.unshift(t)
    this.setData({
      newTaskName: null,
      newTaskTime: null
    })
    app.addTask(t)
    this.updateTasks()
  },
  updateTask() {
    // 更新修改
    console.log("before update task check tasks", this.data.tasks)
    const t = this.data.tasks[this.data.TaskEditingIdx]
    t.name = this.data.TaskEditingName
    t.minutes = this.data.TaskEdigingTime
    app.setTaskById(t.id, t)
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
    if (e.detail.item.value)
      this.addTask()
    this.setData({
      dialogAgentAddShow: false,
    })
  },
  tapDialogButtonEdit(e, o) {
    // 按下编辑待办对话框的按钮
    console.log("tapDialogButton(e) e:", e, "owner;", o)
    if (e.detail.item.value)
      this.updateTask()
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
  tapDialogButtonDelete(e, o) {
    // 按下待办详情对话框的按钮
    app.deleteTaskById(this.data.tasks[this.data.TaskDeletingIdx].id)
    if (e.detail.item.value) {
      this.data.tasks.splice(this.data.TaskDeletingIdx, 1)
      this.updateTasks()
    }
    this.setData({
      dialogAgentDeleteShow: false,
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
    this.data.TaskEditingName = e.detail.value
    // console.log("this.TaskEditingIdx", this.data.TaskEditingIdx)
    
    // console.log("in inputTaskEditingName this.data.tasks",this.data.tasks)
  },
  inputTaskEditingTime(e) {
    // 编辑待办对话框待办时间输入改变
    // console.log("inputNewTaskName(e) e:", e)
    console.log("inputNewTaskTime(e) e.detail.value:", e.detail.value)
    this.data.TaskEdigingTime = e.detail.value
  }

});
