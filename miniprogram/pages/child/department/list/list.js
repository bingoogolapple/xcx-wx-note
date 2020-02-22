const db = wx.cloud.database()
const departmentCollection = db.collection('department')
const app = getApp()

Page({
  data: {
    departmentTree: null,
    activeId: null
  },
  onLoad: function (options) {
    this.loadDepartmentTree()
  },
  loadDepartmentTree(callback = () => { }) {
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
  onPullDownRefresh: function () {
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
    let id = event.target.dataset.id
    wx.navigateTo({
      url: `../edit/edit?id=${id}`,
      events: {
        refreshDepartmentList: data => {
          console.log('修改或删除成功，刷新科室列表', data)
          this.loadDepartmentTree()
        }
      }
    })
  },
  addDepartment() {
    wx.navigateTo({
      url: '../edit/edit',
      events: {
        refreshDepartmentList: data => {
          console.log('添加成功，刷新科室列表', data)
          this.loadDepartmentTree()
        }
      }
    })
  }
})