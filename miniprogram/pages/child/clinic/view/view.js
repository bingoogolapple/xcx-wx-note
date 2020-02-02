const db = wx.cloud.database()
const clinicCollection = db.collection('clinic')
const app = getApp()

Page({
  data: {
    clinic: {
      image: '/images/empty-box.png',
      intro: '完善中...',
      location: null,
      locationDesc: '完善中...'
    }
  },
  onLoad(options) {
    this.loadClinic()
  },
  loadClinic() {
    app.showLoading('加载中...')
    clinicCollection.limit(1).get().then(res => {
      wx.hideLoading()
      console.log('加载诊所信息成功', res)
      if (res.data.length > 0) {
        this.setData({
          clinic: res.data[0]
        })
      }
    }).catch(err => {
      wx.hideLoading()
      app.showToast('加载诊所信息失败')
      console.error('加载诊所信息失败', err)
    })
  },
  locationToClinic() {
    app.locationToClinic()
  }
})