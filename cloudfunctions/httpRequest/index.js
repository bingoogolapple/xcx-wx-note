const cloud = require('wx-server-sdk')
const got = require('got')

cloud.init()

exports.main = async(event, context) => {
  console.log('event', event)
  console.log('context', context)
  try {
    if (event.method === 'GET') {
      const resp = await got.get('http://httpbin.org/get', {
        json: true
      })
      console.log(resp.body)
      return resp.body
    } else {
      let resp = await got.post('http://httpbin.org/post', {
        json: true,
        body: {
          title: '标题',
          content: '内容'
        }
      })
      console.log(resp.body)
      return resp.body
    }
  } catch (err) {
    console.error('失败', err)
    return err
  }
}

// 本地测试云函数

let result = exports.main({
  method: 'GET',
  userInfo: {
    appId: 'wx06837deceb077b5a',
    openId: 'oSUQd0bZ3qQONC7Yytp2LtnSFmog'
  }
}, {
  contextKey1: 'contextValue1'
})
console.log(result)