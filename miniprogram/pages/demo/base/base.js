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
  onClickBox: function(e) {
    console.log("onClickBox", e)
    console.log(e.target.dataset.id)
  },
  copy: function() {
    wx.setClipboardData({
      data: '我是复制的内容',
      success: res => {
        console.log('复制成功', res)
        wx.getClipboardData({
          success: res => {
            console.log('黏贴成功', res)
            console.log(res.data)
          }
        })
      }
    })
  },
  updateTabBarBadge: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarBadge.html
    wx.setTabBarBadge({
      index: 2,
      text: '11'
    })
  },
  updateTabBarStyle: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarStyle.html
    wx.setTabBarStyle({
      backgroundColor: '#0000FF'
    })
  },
  chooseAddress: function() {
    // 需要先申请权限 https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html
    wx.chooseAddress({
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  handleContact(e) {
    console.log(e)
  },
  bindload(e) {
    console.log('bindload', e)
  },
  binderror(e) {
    console.log('binderror', e)
  }
})