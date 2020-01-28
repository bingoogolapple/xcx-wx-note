// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
const db = wx.cloud.database()
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
const products = db.collection('products')

Page({
  data: {},
  localAddProduct: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.add.html
    products.add({
      data: {
        title: '产品3',
        image: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png',
        tags: [
          'tag1',
          'tag2'
        ],
        price: 120.12,
        color: 'green'
      }
    }).then(res => {
      console.log('小程序端添加产品成功', res)
    }).catch(err => {
      console.error('小程序端添加产品失败', err)
    })
  },
  cloudAddProduct: function() {
    wx.cloud.callFunction({
        name: "database",
        data: {
          $url: "addProduct",
          product: {
            title: '产品5',
            image: 'cloud://clinic-dev-gyarq.636c-clinic-dev-gyarq-1301144683/1579757364265.png',
            tags: [
              'tag1',
              'tag2'
            ],
            price: 120.12,
            color: 'blue'
          }
        }
      }).then(res => {
        if (res.result.code == 0) {
          console.log('小程序云端添加产品成功', res.result.data)
        } else {
          console.error('小程序云端添加产品失败', res.result.errMsg)
        }
      })
      .catch(err => {
        console.error('小程序云端添加产品失败', err)
      })
  }
})