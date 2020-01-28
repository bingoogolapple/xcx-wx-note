// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
const db = wx.cloud.database()
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
const products = db.collection('products')

Page({
  data: {},
  localBatchAddProduct: function() {
    this.localAddProduct(1)
  },
  localAddProduct: function(titleIndex) {
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.add.html
    products.add({
      data: {
        title: `标题${titleIndex}`,
        image: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png',
        tags: [
          'tag1',
          'tag2'
        ],
        price: 120.12,
        color: 'green',
        view: 0
      }
    }).then(res => {
      console.log(`小程序端添加产品成功${titleIndex}`, res)
      if (titleIndex < 50) {
        this.localAddProduct(titleIndex + 1)
      }
    }).catch(err => {
      console.error('小程序端添加产品失败', err)
    })
  },
  cloudBatchAddProduct: function () {
    this.cloudAddProduct(1)
  },
  cloudAddProduct: function (titleIndex) {
    wx.cloud.callFunction({
        name: "database",
        data: {
          $url: "addProduct",
          product: {
            title: `标题${titleIndex}`,
            image: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png',
            tags: [
              'tag1',
              'tag2'
            ],
            price: 120.12,
            color: 'blue',
            view: 0
          }
        }
      }).then(res => {
        if (res.result.code == 0) {
          console.log(`小程序云端添加产品成功${titleIndex}`, res)
          if (titleIndex < 50) {
            this.cloudAddProduct(titleIndex + 1)
          }
        } else {
          console.error('小程序云端添加产品失败', res.result.errMsg)
        }
      })
      .catch(err => {
        console.error('小程序云端添加产品失败', err)
      })
  }
})
// 高级操作中删除所有产品 db.collection('products').where({ _openid: 'oSUQd0bZ3qQONC7Yytp2LtnSFmog' }).remove()