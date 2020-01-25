// miniprogram/pages/movie/detail/detail.js
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    bg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579762336222&di=6f522bf81031671db687628274f7be1c&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F21%2F09%2F01200000026352136359091694357.jpg',
    username: '',
    password: '',
    images: [],
    fileIds: []
  },
  onClickIcon: function() {
    console.log('点击问号')
  },
  onChange: function(event) {
    console.log(event.detail)
    this.setData({
      username: event.detail
    })
  },
  chooseImage: function() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = res.tempFilePaths
        console.log(images)
        this.setData({
          images: images
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  uploadImage: function() {
    let promiseArr = [];
    for (let i = 0; i< this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i]
        console.log(item)
        let suffix = /\.\w+$/.exec(item)[0]
        console.log(suffix)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: item,
          success: res => {
            console.log(res)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            })
            reslove(item)
          },
          fail: err => {
            console.log(err)
            reject(err)
          }
        })
      }))
    }
    wx.showLoading({
      title: '提交中...',
    })
    Promise.all(promiseArr).then(res => {
      console.log(res)
      db.collection('comment').add({
        data: {
          content: '评论内容',
          score: 4,
          images: this.data.fileIds
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '成功',
          })
          console.log("添加成功", res)
        },
        fail: err => {
          wx.hideLoading()
          console.logor("添加失败", err)
        }
      })
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('参数', options)
    this.setData({
      title: options.title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})