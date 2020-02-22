const db = wx.cloud.database()
const userInfosCollection = db.collection('userInfos')
const departmentCollection = db.collection('department')
const app = getApp()

Page({
  data: {
    userInfo: {},
    type: null
  },
  onLoad: function(options) {
    if (options.type === 'view_doctor' || options.type === 'subscribe_doctor') {
      wx.setNavigationBarTitle({
        title: '医生信息'
      })
    }
    this.setData({
      type: options.type
    })
    this.loadUserInfo(options.id)
  },
  loadUserInfo(userId) {
    app.showLoading('加载中...')
    userInfosCollection.doc(userId).get().then(res => {
      console.error('加载用户信息成功', res.data)
      let userInfo = res.data
      if (userInfo.personalInfo && userInfo.personalInfo.departmentId) {
        this.loadDepartment(userInfo.personalInfo.departmentId)
      }
      this.setData({
        userInfo: userInfo
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {
      console.error('加载用户信息失败', err)
      wx.hideLoading()
    })
  },
  loadDepartment(departmentId) {
    departmentCollection.doc(departmentId).get().then(res => {
      console.log('加载科室成功')
      this.setData({
        departmentTitle: res.data.title
      })
    }).catch(err => {
      console.error('加载科室失败', err)
    })
  },
  subscribeDoctor() {
    app.showToast('敬请期待')
  }
})