// miniprogram/pages/demo/cloud/cloud.js

Page({
  data: {
    result: ''
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
  }
})