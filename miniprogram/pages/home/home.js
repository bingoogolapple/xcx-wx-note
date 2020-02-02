const db = wx.cloud.database()
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
    app.locationToClinic()
  },
  onShareAppMessage: function() {}
})