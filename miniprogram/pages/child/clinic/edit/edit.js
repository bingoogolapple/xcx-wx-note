const db = wx.cloud.database()
const clinicCollection = db.collection('clinic')
const app = getApp()

Page({
  data: {
    clinic: {
      image: '/images/empty-box.png',
      intro: '',
      location: null,
      locationDesc: ''
    },
    showRequestPermissionDialog: false,
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
  chooseImage() {
    console.log('选择图片')
  },
  showNoPermission: function() {
    app.showToast('未开启位置权限，无法设置诊所位置')
  },
  chooseClinicLocation: function() {
    // https: //developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userLocation'] == true) {
          // 为 true 表示已授权
          this.performChooseLocation()
        } else if (res.authSetting['scope.userLocation'] == false) {
          // 为 false 表示请求过权限，但未授权，需要打开设置页面授权
          this.setData({
            showRequestPermissionDialog: true
          })
        } else {
          // 为 null 表示还未请求过授权，直接调用时会弹出授权对话框
          this.performChooseLocation()
        }
      }
    })
  },
  handleRequestPermissionResult: function(event) {
    console.log('从设置页面返回', event)
    if (event.detail.authSetting['scope.userLocation']) {
      this.performChooseLocation()
    } else {
      this.showNoPermission()
    }
  },
  requestPermission() {
    this.setData({
      showRequestPermissionDialog: false
    })

    // 不要包裹到其他异步操作的回调里，否则打开设置页面会报错【openSetting:fail can only be invoked by user TAP gesture.】
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html
    wx.openSetting({
      success: res => {
        console.log('打开设置成功', res)
        if (res.authSetting['scope.userLocation']) {
          this.performChooseLocation()
        } else {
          this.showNoPermission()
        }
      },
      fail: (err) => {
        console.error('打开设置失败', err)
        this.showNoPermission()
      }
    })
  },
  performChooseLocation: function() {
    // 没申请过权限时会弹权限申请对话框
    // https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html
    wx.chooseLocation({
      success: res => {
        console.log('选择位置成功', res)
        this.data.clinic.location = {
          latitude: res.latitude,
          longitude: res.longitude,
          name: res.name,
          address: res.address
        }
        this.data.clinic.locationDesc = `${res.address}(${res.name})`
        this.setData({
          clinic: this.data.clinic,
        })
      },
      fail: err => {
        app.showToast('选择位置失败')
        if (err.errMsg.indexOf('auth deny') != -1) {
          console.log('选择位置失败，用户未同意位置权限', err)
        } else if (err.errMsg.indexOf('cancel') != -1) {
          console.error('选择位置失败，用户取消选择', err)
        } else {
          console.error('选择位置失败', err)
        }
      }
    })
  },
  onIntroChanged(event) {
    this.data.clinic.intro = event.detail.trim()
  },
  submit() {
    let clinic = this.data.clinic
    if (clinic.location == null) {
      app.showToast('请选择诊所位置')
      return
    }
    if (clinic.intro.length == 0) {
      app.showToast('请填写诊所简介')
      return
    }

    app.showLoading('提交中...')
    wx.cloud.callFunction({
      name: 'clinic',
      data: {
        $url: "addOrUpdateClinic",
        clinic: clinic
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.code == 0) {
        console.log('设置成功', res)
        wx.navigateBack({})
      } else {
        console.error('设置失败', res)
        app.showToast('设置失败')
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('设置失败', err)
      app.showToast('设置失败')
    })
  }
})