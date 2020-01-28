// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
const db = wx.cloud.database()
const _ = db.command
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
const products = db.collection('products')

Page({
  data: {
    products: null
  },
  onLoad: function(options) {
    // this.orderByQuery()
    this.batchRefresh()
  },
  orderByQuery: function() {
    products.where({
      color: 'green'
    }).orderBy('view', 'desc').orderBy('price', 'asc').skip(1).limit(3).get().then(res => {
      console.log('小程序端加载产品列表成功', res.data)
      this.setData({
        products: res.data
      })
    }).catch(err => {
      console.error('小程序端加载产品列表失败', err)
    })
  },
  gtQuery: function() {
    products.where({
      view: _.gt(3).lt(16) // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gt.html
    }).get().then(res => {
      console.log('小程序端加载产品列表成功', res.data)
      this.setData({
        products: res.data
      })
    }).catch(err => {
      console.error('小程序端加载产品列表失败', err)
    })
  },
  inQuery: function() {
    products.where({
      view: _.in([2, 7, 10]) // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.in.html
    }).get().then(res => {
      console.log('小程序端加载产品列表成功', res.data)
      this.setData({
        products: res.data
      })
    }).catch(err => {
      console.error('小程序端加载产品列表失败', err)
    })
  },
  orQuery: function() {
    products.where(_.or({
      view: _.gt(4)
    }, {
      color: 'red'
    })).get().then(res => {
      console.log('小程序端加载产品列表成功', res.data)
      this.setData({
        products: res.data
      })
    }).catch(err => {
      console.error('小程序端加载产品列表失败', err)
    })
  },
  countQuery: function() {
    products.where(_.or({
      view: _.gt(4)
    }, {
      color: 'red'
    })).count().then(res => {
      console.log('count查询成功', res.total)
    }).catch(err => {
      console.error('count查询失败', err)
    })
  },
  watchQuery: function() {
    products.where({
      color: 'green'
    }).orderBy('view', 'desc').orderBy('price', 'asc').skip(1).limit(3).watch({
      onChange: snapshot => {
        // snapshot.docs 返回的是 where 过滤后的数据，orderBy、skip、limit 无效，不能直接用来展示到界面上
        console.log('监听到数据变化', snapshot)
        if (snapshot.type === 'init') {
          return
        }
        snapshot.docChanges.forEach(changedItem => {
          this.data.products.forEach(oldItem => {
            if (changedItem.docId === oldItem._id) {
              // Object.keys(changedItem.updatedFields).forEach(key => {
              //   oldItem[key] = changedItem.updatedFields[key]
              // })
              for (let key in changedItem.updatedFields) {
                oldItem[key] = changedItem.updatedFields[key]
              }
            }
          })
        })
        this.setData({
          products: this.data.products
        })
      },
      onError: err => {
        console.error('监听数据变化失败', err)
      }
    })
  },
  batchUpdate: function() {
    wx.cloud.callFunction({
      name: "database",
      data: {
        $url: "batchUpdate",
        oldPrice: 100,
        newPrice: 200
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('批量更新成功', res.result.data)
        this.batchRefresh()
      } else {
        console.error('批量更新失败', res.result.errMsg)
      }
    }).catch(err => {
      console.error('批量更新失败', err)
    })
  },
  batchDelete: function() {
    wx.cloud.callFunction({
      name: "database",
      data: {
        $url: "batchDelete",
        price: 200
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log('批量删除成功', res.result.data)
        this.batchRefresh()
      } else {
        console.error('批量删除失败', res.result.errMsg)
      }
    }).catch(err => {
      console.error('批量删除失败', err)
    })
  },
  batchRefresh: function() {
    products.where({
      title: _.in(['标题2', '标题7', '标题9'])
    }).get().then(res => {
      console.log('批量操作后加载产品列表成功', res.data)
      this.setData({
        products: res.data
      })
    }).catch(err => {
      console.error('批量操作后加载产品列表失败', err)
    })
  }
})