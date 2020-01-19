// miniprogram/pages/demo/base/base.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: 'HelloWorld',
    img: '/images/base-selected.png',
    aar: ['a', 'b', 'c', 'd'],
    list: [{
        name: 'BGA',
        age: 18
      },
      {
        name: 'bingoogolapple',
        age: 19
      },
      {
        name: 'bingo',
        age: 20
      },
      {
        name: 'googol',
        age: 21
      },
      {
        name: 'apple',
        age: 22
      },
    ],
    isLogin: true,
    count: 0
  },
  onClickIncrease: function(e) {
    console.log("onClickIncrease", e)
    this.setData({
      count: this.data.count + 1
    })
  },
  onClickBox:function(e) {
    console.log("onClickBox", e)
    console.log(e.target.dataset.id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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