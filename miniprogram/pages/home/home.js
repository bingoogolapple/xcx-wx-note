const db = wx.cloud.database()
const clinicCollection = db.collection('clinic')
const app = getApp()

Page({
  data: {
    clinic: null
  },
  onClickItem() {
    app.showToast('敬请期待')
    app.checkNotLogin()
  },
  locationToClinic() {
    if (app.globalData.clinic) {
      app.locationToClinic()
    } else {
      app.showLoading('加载中...')
      clinicCollection.limit(1).get().then(res => {
        wx.hideLoading()
        console.log('加载诊所信息成功', res)
        if (res.data.length > 0) {
          app.globalData.clinic = res.data[0]
        }
        app.locationToClinic()
      }).catch(err => {
        wx.hideLoading()
        app.showToast('加载诊所信息失败')
        console.error('加载诊所信息失败', err)
      })
    }
  },
  onShareAppMessage: function() {

  }
})