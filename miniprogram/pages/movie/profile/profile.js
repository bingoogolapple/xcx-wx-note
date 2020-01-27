Page({
  data: {
    userInfo: null
  },
  onShow: function() {
    wx.getSetting({
      success: settingRes => {
        if (!settingRes.authSetting['scope.userInfo']) {
          console.log('未授权，请登录', settingRes)
          this.setData({
            userInfo: null
          })
        } else if (!this.data.userInfo) {
          console.log('已授权，未获取到用户数据，获取用户数据', settingRes)
          wx.getUserInfo({
            success: userInfoRes => {
              console.log('获取用户信息成功', userInfoRes.userInfo)
              this.setData({
                userInfo: userInfoRes.userInfo
              })
            },
            fail: err => {
              console.error('获取用户信息失败', err)
              this.setData({
                userInfo: null
              })
            }
          })
        } else {
          console.log('已授权，已获取到用户数据')
        }
      }
    })
  },
  onGetUserInfo: function(event) {
    console.log(event)
    if (event.detail.userInfo) {
      console.log('用户允许登录', event.detail.userInfo)
      this.setData({
        userInfo: event.detail.userInfo
      })
    } else {
      console.error('用户拒绝登录', event)
      this.setData({
        userInfo: null
      })
    }
  },
  onGetPhoneNumber: function(event) {
    console.log(event)
  }
})