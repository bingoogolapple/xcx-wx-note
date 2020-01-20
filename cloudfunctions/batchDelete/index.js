// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()


// 云函数入口函数
exports.main = async(event, context) => {
  try {
    // 没找到对应数据时不会失败
    let result = await db.collection('specialty')
      .where({
        name: '便民门诊'
      })
      .remove()
    // {"stats":{"removed":0},"errMsg":"collection.remove:ok"}
    console.log(result)
    return result
  } catch (e) {
    console.log("批量删除失败", e)
    return {
      e: e
    }
  }
}