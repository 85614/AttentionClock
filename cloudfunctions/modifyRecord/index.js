// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const newRecord = event.newRecord
  let id
  await db.collection('records').where({
    recordID: newRecord.recordID,
  }).get({
    success: function(res) {
      // res.data 是包含以上定义的两条记录的数组
      id = res.data[0]._id
    }
  })

  await db.collection('records').doc(id).set({
    data: newRecord,
    success: function(res) {},
    fail: console.error,
  })

  return {}
}