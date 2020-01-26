// miniprogram/pages/demo/cloud/cloud.js

Page({
  data: {
    fileID: ''
  },
  database: function() {
    wx.navigateTo({
      url: '../database/database',
    })
  },
  file: function() {
    wx.navigateTo({
      url: '../file/file',
    })
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
  }
})