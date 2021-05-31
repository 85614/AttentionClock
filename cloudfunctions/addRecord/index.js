// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let newRecord = event.newRecord
  await db.collection('records').add({
    data: newRecord,
    success: function(res) {

    },
    fail: console.error,
    complete: console.log
  })

  return {
  }
}