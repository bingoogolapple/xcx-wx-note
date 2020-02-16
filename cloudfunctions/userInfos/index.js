const os = require('os')
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const userInfosCollection = db.collection('userInfos')

/**
 * 用户管理查询用户列表
 */
async function userManageList(ctx) {
  try {
    const event = ctx.event

    let promise = userInfosCollection.aggregate()
    if (event.filterRole === '全部用户') { // 全部用户时，不过滤角色
    } else if (event.filterRole === '普通用户') { // 普通用户时，role 列表的 length 为 0
      promise = promise.match({
        role: _.size(0)
      })
    } else {
      // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.all.html
      promise = promise.match({
        role: _.all([event.filterRole])
      })
    }
    if (event.filterKeyword) { // 关键字不为空时才过滤关键字
      promise = promise.match({
        nickName: db.RegExp({
          regexp: event.filterKeyword
        })
      })
    }

    const result = await promise.skip(event.skip).limit(event.limit).end()
    console.log('查询用户列表', result)
    ctx.body = {
      code: 0,
      data: result.list
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

/**
 * 修改角色
 */
async function updateRole(ctx) {
  try {
    const result = await userInfosCollection.doc(ctx.event.userId).update({
      data: {
        role: ctx.event.role
      }
    })
    console.log('修改角色结果', result)

    const isSuccess = result.errMsg.indexOf(':ok') !== -1
    ctx.body = {
      code: isSuccess ? 0 : 1,
      data: isSuccess,
      errMsg: isSuccess ? '修改角色成功' : '修改角色失败'
    }
  } catch (err) {
    console.error('修改角色失败', err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

/**
 * 用户登录
 */
async function login(ctx) {
  try {
    // 云端添加时默认不会添加 _openid 字段，需要单独设置
    let user = ctx.event.user
    let openid = ctx.event.userInfo.openId
    user._openid = openid

    let result = await userInfosCollection.where({
      _openid: openid
    }).get()
    // { data: [], errMsg: 'collection.get:ok' }
    // { data: [ { _id: 'da51bd8c5e31a72b0794e37a2c7a1add' } ], errMsg: 'collection.get:ok' }
    console.log('用户登录-查询结果', result)

    if (result.data.length === 0) {
      user.role = []
      result = await userInfosCollection.add({
        data: user
      })
      // { _id: 'da51bd8c5e31a72b0794e37a2c7a1add', errMsg: 'collection.add:ok' }
      console.log('用户登录-添加结果', result)
      user._id = result._id
    } else {
      let id = result.data[0]._id
      result = await userInfosCollection.doc(id).update({
        data: user
      })
      // 不管是 update 还是 set，都要放到调用后再设置 _id，否则会报错「不能更新_id的值;」
      // user._id = id

      // update 方法（更新传入的字段）至少有一个字段变化时 updated 才为 1，否则为 0：{ stats: { updated: 0 }, errMsg: 'document.update:ok' }
      // set 方法（替换除了 _id 以外的其他字段，查漏补缺）：{"_id":"da51bd8c5e31a72b0794e37a2c7a1add","errMsg":"document.set:ok","stats":{"updated":1,"created":0}}
      // set 方法 不存在的 _id 进行 set 后 created 为 1：{"_id":"sdfsdfsdfsdfsdf","errMsg":"document.set:ok","stats":{"updated":0,"created":1}}
      console.log('用户登录-更新结果', result)

      // 更新成功后重新查询一次，否则没有自定义信息
      result = await userInfosCollection.doc(id).get()
      user = result.data;
    }

    const isSuccess = result.errMsg.indexOf(':ok') !== -1
    ctx.body = {
      code: isSuccess ? 0 : 1,
      data: isSuccess ? user : null,
      errMsg: isSuccess ? '登录成功' : '登录失败'
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
  app.router('updateRole', updateRole)
  app.router('userManageList', userManageList)

  return app.serve()
}