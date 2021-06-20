// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const newTasks = event.newTask
  let id
  await db.collection('records').where({
    id: newTasks.id,
  }).get({
    success: function(res) {
      id = res.data[0]._id
    }
  })

  await db.collection('records').doc(id).set({
    data: newTasks,
    success: function(res) {},
    fail: console.error,
  })


  return {}
}