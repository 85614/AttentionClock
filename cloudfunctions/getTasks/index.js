const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100


exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('tasks').count()
  const total = countResult.total

  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)

  // 承载所有读操作的 promise 的数组
  let tasks = []
  for (let i = 0; i < batchTimes; i++) {
    await db.collection('tasks').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
      tasks = tasks.concat(res.data)
    })
  }
  console.log(tasks)
  return {
    data: tasks
  }
}