// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let result = await cloud.downloadFile({
      fileID: event.fileID
    })
    console.log('下载成功', result)

    // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.imgSecCheck.html
    result = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: result.fileContent
      }
    })
    console.log('检测通过', result)
    return true
  } catch (err) {
    console.error('检测未通过', err)
    return false
  }
}