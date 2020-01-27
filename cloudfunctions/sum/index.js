// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  /*
  客户端调用时 wxContext 为 {
    CLIENTIP: '10.12.23.71',
    CLIENTIPV6: '::ffff:10.12.23.71',
    APPID: 'wx06837deceb077b5a',
    OPENID: 'oSUQd0bZ3qQONC7Yytp2LtnSFmog',
    ENV: 'clinic-dev-gyarq',
    SOURCE: 'wx_devtools'
  }
  客户端调用时 event 为 { 
    a: 1,
    b: 2,
    userInfo:{
      appId: 'wx06837deceb077b5a',
      openId: 'oSUQd0bZ3qQONC7Yytp2LtnSFmog'
    }
  }

  云函数调用云函数时 wxContext 中没有 OPENID {
    APPID: 'wx06837deceb077b5a',
    ENV: 'clinic-dev-gyarq',
    SOURCE: 'wx_devtools,scf'
  }
  云函数调用云函数时 event 为 {
    a: 1,
    b: 2,
    userInfo: {
      appId: 'wx06837deceb077b5a'
    }
  } event.userInfo 中没有 openId，可以在上游将整个 event 作为参数或单独传递 userInfo 参数

  云端测试时 wxContext 为 {}
  云端测试时 event 为 {
    a: 1,
    b: 2
  }
  */
  console.log('event', event)
  console.log('wxContext', wxContext)

  // return {
  //   sum: event.a + event.b,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID
  // }

  return {
    sum: event.a + event.b,
    openid: event.userInfo.openId,
    appid: event.userInfo.appId
  }
}