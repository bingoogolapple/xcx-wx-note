// miniprogram/pages/demo/file/file.js
Page({
  data: {
    avatorUrl: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png'
  },
  upload: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath 可以作为 img 标签的 src 属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        const avatorUrl = tempFilePaths[0]
        this.setData({
          avatorUrl: avatorUrl
        })
        this.performUpload(avatorUrl)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  performUpload: function(avatorUrl) {
    wx.cloud.uploadFile({
      cloudPath: 'demo/avator1.png',
      filePath: avatorUrl,
      formData: {
        'key1': 'value1'
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  download: function() {
    wx.cloud.downloadFile({
      fileID: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/demo/avator.png'
    }).then(res => {
      console.log(res)
      this.setData({
        avatorUrl: res.tempFilePath
      })

      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          console.log('保存成功', res)
          wx.showToast({
            title: '保存成功'
          })
        },
        fail(err) {
          console.log('保存失败', err)
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  getTempFileUrl: function() {
    wx.cloud.getTempFileURL({
        fileList: [
          'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/demo/avator.png',
          'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/demo/avator1.png'
        ]
      })
      .then(res => console.log(res))
      .catch(err => console.error(res))
  },
  deleteFile: function() {
    wx.cloud.deleteFile({
      fileList: ['cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757975128.jpg']
    })
    .then(console.log)
    .catch(console.error)
  },
  onShareAppMessage: function () {
    return {
      title: '测试标题',
      path: 'pages/demo/database/info/info',
      query: 'id=74b140b45e2d25aa05ea5d1b385fd88f',
      // imageUrl: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png' // 图片地址 或 fileID 都可以
      imageUrl: 'http://bgashare.bingoogolapple.cn/adapter/imgs/8.png' // 图片地址 或 fileID 都可以
    }
  }
})