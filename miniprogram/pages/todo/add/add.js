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
  requestSubscribeMessage: function() {
    let tmpId = '12ofvxc8EnDub9dWT_XeJa878tPir3rlvGE2Wo2DENk'
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
    wx.requestSubscribeMessage({
      tmplIds: [tmpId],
      success: res => {
        console.log(res)
        if (res[tmpId] === 'accept') {
          console.log('允许订阅')
          wx.cloud.callFunction({
            name: 'msgMe',
            data: {
              tmpId: tmpId,
              title: '测试标题'
            }
          }).then(res => {
            // res.result.errCode == 0
            console.log('发送成功', res)
          }).catch(err => {
            console.log('发送失败', err)
          })
        } else {
          console.log('取消订阅')
        }
      }
    })
  },
  onClickSubmit: function(event) {
    // event.detail.formId
    console.log('点击提交', event)
    // let title = event.detail.value.title.trim()
    // if (title.length === 0) {
    //   wx.showToast({
    //     title: '标题不能为空',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (this.data.imageUrl) {
    //   this.performUpload(title)
    //   return
    // }
    // this.performSubmit(title, null)
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