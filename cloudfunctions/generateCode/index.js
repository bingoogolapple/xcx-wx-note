const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const got = require('got')
const os = require('os')

const APPID = 'wx06837deceb077b5a'
const APPSECRET = 'd2fcfe7293a3fa9051a249fd79ac4d04'
// 在线调试 https://mp.weixin.qq.com/debug/cgi-bin/apiinfo
const TOKEN_URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

async function getAccessToken() {
  try {
    const resp = await got.get(TOKEN_URL, {
      json: true
    })
    console.log('获取 token 返回结果', resp.body)
    if (resp.body.access_token) {
      console.log('获取 token 成功')
      return resp.body.access_token
    } else {
      console.log('获取 token 失败')
      throw '获取 token 失败'
    }
  } catch (err) {
    console.error('获取 token 失败', err)
    throw '获取 token 失败'
  }
}

async function generateLimitQRCode(ctx) {
  try {
    const event = ctx.event

    let fileContent
    if (event.fromRemoteApi) {
      console.log('调远程 api 生成限制数量的小程序二维码')
      let accessToken = await getAccessToken()
      const resp = await got.post(`https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: event.path,
          width: event.width ? event.width : 430
        }),
        responseType: 'buffer',
        encoding: null // 默认为 utf8，设置为 null 时才会返回 buffer
      })
      fileContent = resp.body
    } else {
      console.log('调小程序云 api 生成限制数量的小程序二维码')
      const codeContentResult = await cloud.openapi.wxacode.createQRCode({
        path: event.path,
        width: event.width ? event.width : 430
      })
      // contentType、buffer
      fileContent = codeContentResult.buffer
    }

    const uploadResult = await cloud.uploadFile({
      cloudPath: 'code/' + new Date().getTime() + '.jpeg',
      fileContent: fileContent
    })

    ctx.body = {
      code: 0,
      data: uploadResult.fileID
    }
  } catch (err) {
    console.error('生成限制数量的小程序二维码失败', err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function generateLimitCode(ctx) {
  try {
    const event = ctx.event

    let fileContent
    if (event.fromRemoteApi) {
      console.log('调远程 api 生成限制数量的小程序码')
      let accessToken = await getAccessToken()
      const resp = await got.post(`https://api.weixin.qq.com/wxa/getwxacode?access_token=${accessToken}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: event.path,
          width: event.width ? event.width : 430,
          auto_color: event.auto_color ? event.auto_color : false,
          line_color: event.line_color ? event.line_color : {
            r: 0,
            g: 0,
            b: 0
          },
          is_hyaline: event.is_hyaline ? event.is_hyaline : false
        }),
        responseType: 'buffer',
        encoding: null // 默认为 utf8，设置为 null 时才会返回 buffer
      })
      fileContent = resp.body
    } else {
      console.log('调小程序云 api 生成限制数量的小程序码')
      const codeContentResult = await cloud.openapi.wxacode.get({
        path: event.path,
        width: event.width ? event.width : 430,
        auto_color: event.auto_color ? event.auto_color : false,
        line_color: event.line_color ? event.line_color : {
          r: 0,
          g: 0,
          b: 0
        },
        is_hyaline: event.is_hyaline ? event.is_hyaline : false
      })
      // contentType、buffer
      fileContent = codeContentResult.buffer
    }

    const uploadResult = await cloud.uploadFile({
      cloudPath: 'code/' + new Date().getTime() + '.jpeg',
      fileContent: fileContent
    })

    ctx.body = {
      code: 0,
      data: uploadResult.fileID
    }
  } catch (err) {
    console.error('生成限制数量的小程序码失败', err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function generateUnlimitCode(ctx) {
  try {
    const event = ctx.event

    let fileContent
    if (event.fromRemoteApi) {
      console.log('调远程 api 生成未限制数量的小程序码')
      let accessToken = await getAccessToken()
      const resp = await got.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page: event.page,
          scene: event.scene,
          width: event.width ? event.width : 430,
          auto_color: event.auto_color ? event.auto_color : false,
          line_color: event.line_color ? event.line_color : {
            r: 0,
            g: 0,
            b: 0
          },
          is_hyaline: event.is_hyaline ? event.is_hyaline : false
        }),
        responseType: 'buffer',
        encoding: null // 默认为 utf8，设置为 null 时才会返回 buffer
      })
      fileContent = resp.body
    } else {
      console.log('调小程序云 api 生成未限制数量的小程序码')
      const codeContentResult = await cloud.openapi.wxacode.getUnlimited({
        page: event.page,
        scene: event.scene,
        width: event.width ? event.width : 430,
        auto_color: event.auto_color ? event.auto_color : false,
        line_color: event.line_color ? event.line_color : {
          r: 0,
          g: 0,
          b: 0
        },
        is_hyaline: event.is_hyaline ? event.is_hyaline : false
      })
      // contentType、buffer
      fileContent = codeContentResult.buffer
    }

    const uploadResult = await cloud.uploadFile({
      cloudPath: 'code/' + new Date().getTime() + '.jpeg',
      fileContent: fileContent
    })

    ctx.body = {
      code: 0,
      data: uploadResult.fileID
    }
  } catch (err) {
    console.error('生成未限制数量的小程序码失败', err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg ? err.errMsg : err.message
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

  app.router('generateLimitQRCode', generateLimitQRCode)
  app.router('generateLimitCode', generateLimitCode)
  app.router('generateUnlimitCode', generateUnlimitCode)

  return app.serve()
}
