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
  generateLimitQRCode: function() {
    wx.cloud.callFunction({
      name: 'generateCode',
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
      name: 'generateCode',
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
      name: 'generateCode',
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
  gotGet: function() {
    wx.cloud.callFunction({
      name: 'httpRequest',
      data: {
        method: 'GET'
      }
    }).then(res => {
      console.log('get成功', res)
    }).catch(err => {
      console.error('get失败', err)
    })
  },
  gotPost: function() {
    wx.cloud.callFunction({
      name: 'httpRequest',
      data: {
        method: 'POST'
      }
    }).then(res => {
      console.log('post成功', res)
    }).catch(err => {
      console.error('post失败', err)
    })
  },
  msgSecCheck: function() {
    wx.cloud.callFunction({
      name: 'msgSecCheck',
      data: {
        // content: '特3456书yuuo莞6543李zxcz蒜7782法fgnv级'
        content: '测试'
      }
    }).then(res => {
      if (res.result) {
        console.log('检测通过', res)
      } else {
        console.error('内容不合法', res)
      }
    }).catch(err => {
      console.log('云函数调用失败', err)
    })
  },
  imgSecCheck: function() {
    wx.cloud.callFunction({
      name: 'imgSecCheck',
      data: {
        fileID: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png'
      }
    }).then(res => {
      if (res.result) {
        console.log('检测通过', res)
      } else {
        console.error('内容不合法', res)
      }
    }).catch(err => {
      console.log('云函数调用失败', err)
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
  }
})