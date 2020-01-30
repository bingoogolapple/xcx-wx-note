const db = wx.cloud.database()
const userInfos = db.collection('userInfos')
const photos = db.collection('photos')

Page({
  data: {
    userInfo: null,
    photos: null
  },
  pageData: {
    openid: null
  },
  onLoad: function(options) {
    this.pageData.openid = options.openid
    this.loadUserInfo()
    this.loadPhotos()
  },
  loadUserInfo: function() {
    userInfos.where({
      _openid: this.pageData.openid
    }).get().then(res => {
      console.log('加载用户信息成功', res)
      this.setData({
        userInfo: res.data[0]
      })
    }).catch(err => {
      console.error('加载用户信息失败', err)
    })
  },
  loadPhotos: function() {
    photos.where({
      _openid: this.pageData.openid
    }).get().then(res => {
      console.log('加载图片列表成功', res)
      this.setData({
        photos: res.data
      })
    }).catch(err => {
      console.error('加载图片列表失败', err)
    })
  },
  openPhotoDetail: function(event) {
    let id = event.target.dataset.id
    wx.navigateTo({
      url: `../photo/photo?id=${id}`,
      events: {
        refreshPhotos: data => {
          console.log('刷新图片列表', data)
          this.loadPhotos()
        }
      }
    })
  }
})