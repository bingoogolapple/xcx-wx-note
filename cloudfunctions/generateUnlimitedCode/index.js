// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const codeContentResult = await cloud.openapi.wxacode.getUnlimited({
      scene: 'id=d68532785e2d200'
    })
    console.log(codeContentResult)
    const codeResult = await cloud.uploadFile({
      cloudPath: 'code/' + new Date().getTime() + '.jpeg',
      fileContent: codeContentResult.buffer
    })
    console.log(codeResult)
    return codeResult
  } catch (err) {
    console.error(err)
    return err
  }
}