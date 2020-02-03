const db = wx.cloud.database()
const _ = db.command
const userInfosCollection = db.collection('userInfos')
const app = getApp()

Page({
  data: {
    userInfoList: null,
    roleList: [{
        text: '全部用户',
        value: '全部用户'
      },
      {
        text: '管理员',
        value: '管理员'
      },
      {
        text: '医生',
        value: '医生'
      },
      {
        text: '普通用户',
        value: '普通用户'
      }
    ],
    filterRole: '全部用户'
  },
  onLoad: function(options) {
    this.loadUserInfoList()
  },
  loadUserInfoList(callback = () => {}) {
    app.showLoading('加载中...')

    let promise
    if (this.data.filterRole === '全部用户') {
      promise = userInfosCollection.where({})
    } else if (this.data.filterRole === '普通用户') {
      promise = userInfosCollection.where({
        role: _.size(0)
      })
    } else {
      promise = userInfosCollection.where({
        role: _.all([this.data.filterRole])
      })
    }

    promise.get().then(res => {
      wx.hideLoading()
      callback()
      console.log('加载用户列表成功', res.data)
      this.setData({
        userInfoList: res.data
      })
    }).catch(err => {
      console.error('加载用户列表失败', err)
      wx.hideLoading()
      callback()
    })
  },
  onPullDownRefresh: function() {
    this.loadUserInfoList(() => {
      wx.stopPullDownRefresh()
    })
  },
  onFilterRoleChanged(event) {
    this.data.filterRole = event.detail
    this.loadUserInfoList()
  },
  onClickItem(event) {
    let user = event.target.dataset.user
    if (!user) {
      user = event.currentTarget.dataset.user
    }
    console.log(user)
  }
})