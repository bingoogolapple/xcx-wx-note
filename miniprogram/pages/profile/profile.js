const db = wx.cloud.database()
const userInfos = db.collection('userInfos')
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onGetUserInfo(event) {
    if (event.detail.userInfo) {
      console.log('用户允许登录', event.detail.userInfo)

      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'userInfos',
        data: {
          $url: 'login',
          user: event.detail.userInfo
        }
      }).then(res => {
        wx.hideLoading()
        if (res.result.code == 0) {
          console.log('登录成功', res)
          this.setData({
            userInfo: res.result.data
          })
          app.login(res.result.data)
        } else {
          console.error('登录失败', res.result.errMsg)
        }
      }).catch(err => {
        wx.hideLoading()
        console.error('异常：登录失败', err)
      })
    } else {
      console.error('用户拒绝登录', event)
    }
  },
  logout() {
    this.setData({
      userInfo: null
    })
    app.logout()
  }
})