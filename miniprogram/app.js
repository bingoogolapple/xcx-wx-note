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
  },
  checkNotLogin() {
    if (this.globalData.userInfo != null) {
      return false
    }

    // wx.redirectTo({
    //   url: '/pages/profile/profile'
    // })

    wx.switchTab({
      url: '/pages/profile/profile'
    })
    return true
  },
  globalData: {
    userInfo: null,
    clinic: null
  },
  locationToClinic() {
    if (this.globalData.clinic.location == null) {
      app.showToast('完善中...')
      return
    }

    let location = this.globalData.clinic.location
    // https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      address: location.address
    })
  }
})