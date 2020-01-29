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
  }
})