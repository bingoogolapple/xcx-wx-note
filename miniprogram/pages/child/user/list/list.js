const db = wx.cloud.database()
const _ = db.command
const userInfosCollection = db.collection('userInfos')
const app = getApp()

Page({
  data: {
    userInfoList: [],
    // 过滤相关
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
    filterKeyword: '',
    newFilterKeyword: '',
    // 点击条目相关
    showClickItemActionSheet: false,
    clickItemActionList: [{
        name: '修改用户角色',
        color: '#ee0a24'
      },
      {
        name: '查看用户信息',
        color: '#1989fa'
      }
    ],
    // 修改角色相关
    showUpdateRoleDialog: false,
    selectedUserId: null,
    selectedUserRole: []
  },
  onLoad: function(options) {
    this.loadUserInfoList()
  },
  loadUserInfoList(loadMore = false, callback = () => {}) {
    app.showLoading('加载中...')

    wx.cloud.callFunction({
      name: "userInfos",
      data: {
        $url: "userManageList",
        filterRole: this.data.filterRole,
        filterKeyword: this.data.filterKeyword,
        skip: loadMore ? this.data.userInfoList.length : 0,
        limit: 15
      }
    }).then(res => {
      if (res.result.code == 0) {
        const newLserInfoList = res.result.data
        console.log('加载用户列表成功', newLserInfoList)

        if (newLserInfoList.length == 0) {
          wx.hideLoading()
          callback()
          if (loadMore) {
            app.showToast('没有更多数据了')
          } else {
            app.showToast('没有数据')
            this.setData({
              userInfoList: []
            }, () => {
              wx.hideLoading()
              callback()
            })
          }
        } else {
          this.setData({
            userInfoList: loadMore ? this.data.userInfoList.concat(newLserInfoList) : newLserInfoList
          }, () => {
            wx.hideLoading()
            callback()
          })
        }
      } else {
        console.error('加载用户列表失败', res.result.errMsg)
        wx.hideLoading()
        callback()
      }
    }).catch(err => {
      console.error('加载用户列表失败', err)
      wx.hideLoading()
      callback()
    })
  },
  // 需要在当前页面的 json 配置文件中设置 "enablePullDownRefresh": true，https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#%E9%A1%B5%E9%9D%A2%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E5%87%BD%E6%95%B0
  onPullDownRefresh: function() {
    this.loadUserInfoList(false, () => {
      wx.stopPullDownRefresh()
    })
  },
  // onReachBottomDistance 设置页面上拉触底事件触发时距页面底部距离 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html
  onReachBottom: function() {
    this.loadUserInfoList(true)
  },
  onFilterRoleChanged(event) {
    this.data.filterRole = event.detail
    this.loadUserInfoList()
  },
  onKeywordChanged(event) {
    this.data.newFilterKeyword = event.detail
  },
  onClickSearch() {
    this.selectComponent('#searchItem').toggle()
    this.data.filterKeyword = this.data.newFilterKeyword
    this.loadUserInfoList()
  },
  onClickItem(event) {
    let user = event.target.dataset.user
    if (!user) {
      user = event.currentTarget.dataset.user
    }
    this.setData({
      selectedUserId: user._id,
      selectedUserRole: user.role,
      showClickItemActionSheet: true
    })
  },
  hideClickItemActionSheet() {
    this.setData({
      showClickItemActionSheet: false
    })
  },
  onClickItemAction(event) {
    this.setData({
      showClickItemActionSheet: false
    })
    let actionName = event.detail.name
    if (actionName === '修改用户角色') {
      if (app.globalData.userInfo._id === this.data.selectedUserId) {
        app.showToast('不允许修改自己的角色')
        return
      }
      this.setData({
        showUpdateRoleDialog: true
      })
    } else if (actionName === '查看用户信息') {
      wx.navigateTo({
        url: `../view/view?id=${this.data.selectedUserId}&type=view_self`
      })
    }
  },
  onRoleChanged(event) {
    this.setData({
      selectedUserRole: event.detail
    })
  },
  performUpdateRole() {
    wx.cloud.callFunction({
      name: 'userInfos',
      data: {
        $url: "updateRole",
        userId: this.data.selectedUserId,
        role: this.data.selectedUserRole
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