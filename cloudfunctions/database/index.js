const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
const db = cloud.database()
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
const products = db.collection('products')

// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.add.html
async function addProduct(ctx) {
  try {
    // 云端添加时默认不会添加 _openid 字段，需要单独设置
    const product = ctx.event.product
    product._openid = ctx.event.userInfo.openId
    const result = await products.add({
      data: product
    })

    /*
    { 
      _id: '0ec685215e2faef806ab05233770d605',
      errMsg: 'collection.add:ok'
    }
    */

    ctx.body = {
      code: 0,
      data: result._id
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function loadProducts(ctx) {
  try {
    const result = await products.get()
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
exports.main = async(event, context) => {
  console.log('event', event)

  const app = new TcbRouter({
    event
  })

  app.use(async(ctx, next) => {
    ctx.event = event
    ctx.context = context
    await next()
  })

  app.router('addProduct', addProduct)
  app.router('loadProducts', loadProducts)

  return app.serve()
}