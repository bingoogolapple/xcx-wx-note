const os = require('os')
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const userInfos = db.collection('userInfos')

/**
 * 用户登录
 */
async function login(ctx) {
  try {
    // 云端添加时默认不会添加 _openid 字段，需要单独设置
    const user = ctx.event.user
    let openid = ctx.event.userInfo.openId
    user._openid = openid

    let result = await userInfos.where({
      _openid: openid
    }).field({
      _id: true
    }).get()
    // { data: [], errMsg: 'collection.get:ok' }
    // { data: [ { _id: 'da51bd8c5e31a72b0794e37a2c7a1add' } ], errMsg: 'collection.get:ok' }
    console.log('用户登录-查询结果', result)

    if (result.data.length === 0) {
      result = await userInfos.add({
        data: user
      })
      // { _id: 'da51bd8c5e31a72b0794e37a2c7a1add', errMsg: 'collection.add:ok' }
      console.log('用户登录-添加结果', result)
      user._id = result._id
    } else {
      let id = result.data[0]._id
      result = await userInfos.doc(id).update({
        data: user
      })
      // 不管是 update 还是 set，都要放到调用后再设置 _id，否则会报错「不能更新_id的值;」
      user._id = id
      // update 方法（更新传入的字段）至少有一个字段变化时 updated 才为 1，否则为 0：{ stats: { updated: 0 }, errMsg: 'document.update:ok' }
      // set 方法（替换除了 _id 以外的其他字段，查漏补缺）：{"_id":"da51bd8c5e31a72b0794e37a2c7a1add","errMsg":"document.set:ok","stats":{"updated":1,"created":0}}
      // set 方法 不存在的 _id 进行 set 后 created 为 1：{"_id":"sdfsdfsdfsdfsdf","errMsg":"document.set:ok","stats":{"updated":0,"created":1}}
      console.log('用户登录-更新结果', result)
    }

    ctx.body = {
      code: 0,
      data: user
    }
  } catch (err) {
    console.error('用户登录-失败', err)
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

  app.router('login', login)

  return app.serve()
}