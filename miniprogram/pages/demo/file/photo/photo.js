const db = wx.cloud.database()
const photos = db.collection('photos')

import Dialog from '@vant/weapp/dialog/dialog'

Page({
  data: {
    photo: {},
    showRequestPermissionDialog: false,
    params: null
  },
  pageData: {
    id: null,
    tempFilePath: null
  },
  onLoad: function(options) {
    this.setData({
      params: JSON.stringify(options)
    })
    this.pageData.id = options.id
    this.loadPhoto()
  },
  loadPhoto: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    photos.doc(this.pageData.id).get().then(res => {
      wx.hideLoading()
      console.log('加载图片信息成功', res)
      this.setData({
        photo: res.data
      })
    }).catch(err => {
      wx.hideLoading()
      if (err.errCode == -1) {
        console.error('加载图片信息失败，不存在该记录', err)
        wx.showToast({
          title: '不存在该图片',
          icon: 'none',
          complete: () => {
            wx.redirectTo({
              url: '/pages/demo/file/file'
            })
          }
        })
      } else {
        console.error('加载图片信息失败', err)
      }
    })
  },
  showWaitTip: function() {
    wx.showToast({
      title: '未获取到图片，请稍后再试',
      icon: 'none'
    })
  },
  downloadImage: function() {
    if (!this.data.photo.image) {
      this.showWaitTip()
      return
    }

    if (this.pageData.tempFilePath) {
      console.log('已下载过，直接保存到相册')
      this.saveImageToPhotosAlbum()
      return
    }
    wx.showLoading({
      title: '下载中...',
      mask: true
    })
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/downloadFile/client.downloadFile.html
    wx.cloud.downloadFile({
      fileID: this.data.photo.image
    }).then(res => {
      wx.hideLoading()
      // res.tempFilePath
      console.log('下载图片成功', res)
      this.pageData.tempFilePath = res.tempFilePath
      this.saveImageToPhotosAlbum()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '下载失败',
        icon: 'none'
      })
      console.error('下载图片失败', err)
    })
  },
  showNoPermission: function() {
    wx.showToast({
      title: '未开启保存到相册权限，无法保存图片',
      icon: 'none'
    })
  },
  saveImageToPhotosAlbum: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum'] == true) {
          // 为 true 表示已授权
          this.performSaveImageToPhotosAlbum()
        } else if (res.authSetting['scope.writePhotosAlbum'] == false) {
          // 为 false 表示请求过权限，但未授权，需要打开设置页面授权
          this.setData({
            showRequestPermissionDialog: true
          })
        } else {
          // 为 null 表示还未请求过授权，直接调用时会弹出授权对话框
          this.performSaveImageToPhotosAlbum()
        }
      }
    })
  },
  handleRequestPermissionResult: function(event) {
    console.log('从设置页面返回', event)
    if (event.detail.authSetting['scope.writePhotosAlbum']) {
      this.performSaveImageToPhotosAlbum()
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
        if (res.authSetting['scope.writePhotosAlbum']) {
          this.performSaveImageToPhotosAlbum()
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
  performSaveImageToPhotosAlbum: function() {
    // 没申请过权限时会弹权限申请对话框
    // https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
    wx.saveImageToPhotosAlbum({
      filePath: this.pageData.tempFilePath,
      success(res) {
        console.log('保存图片成功', res)
        wx.showToast({
          title: '保存图片成功'
        })
      },
      fail(err) {
        wx.showToast({
          title: '保存图片失败',
          icon: 'none'
        })

        if (err.errMsg.indexOf('auth deny') != -1) {
          console.log('保存图片失败，用户未同意保存图片到相册', err)
        } else if (err.errMsg.indexOf('cancel')) {
          console.error('保存图片失败，用户取消保存', err)
        } else {
          console.error('保存图片失败', err)
        }
      }
    })
  },
  getImageUrl: function() {
    if (!this.data.photo.image) {
      this.showWaitTip()
      return
    }
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/Cloud.getTempFileURL.html
    wx.cloud.getTempFileURL({
      fileList: [
        this.data.photo.image
      ]
    }).then(res => {
      // 有效时间只有一天
      // res.fileList[0] {fileID: "cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/photos/1580354764994_7058.png", tempFileURL: "https://636c-clinic-dev-gyarq-1301144683.tcb.qcloud.la/photos/1580354764994_7058.png", maxAge: 86400, status: 0, errMsg: "ok"}
      console.log('获取图片地址成功', res)

      wx.setClipboardData({
        data: res.fileList[0].tempFileURL,
        success: res => {
          console.log('复制成功', res)
        }
      })
    }).catch(err => {
      console.error('获取图片地址失败', err)
    })
  },
  deleteImage: function() {
    if (!this.data.photo.image) {
      this.showWaitTip()
      return
    }

    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    photos.doc(this.data.photo._id).remove().then(res => {
      console.log('从数据库删除图片成功', res)
      wx.hideLoading()

      const eventChannel = this.getOpenerEventChannel()
      if (eventChannel.emit) {
        // 要判断一下，因为当前页面在栈底时 eventChannel 为 {}
        eventChannel.emit('refreshPhotos', {})
        // 当前页面在栈底时会回退失败
        wx.navigateBack({})
      }

      wx.cloud.deleteFile({
        fileList: [this.data.photo.image]
      }).then(res => {
        console.log('从云存储删除图片成功', res)
      }).catch(err => {
        console.error('从云存储删除图片失败', err)
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
      console.error('从数据库删除图片失败', err)
    })
  },
  previewImage: function() {
    wx.previewImage({
      current: this.data.photo.image,
      urls: [this.data.photo.image]
    })
  },
  sharePyq: function() {
    console.log('分享到朋友圈')
  },
  // 什么都不返回时：没有标题、路径为当前页面的路径（包括参数）、当前页面的截图
  onShareAppMessage: function() {
    return {
      title: '测试标题',
      path: `pages/demo/file/photo/photo?id=${this.pageData.id}&user=王浩`,
      imageUrl: this.data.photo.image // 图片地址 或 fileID 都可以
    }
  }
})