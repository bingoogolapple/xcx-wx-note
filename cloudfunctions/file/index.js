const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const files = db.collection('files')

async function test(ctx) {
  try {
    const event = ctx.event
    

    ctx.body = {
      code: 0,
      data: result.data
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
exports.main = async (event, context) => {
  const log = cloud.logger()
  log.info(event)

  const app = new TcbRouter({
    event
  })

  app.use(async (ctx, next) => {
    ctx.event = event
    ctx.context = context
    await next()
  })

  app.router('test', test)

  return app.serve()
}