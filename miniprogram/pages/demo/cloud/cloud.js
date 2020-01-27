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
  onShareAppMessage: function() {
    return {
      title: '测试标题',
      path: 'pages/todo/detail/detail?id=d68532785e2d200205e910614503b839',
      imageUrl: 'https://636c-clinic-dev-gyarq-1301144683.tcb.qcloud.la/code/1580051206024.jpeg?sign=4372b31ea1728b7ee21e5cd3320212fb&t=1580057434'
    }
  }
})