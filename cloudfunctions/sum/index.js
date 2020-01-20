// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  /*
  云端发起时 wxContext 为 {}
  */
  console.log(event)
  console.log(context)
  console.log(wxContext)
  console.log()
  return {
    sum: event.a + event.b,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}