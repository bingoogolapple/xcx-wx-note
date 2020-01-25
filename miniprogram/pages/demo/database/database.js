// miniprogram/pages/demo/database/database.js
const db = wx.cloud.database()
const _ = db.command

Page({
  insert: function () {
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
  update: function () {
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
  query: function () {
    db.collection('specialty')
      .where({
        name: '便民门诊'
      }).get().then(res => {
        console.log("查询成功", res)
      }).catch(err => {
        console.logor("查询失败", err)
      })
  },
  delete: function () {
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
  queryInArray: function() {
    db.collection('data')
      .where({
        count: _.in([1, 3, 4])
      })
      .get()
      .then(console.log)
      .catch(console.error)
  },
  queryNinArray: function() {
    db.collection('data')
      .where({
        count: _.nin([1, 3, 4])
      })
      .get()
      .then(console.log)
      .catch(console.error)
  },
  queryField: function () {
    db.collection('data')
      .field({
        extra: true
      })
      .get()
      .then(console.log)
      .catch(console.error)
  },
  queryRegex: function() {
    db.collection('data')
      .where({
        name: db.RegExp({
          // regexp: 'name-[3-4]',
          // regexp: '.+name',
          // regexp: 'name.+',
          regexp: 'name.*',
          options: 'i'
        })
      })
      .get()
      .then(console.log)
      .catch(console.error)
  },
  addLocation: function () {
    db.collection('location')
      .add({
        data: {
          location: db.Geo.Point(100.0012, 10.0022)
        }
      })
      .then(res => {
        console.log(res)
        db.collection('location')
          .add({
            data: {
              location: db.Geo.Point(101.0012, 10.0022)
            }
          })
          .then(res => {
            console.log(res)
            db.collection('location')
              .add({
                data: {
                  location: db.Geo.Point(102.0012, 10.0022)
                }
              })
              .then(console.log)
              .catch(console.error)
          })
          .catch(console.error)
      })
      .catch(console.error)
  },
  queryLocation: function () {
    db.collection('location')
      .get()
      .then(res => {
        console.log(res.data[0].location.latitude)
      })
      .catch(console.error)
  },
})