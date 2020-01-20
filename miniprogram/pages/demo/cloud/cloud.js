// miniprogram/pages/demo/cloud/cloud.js

// 初始化数据库
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  insert: function() {
    db.collection('specialty').add({
      data: {
        name: '便民门诊',
      },
      success: res => {
        console.log("添加成功", res)
      },
      fail: err => {
        console.logor("添加失败", err)
      }
    })
  },
  update: function() {
    db.collection('specialty')
      .doc('da51bd8c5e247f8903bcd4763cd822d8')
      .update({
        data: {
          name: '康复科门诊3',
        }
      }).then(res => {
        console.log(res)
        if (res.stats.updated == 1) {
          console.log("更新成功")
        } else {
          console.log("更新失败")
        }
      }).catch(err => {
        console.logor("更新失败", err)
      })
  },
  query: function() {
    db.collection('specialty')
      .where({
        name: '便民门诊'
      }).get().then(res => {
        console.log("查询成功", res)
      }).catch(err => {
        console.logor("查询失败", err)
      })
  },
  delete: function() {
    // 小程序端只能删除单条数据，删除多条需要调云函数
    // 没找到对应数据时不会返回删除失败，需要单独判断 removed
    db.collection('specialty')
      .doc('da51bd8c5e247f8903bcd4763cd822d8')
      .remove()
      .then(res => {
        console.log(res)
        if (res.stats.removed == 1) {
          console.log("删除成功")
        } else {
          console.log("删除失败")
        }
      })
      .catch(err => {
        console.log("删除失败", err)
      })
  },
  sum: function() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        a: 1,
        b: 2
      }
    }).then(res => {
      // res.result.sum
      console.log('成功', res)
    }).catch(err => {
      console.log('失败', err)
    })
  },
  batchDelete: function() {
    wx.cloud.callFunction({
      name: 'batchDelete'
    }).then(res => {
      // res.result.stats.removed
      console.log('批量删除成功', res)
    }).catch(err => {
      console.log('批量删除失败', err)
    })
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