const os = require('os')
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const clinicCollection = db.collection('clinic')

async function addOrUpdateClinic(ctx) {
  try {
    const event = ctx.event
    const clinic = ctx.event.clinic

    let result
    if (clinic._id) {
      console.log('修改诊所信息')
      result = await clinicCollection.doc(clinic._id).update({
        data: {
          image: clinic.image,
          intro: clinic.intro,
          location: clinic.location,
          locationDesc: clinic.locationDesc
        }
      })
    } else {
      console.log('添加诊所信息')
      // 云端添加时默认不会添加 _openid 字段，需要单独设置
      clinic._openid = ctx.event.userInfo.openId
      result = await clinicCollection.add({
        data: clinic
      })
    }

    console.log(result)

    const isSuccess = result.errMsg.indexOf(':ok') !== -1
    ctx.body = {
      code: isSuccess ? 0 : 1,
      data: isSuccess,
      errMsg: isSuccess ? '操作成功' : '操作失败'
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

//---------------------------------------------------------------
exports.main = async(event, context) => {
  if (os.type() === 'Darwin') {
    console.log(event)
  } else {
    cloud.logger().info(event)
  }

  const app = new TcbRouter({
    event
  })

  app.use(async(ctx, next) => {
    ctx.event = event
    ctx.context = context
    await next()
  })

  app.router('addOrUpdateClinic', addOrUpdateClinic)

  return app.serve()
}