const db = wx.cloud.database()

Page({
  data: {
    imageUrl: null
  },
  selectImage: function() {
    wx.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        const imageUrl = tempFilePaths[0]
        this.setData({
          imageUrl: imageUrl
        })
        // this.performUpload(imageUrl)
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  performUpload: function(title) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    let imageUrl = this.data.imageUrl
    let suffix = /\.\w+$/.exec(imageUrl)[0]
    console.log(suffix)
    wx.cloud.uploadFile({
      cloudPath: `todo/${new Date().getTime() + suffix}`,
      filePath: imageUrl
    }).then(res => {
      this.performSubmit(title, res.fileID)
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
  onClickSubmit: function(event) {
    let title = event.detail.value.title.trim()
    if (title.length === 0) {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
      return
    }

    if (this.data.imageUrl) {
      this.performUpload(title)
      return
    }
    this.performSubmit(title, null)
  },
  performSubmit: function(title, imageUrl) {
    wx.showLoading({
      title: '提交中...',
    })
    db.collection('todo').add({
      data: {
        title: title,
        image: imageUrl
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '添加成功'
        })
        wx.redirectTo({
          url: `../detail/detail?id=${res._id}`,
        })
        // wx.navigateBack({})
      },
      fail: err => {
        wx.hideLoading()
      }
    })
  }
})