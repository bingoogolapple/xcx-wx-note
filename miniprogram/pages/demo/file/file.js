const db = wx.cloud.database()
const userInfos = db.collection('userInfos')

Page({
  data: {
    userInfos: null
  },
  onLoad: function(options) {
    this.loadUserInfos()
  },
  loadUserInfos: function() {
    userInfos.get().then(res => {
      console.log('获取用户列表成功', res)
      this.setData({
        userInfos: res.data
      })
    }).catch(err => {
      console.error('获取用户列表失败', err)
    })
  },
  onGetUserInfo: function(event) {
    if (event.detail.userInfo) {
      console.log('用户允许登录', event.detail.userInfo)

      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'file',
        data: {
          $url: 'login',
          user: event.detail.userInfo
        }
      }).then(res => {
        wx.hideLoading()
        if (res.result.code == 0) {
          console.log('登录成功', res)
          wx.navigateTo({
            url: './add/add'
          })
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
  }
})