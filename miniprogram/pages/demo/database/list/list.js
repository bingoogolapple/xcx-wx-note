// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
const db = wx.cloud.database()
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
const products = db.collection('products')

Page({
  data: {
    products: null
  },
  onLoad: function(options) {
    this.cloudLoadProducts()
  },
  localLoadProducts: function(loadMore = false, callback = () => {}) {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })

    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.skip.html
    // limit 在小程序端默认及最大上限为 20，在云函数端默认及最大上限为 1000 https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.limit.html
    products.skip(loadMore ? this.data.products.length : 0).limit(15).get().then(res => {
      const newProducts = res.data
      console.log('小程序端加载产品列表成功', newProducts)
      if (newProducts.length == 0) {
        wx.hideLoading()
        callback()
        if (loadMore) {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        }
      } else {
        this.setData({
          products: loadMore ? this.data.products.concat(newProducts) : newProducts
        }, () => {
          wx.hideLoading()
          callback()
        })
      }
    }).catch(err => {
      console.error('小程序端加载产品列表失败', err)
      wx.hideLoading()
      callback()
    })
  },
  cloudLoadProducts: function (loadMore = false, callback = () => { }) {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })

    wx.cloud.callFunction({
        name: "database",
        data: {
          $url: "loadProducts",
          skip: loadMore ? this.data.products.length : 0,
          limit: 15
        }
      }).then(res => {
        if (res.result.code == 0) {
          const newProducts = res.result.data
          console.log('小程序云端加载产品列表成功', newProducts)

          if (newProducts.length == 0) {
            wx.hideLoading()
            callback()
            if (loadMore) {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none'
              })
            }
          } else {
            this.setData({
              products: loadMore ? this.data.products.concat(newProducts) : newProducts
            }, () => {
              wx.hideLoading()
              callback()
            })
          }
        } else {
          console.error('小程序云端加载产品列表失败', res.result.errMsg)
          wx.hideLoading()
          callback()
        }
      })
      .catch(err => {
        console.error('小程序云端加载产品列表失败', err)
        wx.hideLoading()
        callback()
      })
  },
  // 需要在当前页面的 json 配置文件中设置 "enablePullDownRefresh": true，https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#%E9%A1%B5%E9%9D%A2%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E5%87%BD%E6%95%B0
  onPullDownRefresh: function() {
    this.cloudLoadProducts(false, () => {
      wx.stopPullDownRefresh()
    })
  },
  // onReachBottomDistance 设置页面上拉触底事件触发时距页面底部距离 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html
  onReachBottom: function() {
    this.cloudLoadProducts(true)
  }
})