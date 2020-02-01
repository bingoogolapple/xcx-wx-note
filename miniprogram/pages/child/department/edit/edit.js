const db = wx.cloud.database()
const departmentCollection = db.collection('department')
const app = getApp()

Page({
  data: {},
  onLoad: function(options) {

  },
  confirm() {
    app.showLoading('添加中...')

    departmentCollection.add({
      data: {
        title: 'test',
        parentId: 'root'
      }
    }).then(res => {
      wx.hideLoading()
      console.log('添加成功', res.data)
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('refreshDepartmentList', {});
      wx.navigateBack({})
    }).catch(err => {
      wx.hideLoading()
      console.error('添加失败', err)
      app.showToast('添加失败')
    })
  }
})