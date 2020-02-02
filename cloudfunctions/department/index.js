const os = require('os')
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const departmentCollection = db.collection('department')
const ROOT_ID = 'root'

async function departmentTree(ctx) {
  try {
    const event = ctx.event
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.lookup.html
    const result = await departmentCollection.aggregate()
      .match({
        parentId: 'root'
      })
      .lookup({
        from: 'department',
        localField: '_id',
        foreignField: 'parentId',
        as: 'children'
      })
      .end()
    console.log(result)
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

  app.router('departmentTree', departmentTree)

  return app.serve()
}