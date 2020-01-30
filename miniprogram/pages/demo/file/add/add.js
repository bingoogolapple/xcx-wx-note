const db = wx.cloud.database()
const photos = db.collection('photos')

Page({
  data: {
    imagePath: null,
    fileID: null
  },
  chooseImage: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
    wx.chooseImage({
      count: 1, // 默认值 9
      sizeType: ['original'], // 默认值 ['original', 'compressed']
      sourceType: ['album', 'camera'], // 默认值 ['album', 'camera']
      success: res => {
        console.log('选择图片或拍照成功', res)
        wx.showLoading({
          title: '上传中...'
        })
        const imagePath = res.tempFilePaths[0]
        if (imagePath === this.data.imagePath && this.data.fileID) {
          console.log('与之前的图片相同且已上传，直接添加到数据库')
          this.addPhoto(this.data.fileID)
        } else {
          console.log('与之前的图片不相同或没有上传，上传')
          this.setData({
            imagePath: imagePath
          })
          this.uploadImage(imagePath)
        }

        /*
        original & compressed 同时设置了原图和压缩时，如果选择的图片比较大则返回的是压缩图片
        tempFilePaths "wxfile://tmp_08484d422d6a2d2a595ce29fc8a1b6aa15068ca20e0676bd.jpg"
        tempFiles     "wxfile://tmp_08484d422d6a2d2a595ce29fc8a1b6aa15068ca20e0676bd.jpg"
        size          205331   41075

        compressed
        tempFilePaths "wxfile://tmp_4835202d3636a23d1688214cd19a1066acdedcaaf0aa8c06.jpg"
        tempFiles     "wxfile://tmp_4835202d3636a23d1688214cd19a1066acdedcaaf0aa8c06.jpg"
        size          205331   41075

        original
        tempFilePaths "wxfile://tmp_6d615ffdc3636e11d362c82aab9c0a5c22df968958f87f74.jpg"
        tempFiles     "wxfile://tmp_6d615ffdc3636e11d362c82aab9c0a5c22df968958f87f74.jpg"
        size          352828   41075
        */
      },
      fail: err => {
        // {errMsg: "chooseImage:fail cancel"}
        console.log('选择图片或拍照失败', err)
      }
    })
  },
  uploadImage: function(imagePath) {
    let suffix = /\.\w+$/.exec(imagePath)[0]
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/uploadFile/client.uploadFile.html
    wx.cloud.uploadFile({
      cloudPath: `photos/${new Date().getTime()}_${Math.floor(Math.random() * 10000)}${suffix}`,
      filePath: imagePath
    }).then(res => {
      // {errMsg: "cloud.uploadFile:ok", fileID: "cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/file/1580352504634.png", statusCode: 200}
      console.log('上传成功', res)
      let fileID = res.fileID
      this.setData({
        fileID: fileID
      })
      this.addPhoto(fileID)
    }).catch(err => {
      wx.hideLoading()
      if (err.errMsg.indexOf('ENOTFOUND') !== -1) {
        console.error('上传失败', '网络连接失败')
      } else {
        console.error('上传失败', err.errMsg)
      }
      this.setData({
        fileID: null
      })
    })
  },
  addPhoto: function(fileID) {
    photos.add({
      data: {
        image: fileID
      }
    }).then(res => {
      wx.hideLoading()
      // {_id: "0ec685215e324b6107b3665938904f5b", errMsg: "collection.add:ok"}
      console.log('添加图片成功', res)
      wx.navigateBack({})
    }).catch(err => {
      wx.hideLoading()
      console.error('添加图片失败', err)
    })
  }
})