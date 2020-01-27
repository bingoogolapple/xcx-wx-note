// 为了解决在一个环境中只有 20 个云函数 https://github.com/TencentCloudBase/tcb-router
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('event', event)

  const app = new TcbRouter({
    event
  })

  // app.use 表示该中间件会适用于所有的路由
  app.use(async(ctx, next) => {
    console.log('a、开始所有路由公共中间件')
    ctx.data = {}
    ctx.data.openId = event.userInfo.openId
    await next() // 执行下一中间件
    console.log('d、结束所有路由公共中间件', ctx.data)
    ctx.data.appendCommon = 'common 结束后追加'
  })

  // 路由为数组表示，该中间件适用于 user 和 timer 两个路由
  app.router(['user', 'timer'], async(ctx, next) => {
    console.log('b、开始 user、timer 公共中间件')
    ctx.data.common = 'user、timer 公共结果'
    await next() // 执行下一中间件
    console.log('c、结束 user、timer 公共中间件', ctx.data)
    ctx.data.appendUserTimer = 'userTimer 结束后追加'
  })

  // 路由为字符串，该中间件只适用于 user 路由
  app.router('user', async(ctx, next) => {
    console.log('A、开始 user 的第1个中间件')
    ctx.data.name = '直接返回的用户名'
    await next() // 执行下一中间件
    console.log('F、结束 user 的第1个中间件', ctx.data)
    ctx.data.appendUser = 'user 结束后追加'
  }, async(ctx, next) => {
    console.log('B、开始 user 的第2个中间件')
    ctx.data.sex = '直接返回的性别'
    await next() // 执行下一中间件
    console.log('E、结束 user 的第2个中间件')
  }, async(ctx) => {
    console.log('C、执行 user 的第3个中间件')
    ctx.data.city = '直接返回的城市'

    // ctx.body 返回数据到小程序端
    ctx.body = {
      code: 0,
      data: ctx.data
    }
  })

  // 路由为字符串，该中间件只适用于 timer 路由
  app.router('timer', async(ctx, next) => {
    console.log('1、开始 timer 的第1个中间件')
    ctx.data.name = '延时返回的用户名'
    await next() // 执行下一中间件
    console.log('9、结束 timer 的第1个中间件', ctx.data)
    ctx.data.appendTimer = 'timer 结束后追加'
  }, async(ctx, next) => {
    console.log('2、开始 timer 的第2个中间件-start')
    ctx.data.sex = await new Promise(resolve => {
      console.log('3、promise timer 的第2个中间件')
      // 等待500ms，再执行下一中间件
      setTimeout(() => {
        console.log('5、timeout timer 的第2个中间件')
        resolve('延时返回的性别')
      }, 500)
    })
    console.log('6、拿到结果 timer 的第2个中间件')
    await next() // 执行下一中间件
    console.log('8、结束 timer 的第2个中间件')
  }, async(ctx) => {
    console.log('7、执行 timer 的第3个中间件')
    ctx.data.city = '延时返回的城市'

    // ctx.body 返回数据到小程序端
    ctx.body = {
      code: 0,
      data: ctx.data
    }
  })

  // 路由为字符串，该中间件只适用于 user 路由
  app.router('single', async(ctx) => {
    console.log('single')
    ctx.data.xxx = 'single结果'

    // ctx.body 返回数据到小程序端
    ctx.body = {
      code: 0,
      data: ctx.data
    }
  })

  let result = app.serve()
  // 这里的 result 是个 Promise
  console.log('D 4、返回 Promise 结果')
  return result
}