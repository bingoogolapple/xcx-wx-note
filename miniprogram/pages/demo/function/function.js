// miniprogram/pages/demo/cloud/cloud.js

Page({
  data: {
    fileID: ''
  },
  sum: function() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        a: 1,
        b: 2
      }
    }).then(res => {
      // res.result.sum
      console.log('成功', res)
    }).catch(err => {
      console.log('失败', err)
    })
  },
  callUser: function() {
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'user',
        other: '请求user'
      }
    }).then(res => {
      console.log('user结果', res)
    }).catch(err => {
      console.error('user错误', err)
    })
  },
  callTimer: function() {
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'timer',
        other: '请求timer'
      }
    }).then(res => {
      console.log('timer结果', res)
    }).catch(err => {
      console.error('timer错误', err)
    })
  },
  callSingle: function() {
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'single',
        other: '请求single'
      }
    }).then(res => {
      console.log('single结果', res)
    }).catch(err => {
      console.error('single错误', err)
    })
  },
  cloudFunctionCallCloudFunction: function() {
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'cloudFunctionCallCloudFunction',
        a: 1,
        b: 2
      }
    }).then(res => {
      console.log('cloudFunctionCallCloudFunction结果', res)
    }).catch(err => {
      console.error('cloudFunctionCallCloudFunction错误', err)
    })
  },
  cloudFunctionCallFunction: function() {
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'cloudFunctionCallFunction',
        a: 1,
        b: 2
      }
    }).then(res => {
      console.log('cloudFunctionCallFunction结果', res)
    }).catch(err => {
      console.error('cloudFunctionCallFunction错误', err)
    })
  },
  callIndependent: function() {
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'independent',
        a: 1,
        b: 2
      }
    }).then(res => {
      console.log('callIndependent结果', res)
    }).catch(err => {
      console.error('callIndependent错误', err)
    })
  },
  callIndependentFile: function() {
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'independentFile',
        a: 1,
        b: 2
      }
    }).then(res => {
      console.log('callIndependentFile结果', res)
    }).catch(err => {
      console.error('callIndependentFile错误', err)
    })
  },
  generateLimitQRCode: function() {
    wx.cloud.callFunction({
      name: 'tools',
      data: {
        $url: 'generateLimitQRCode',
        path: 'pages/demo/file/photo/photo?id=da51bd8c5e3256b507b87bed7a6e2fdb',
        fromRemoteApi: false,
        width: 800
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('生成限制数量的小程序二维码成功', res)
        this.setData({
          fileID: res.result.data
        })
      } else {
        console.log('生成限制数量的小程序二维码失败', res)
      }
    }).catch(err => {
      console.log('生成限制数量的小程序二维码失败', err)
    })
  },
  generateLimitCode: function() {
    wx.cloud.callFunction({
      name: 'tools',
      data: {
        $url: 'generateLimitCode',
        path: 'pages/demo/file/photo/photo?id=da51bd8c5e3256b507b87bed7a6e2fdb',
        fromRemoteApi: false,
        width: 430,
        auto_color: false,
        line_color: {
          r: 0,
          g: 0,
          b: 0
        },
        is_hyaline: false
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('生成限制数量的小程序码成功', res)
        this.setData({
          fileID: res.result.data
        })
      } else {
        console.log('生成限制数量的小程序码失败', res)
      }
    }).catch(err => {
      console.log('生成限制数量的小程序码失败', err)
    })
  },
  generateUnlimitCode: function() {
    wx.cloud.callFunction({
      name: 'tools',
      data: {
        $url: 'generateUnlimitCode',
        page: 'pages/demo/file/photo/photo',
        scene: 'id=da51bd8c5',
        fromRemoteApi: false
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('生成未限制数量的小程序码成功', res)
        this.setData({
          fileID: res.result.data
        })
      } else {
        console.log('生成未限制数量的小程序码失败', res)
      }
    }).catch(err => {
      console.log('生成未限制数量的小程序码失败', err)
    })
  },
  msgSecCheck: function() {
    wx.cloud.callFunction({
      name: 'tools',
      data: {
        $url: 'msgSecCheck',
        content: '特3456书yuuo莞6543李zxcz蒜7782法fgnv级'
        // content: '测试'
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('检测通过', res)
      } else {
        console.error('内容不合法', res)
      }
    }).catch(err => {
      console.error('云函数调用失败', err)
    })
  },
  imgSecCheck: function() {
    wx.cloud.callFunction({
      name: 'tools',
      data: {
        $url: 'imgSecCheck',
        fileID: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png'
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('检测通过', res)
      } else {
        console.error('内容不合法', res)
      }
    }).catch(err => {
      console.log('云函数调用失败', err)
    })
  },
  sendTemplateMsg: function() {
    let tmpId = '12ofvxc8EnDub9dWT_XeJa878tPir3rlvGE2Wo2DENk'
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
    wx.requestSubscribeMessage({
      tmplIds: [tmpId],
      success: res => {
        // {12ofvxc8EnDub9dWT_XeJa878tPir3rlvGE2Wo2DENk: "accept", errMsg: "requestSubscribeMessage:ok", errCode: 0}
        // {12ofvxc8EnDub9dWT_XeJa878tPir3rlvGE2Wo2DENk: "reject", errMsg: "requestSubscribeMessage:ok", errCode: 0}
        console.log('拿到请求订阅结果', res)
        if (res[tmpId] === 'accept') {
          console.log('允许订阅')
          this.performSendTemplateMsg(tmpId)
        } else {
          console.log('取消订阅')
        }
      },
      fail: err => {
        console.log('请求订阅失败', err)
      }
    })
  },
  performSendTemplateMsg(tmpId) {
    wx.cloud.callFunction({
      name: 'tools',
      data: {
        $url: 'sendTemplateMsg',
        touser: 'oSUQd0bZ3qQONC7Yytp2LtnSFmog',
        page: 'pages/demo/function/function',
        data: {
          thing1: {
            value: '我是任务标题'
          },
          time3: {
            value: '2019年10月1日 15:01'
          },
          phrase5: {
            value: '未开始'
          },
          thing2: {
            value: '我是任务描述'
          }
        },
        templateId: tmpId
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('发送成功', res)
      } else {
        console.error('发送失败', res)
      }
    }).catch(err => {
      console.log('发送失败', err)
    })
  },
  gotGet() {
    wx.cloud.callFunction({
      name: 'httpRequest',
      data: {
        $url: 'gotGet'
      }
    }).then(res => {
      console.log('gotGet成功', res)
    }).catch(err => {
      console.error('gotGet失败', err)
    })
  },
  gotPost() {
    wx.cloud.callFunction({
      name: 'httpRequest',
      data: {
        $url: 'gotPost'
      }
    }).then(res => {
      console.log('gotPost成功', res)
    }).catch(err => {
      console.error('gotPost失败', err)
    })
  },
  rpGet() {
    wx.cloud.callFunction({
      name: 'httpRequest',
      data: {
        $url: 'rpGet'
      }
    }).then(res => {
      console.log('rpGet成功', res)
    }).catch(err => {
      console.error('rpGet失败', err)
    })
  },
  rpPost() {
    wx.cloud.callFunction({
      name: 'httpRequest',
      data: {
        $url: 'rpPost'
      }
    }).then(res => {
      console.log('rpPost成功', res)
    }).catch(err => {
      console.error('rpPost失败', err)
    })
  }
})