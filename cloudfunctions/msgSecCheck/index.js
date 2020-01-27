// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.msgSecCheck.html
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
    console.log('检测通过', result)
    return true
  } catch (err) {
    console.error('检测未通过', err)
    return false
  }
}