// miniprogram/pages/movie/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    movieList: []
  },
  movieList: function(page) {
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: 'httpRequest',
      data: {
        $url: 'movieList',
        page: page
      }
    }).then(res => {
      wx.hideLoading()
      console.log('成功', res)
      this.setData({
        page: page,
        movieList: this.data.movieList.concat(res.result.data.datas)
      })
    }).catch(err => {
      wx.hideLoading()
      console.log('失败', err)
    })
  },
  goDetail: function(event) {
    let title = event.target.dataset.title
    console.log(event)
    wx.navigateTo({
      url: `../detail/detail?title=${title}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.movieList(0)
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
    this.movieList(this.data.page + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})