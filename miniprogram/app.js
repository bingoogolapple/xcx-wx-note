//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 云开发环境 ID
        env: 'clinic-dev-gyarq',
        traceUser: true,
      })
    }
    this.globalData.userInfo = wx.getStorageSync('userInfo')
    console.log('userInfo')
  },
  showToast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  },
  showLoading(msg, mask = true) {
    wx.showLoading({
      title: msg,
      mask: mask
    })
  },
  login(userInfo) {
    wx.setStorageSync('userInfo', userInfo)
  },
  logout() {
    wx.setStorageSync('userInfo', null)
    // wx.redirectTo({
    //   url: 'pages/demo/base/base'
    // })
  },
  isNotLogin() {
    if (this.globalData.userInfo != null) {
      return false
    }

    wx.redirectTo({
      url: 'pages/demo/base/base'
    })
    return true
  },
  globalData: {
    userInfo: null
  }
})