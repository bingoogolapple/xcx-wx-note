const os = require('os')
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const got = require('got')
const rp = require('request-promise')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

async function gotGet(ctx) {
  try {
    const resp = await got.get('http://httpbin.org/get', {
      json: true
    })
    console.log(resp.body)

    ctx.body = {
      code: 0,
      data: resp.body
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function gotPost(ctx) {
  try {
    let resp = await got.post('http://httpbin.org/post', {
      json: true,
      body: {
        title: '标题',
        content: '内容'
      }
    })
    console.log(resp.body)

    ctx.body = {
      code: 0,
      data: resp.body
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function rpGet(ctx) {
  try {
    let resp = await rp({
      uri: 'http://httpbin.org/get',
      json: true
    })
    console.log(resp)

    ctx.body = {
      code: 0,
      data: resp
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function rpPost(ctx) {
  try {
    let resp = await rp({
      method: 'POST',
      uri: 'http://httpbin.org/post',
      json: true,
      body: {
        title: '标题',
        content: '内容'
      }
    })
    console.log(resp)

    ctx.body = {
      code: 0,
      data: resp
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function movieList(ctx) {
  try {
    const event = ctx.event
    let resp = await rp({
      uri: `https://www.wanandroid.com/article/list/${event.page}/json`,
      json: true
    })

    console.log(resp)
    if (resp.errorCode == 0) {
      ctx.body = {
        code: 0,
        data: resp.data
      }
    } else {
      ctx.body = {
        code: resp.errorCode,
        data: resp.errorMsg
      }
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

  app.router('gotGet', gotGet)
  app.router('gotPost', gotPost)
  app.router('rpGet', rpGet)
  app.router('rpPost', rpPost)
  app.router('movieList', movieList)

  return app.serve()
}

// 本地测试云函数
let result = exports.main({
  $url: 'rpPost',
  page: 1
}, {})
console.log('本地测试结果', result)