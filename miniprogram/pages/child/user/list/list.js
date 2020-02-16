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
    filterRole: '全部用户',
    showUpdateRoleDialog: false,
    toUpdateRoleList: []
  },
  onLoad: function(options) {
    this.loadUserInfoList()
  },
  loadUserInfoList(callback = () => {}) {
    app.showLoading('加载中...')

    let promise
    if (this.data.filterRole === '全部用户') { // 全部用户时，不过滤
      promise = userInfosCollection.where({})
    } else if (this.data.filterRole === '普通用户') { // 普通用户时，role 列表的 length 为 0
      promise = userInfosCollection.where({
        role: _.size(0)
      })
    } else {
      // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.all.html
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
    this.setData({
      toUpdateRoleUserId: user._id,
      toUpdateRoleList: user.role,
      showUpdateRoleDialog: true
    })
  },
  onRoleChanged(event) {
    console.log(event)
    this.setData({
      toUpdateRoleList: event.detail
    })
  },
  performUpdateRole() {
    wx.cloud.callFunction({
      name: 'userInfos',
      data: {
        $url: "updateRole",
        userId: this.data.toUpdateRoleUserId,
        role: this.data.toUpdateRoleList
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.code == 0) {
        console.log('修改成功', res)
        this.loadUserInfoList()
      } else {
        console.error('修改失败', res)
        app.showToast('修改失败')
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('修改失败', err)
      app.showToast('修改失败')
    })
  }
})