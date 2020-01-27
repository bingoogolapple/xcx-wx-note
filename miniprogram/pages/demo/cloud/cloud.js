// miniprogram/pages/demo/cloud/cloud.js

Page({
  data: {
    fileID: '',
    result: ''
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
  scanCode: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/device/scan/wx.scanCode.html
    wx.scanCode({
      // onlyFromCamera: false,
      // scanType: ['barCode', 'qrCode'],
      success: res => {
        // {charSet: "utf-8", result: "是的法师打发", errMsg: "scanCode:ok", rawData: "77u/5piv55qE5rOV5biI5omT5Y+R", scanType: "QR_CODE"}
        console.log('扫码成功', res)
        this.setData({
          result: res.result
        })
      },
      fail: err => {
        if (err.errMsg.indexOf('cancel') != -1) {
          console.log("取消扫码")
        } else {
          console.error('扫码失败', err)
        }
      }
    })
  },
  onShareAppMessage: function() {
    return {
      title: '测试标题',
      path: 'pages/todo/detail/detail?id=d68532785e2d200205e910614503b839',
      imageUrl: 'https://636c-clinic-dev-gyarq-1301144683.tcb.qcloud.la/code/1580051206024.jpeg?sign=4372b31ea1728b7ee21e5cd3320212fb&t=1580057434'
    }
  }
})