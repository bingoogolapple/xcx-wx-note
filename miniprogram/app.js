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
    userInfo: null
  },
  locationToClinic() {
    this.showLoading('加载中...')
    wx.cloud.database().collection('clinic').limit(1).get().then(res => {
      wx.hideLoading()
      console.log('加载诊所信息成功', res)
      if (res.data.length > 0) {
        let location = res.data[0].location
        // https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html
        wx.openLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          name: location.name,
          address: location.address
        })
      } else {
        this.showToast('完善中...')
      }
    }).catch(err => {
      wx.hideLoading()
      this.showToast('加载诊所信息失败')
      console.error('加载诊所信息失败', err)
    })
  }
})