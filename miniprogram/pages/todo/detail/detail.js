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
  }
})