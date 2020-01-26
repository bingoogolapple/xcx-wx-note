const db = wx.cloud.database()
const todo = db.collection('todo')
Page({
  data: {
    id: null,
    task: {}
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    todo.doc(options.id).get().then(res => {
      console.log(res)
      this.setData({
        task: res.data
      })
    }).catch(err => {
      console.error(err)
    })
  },
  viewLocation: function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html
    wx.openLocation({
      latitude: this.data.task.location.latitude,
      longitude: this.data.task.location.longitude,
      name: this.data.task.location.name,
      address: this.data.task.location.address
    })
  }
})