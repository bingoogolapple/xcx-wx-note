const app = getApp()

Page({
  data: {
    departmentId: null,
    departmentTitle: null,
    userInfoList: []
  },
  onLoad: function(options) {
    this.data.departmentId = options.departmentId
    this.data.type = options.type
    this.setData({
      departmentTitle: options.departmentTitle
    })
    if (this.data.type === 'view_doctor') {
      wx.setNavigationBarTitle({
        title: '选择要查看的医生'
      })
    } else if (this.data.type === 'subscribe_doctor') {
      wx.setNavigationBarTitle({
        title: '选择要预约的医生'
      })
    }

    this.loadDepartmentDoctorList()
  },
  // 需要在当前页面的 json 配置文件中设置 "enablePullDownRefresh": true，https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#%E9%A1%B5%E9%9D%A2%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E5%87%BD%E6%95%B0
  onPullDownRefresh: function () {
    this.loadDepartmentDoctorList(false, () => {
      wx.stopPullDownRefresh()
    })
  },
  // onReachBottomDistance 设置页面上拉触底事件触发时距页面底部距离 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html
  onReachBottom: function () {
    this.loadDepartmentDoctorList(true)
  },
  loadDepartmentDoctorList(loadMore = false, callback = () => { }) {
    app.showLoading('加载中...')

    wx.cloud.callFunction({
      name: "userInfos",
      data: {
        $url: "departmentDoctorList",
        departmentId: this.data.departmentId,
        skip: loadMore ? this.data.userInfoList.length : 0,
        limit: 15
      }
    }).then(res => {
      if (res.result.code == 0) {
        const newLserInfoList = res.result.data
        console.log('加载医生列表成功', newLserInfoList)

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
        console.error('加载医生列表失败', res.result.errMsg)
        wx.hideLoading()
        callback()
      }
    }).catch(err => {
      console.error('加载医生列表失败', err)
      wx.hideLoading()
      callback()
    })
  },
  onClickItem(event) {
    let user = event.target.dataset.user
    if (!user) {
      user = event.currentTarget.dataset.user
    }
    wx.navigateTo({
      url: `/pages/child/user/view/view?id=${user._id}&type=${this.data.type}`,
    })
  }
})