// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html
    const result = await cloud.openapi.subscribeMessage.send({
      touser: cloud.getWXContext().OPENID,
      page: 'pages/todo/add/add',
      data: {
        thing1: {
          value: '我是任务标题'
        },
        time3: {
          value: '2019年10月1日 15:01'
        },
        phrase5: {
          value: '未开始'
        },
        thing2: {
          value: '我是任务描述'
        }
      },
      templateId: event.tmpId
    })
    // { errMsg: 'openapi.subscribeMessage.send:ok', errCode: 0 }
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}