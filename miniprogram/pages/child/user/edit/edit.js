const db = wx.cloud.database()
const _ = db.command
const userInfosCollection = db.collection('userInfos')
const app = getApp()

Page({
  data: {
    userInfo: {}
  },
  onLoad: function (options) {
    this.loadUserInfo(options.id)
  },
  loadUserInfo(userId) {
    app.showLoading('加载中...')
    userInfosCollection.doc(userId).get().then(res => {
      console.error('加载用户信息成功', res.data)
      this.setData({
        userInfo: res.data
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {
      console.error('加载用户信息失败', err)
      wx.hideLoading()
    })
  }
})