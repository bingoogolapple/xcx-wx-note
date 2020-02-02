const db = wx.cloud.database()
const departmentCollection = db.collection('department')
const app = getApp()

Page({
  data: {
    departmentList: null
  },
  onLoad: function(options) {
    this.loadDepartmentList()
  },
  loadDepartmentList() {
    app.showLoading('加载中...')
    departmentCollection.where({
      parentId: 'root'
    }).get().then(res => {
      wx.hideLoading()
      console.log('加载科室列表成功', res.data)
      this.setData({
        departmentList: res.data
      })
    }).catch(err => {
      wx.hideLoading()
      console.log('加载科室列表失败', err)
    })
  },
  onClickItem(event) {
    let id = event.target.dataset.id
    wx.navigateTo({
      url: `./edit/edit?id=${id}`,
      events: {
        refreshDepartmentList: data => {
          console.log('修改或删除成功，刷新科室列表', data)
          this.loadDepartmentList()
        }
      }
    })
  },
  addDepartment() {
    wx.navigateTo({
      url: './edit/edit',
      events: {
        refreshDepartmentList: data => {
          console.log('添加成功，刷新科室列表', data)
          this.loadDepartmentList()
        }
      }
    })
  }
})