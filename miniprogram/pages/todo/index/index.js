const db = wx.cloud.database()
const todo = db.collection('todo')

Page({
  data: {
    tasks: []
  },
  onLoad: function(options) {
    this.loadTasks(false)
  },
  loadTasks: function(loadMore = false, callback = () => {}) {
    if (!callback) {
      callback = () => {}
    }

    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    todo.skip(loadMore ? this.data.tasks.length : 0).get().then(res => {
      console.log(res)
      if (res.data.length == 0) {
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
          tasks: loadMore ? this.data.tasks.concat(res.data) : res.data
        }, () => {
          wx.hideLoading()
          callback()
        })
      }
    }).catch(error => {
      console.error(error)
      wx.hideLoading()
      callback()
    })
  },
  onPullDownRefresh: function() {
    this.loadTasks(false, () => {
      console.log('刷新完毕')
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function() {
    this.loadTasks(true)
  }
})