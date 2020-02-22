const app = getApp()

Page({
  data: {
    type: null,
    departmentTree: null,
    activeId: null
  },
  onLoad: function(options) {
    this.setData({
      type: options.type
    })
    if (this.data.type === 'view_doctor') {
      wx.setNavigationBarTitle({
        title: '选择要查看的科室'
      })
    } else if (this.data.type === 'subscribe_doctor') {
      wx.setNavigationBarTitle({
        title: '选择要预约的科室'
      })
    }
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
    let department = event.target.dataset.item
    if (!this.data.type) { // 没有传 type 时，选择了直接返回
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('onSelectedDepartment', department);
      wx.navigateBack({})
    } else {
      wx.navigateTo({
        url: `/pages/child/user/department-doctor/department-doctor?departmentId=${department._id}&departmentTitle=${department.title}&type=${this.data.type}`,
      })
    }
  }
})