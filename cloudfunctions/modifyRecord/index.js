// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const newRecord = event.newRecord
  await db.collection('records').doc(newRecord._id).set({
    data: newRecord,
    success: function(res) {},
    fail: console.error,
  })

  return {}
}