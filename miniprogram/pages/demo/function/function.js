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
  batchDelete: function() {
    wx.cloud.callFunction({
      name: 'batchDelete'
    }).then(res => {
      // res.result.stats.removed
      console.log('批量删除成功', res)
    }).catch(err => {
      console.log('批量删除失败', err)
    })
  },
  generateCode: function() {
    wx.cloud.callFunction({
      name: 'generateCode'
    }).then(res => {
      console.log('生成未限制小程序码成功', res)
      this.setData({
        fileID: res.result.fileID
      })
    }).catch(err => {
      console.log('生成未限制小程序码失败', err)
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
      name: "router",
      data: {
        $url: "user",
        other: "请求user"
      }
    }).then(res => {
      console.log('user结果', res)
    }).catch(err => {
      console.error('user错误', err)
    })
  },
  callTimer: function() {
    wx.cloud.callFunction({
      name: "router",
      data: {
        $url: "timer",
        other: "请求timer"
      }
    }).then(res => {
      console.log('timer结果', res)
    }).catch(err => {
      console.error('timer错误', err)
    })
  },
  callSingle: function () {
    wx.cloud.callFunction({
      name: "router",
      data: {
        $url: "single",
        other: "请求single"
      }
    }).then(res => {
      console.log('single结果', res)
    }).catch(err => {
      console.error('single错误', err)
    })
  }
})