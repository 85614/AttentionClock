// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let newTasks = event.newTask
  newTasks._openid = wxContext.OPENID
  await db.collection('tasks').add({
    data: newTasks,
    success: function(res) {
      newTasks = res.data
    },
    fail: console.error,
    complete: console.log
  })

  return {
    data: newTasks,
  }
}