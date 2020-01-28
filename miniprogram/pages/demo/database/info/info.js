// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
const db = wx.cloud.database()
const _ = db.command
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
const products = db.collection('products')

Page({
  data: {
    product: null
  },
  onLoad: function(options) {
    this.refreshProduct(options.id)
  },
  refreshProduct: function(id) {
    products.doc(id).field({
      title: true,
      price: true,
      tags: true,
      color: true
    }).get().then(res => {
      console.log('加载成功', res)
      this.setData({
        product: res.data
      })
    }).catch(err => {
      console.error('加载失败', err)
    })
  },
  addTag: function() {
    products.doc(this.data.product._id).update({
      data: {
        tags: _.push(['tag5'])
      }
    }).then(res => {
      if (res.stats.updated === 1) {
        console.log('更新成功', res)
        this.refreshProduct(this.data.product._id)
      } else {
        console.log('产品不存在', res)
      }
    }).catch(err => {
      console.error('更新失败', err)
    })
  },
  popTag: function() {
    products.doc(this.data.product._id).update({
      data: {
        tags: _.pop()
      }
    }).then(res => {
      if (res.stats.updated === 1) {
        console.log('更新成功', res)
        this.refreshProduct(this.data.product._id)
      } else {
        console.log('产品不存在', res)
      }
    }).catch(err => {
      console.error('更新失败', err)
    })
  },
  updateProduct: function() {
    products.doc(this.data.product._id).update({
      data: {
        title: '更新后标题1',
        price: 120
      }
    }).then(res => {
      if (res.stats.updated === 1) {
        console.log('更新成功', res)
        this.refreshProduct(this.data.product._id)
      } else {
        console.log('产品不存在', res)
      }
    }).catch(err => {
      console.error('更新失败', err)
    })
  },
  deleteProduct: function() {
    products.doc(this.data.product._id).remove().then(res => {
      if (res.stats.removed === 1) {
        console.log('删除成功', res)
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('refreshProducts', {});
        wx.navigateBack({})
      } else {
        console.log('产品不存在', res)
      }
    }).catch(err => {
      console.error('删除失败', err)
    })
  }
})