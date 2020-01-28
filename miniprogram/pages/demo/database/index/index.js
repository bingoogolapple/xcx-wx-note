// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
const db = wx.cloud.database()
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
const products = db.collection('products')

Page({
  data: {
    products: null
  },
  onLoad: function(options) {
    this.localLoadProducts()
  },
  localLoadProducts: function() {
    products.get().then(res => {
      console.log('小程序端加载产品列表成功', res)
      this.setData({
        products: res.data
      })
    }).catch(err => {
      console.error('小程序端加载产品列表失败', err)
    })
  },
  cloudLoadProducts: function() {
    wx.cloud.callFunction({
        name: "database",
        data: {
          $url: "loadProducts"
        }
      }).then(res => {
        if (res.result.code == 0) {
          console.log('小程序云端加载产品列表成功', res.result.data)
          this.setData({
            products: res.result.data
          })
        } else {
          console.error('小程序云端加载产品列表失败', res.result.errMsg)
        }
      })
      .catch(err => {
        console.error('小程序云端加载产品列表失败', err)
      })
  }
})