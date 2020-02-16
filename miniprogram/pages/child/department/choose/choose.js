const app = getApp()

Page({
  data: {
    departmentTree: null,
    activeId: null
  },
  onLoad: function(options) {
    this.loadDepartmentTree()
  },
  loadDepartmentTree(callback = () => {}) {
    app.showLoading('加载中...')

    wx.cloud.callFunction({
      name: "department",
      data: {
        $url: "departmentTree"
      }
    }).then(res => {
      wx.hideLoading()
      callback()
      if (res.result.code == 0) {
        console.log('加载科室列表成功', res.result.data)
        this.setData({
          departmentTree: res.result.data
        })
      } else {
        console.error('加载科室列表失败', res)
      }
    }).catch(err => {
      console.error('加载科室列表失败', err)
      wx.hideLoading()
      callback()
    })
  },
  onPullDownRefresh: function() {
    this.loadDepartmentTree(() => {
      wx.stopPullDownRefresh()
    })
  },
  onActiveDepartmentChanged(event) {
    console.log(event)
    this.setData({
      activeId: event.detail
    })
  },
  onClickItem(event) {
    console.log('onClickItem', event)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('onSelectedDepartment', event.target.dataset.item);
    wx.navigateBack({})
  }
})