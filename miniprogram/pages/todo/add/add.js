const db = wx.cloud.database()

Page({
  data: {

  },
  onClickSubmit: function(event) {
    console.log('点击提交', event)
    wx.showLoading({
      title: '提交中...',
    })
    let title = event.detail.value.title
    db.collection('todo').add({
      data: {
        title: title,
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '添加成功'
        })
        wx.navigateBack({})
      },
      fail: err => {
        wx.hideLoading()
      }
    })
  }
})