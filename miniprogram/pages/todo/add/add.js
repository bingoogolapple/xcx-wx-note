const db = wx.cloud.database()

Page({
  data: {
    imageUrl: null,
    locationObj: null
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
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  chooseLocation: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userLocation']) {
          this.performChooseLocation()
        } else {
          this.requestLocationPermission()
        }
      }
    })
  },
  requestLocationPermission() {
    // 不要包裹到 Toast 或 Dialog 里，不然打开设置页面会报错【openSetting:fail can only be invoked by user TAP gesture.】
    wx.openSetting({
      success: res => {
        console.log('打开设置成功')
        if (res.authSetting['scope.userLocation']) {
          this.performChooseLocation()
        } else {
          wx.showToast({
            title: '未开启位置权限，无法选择位置',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('打开设置失败', err)
      }
    })
  },
  performChooseLocation() {
    wx.chooseLocation({
      success: res => {
        console.log(res)
        let locationObj = {
          latitude: res.latitude,
          longitude: res.longitude,
          name: res.name,
          address: res.address
        }
        this.setData({
          locationObj: locationObj
        })
      },
      fail: err => {
        this.requestLocationPermission()
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
    console.log('点击登录')
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
        image: imageUrl,
        location: this.data.locationObj
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