const db = wx.cloud.database()
const _ = db.command
const userInfosCollection = db.collection('userInfos')
const departmentCollection = db.collection('department')
const app = getApp()

const DEFAULT_IMAGE = '/images/empty-image.png'

Page({
  data: {
    titleList: [{
        title: '医师'
      },
      {
        title: '主治医师'
      },
      {
        title: '副主任医师'
      },
      {
        title: '主任医生'
      }
    ],
    chooseTitleActionSheetVisible: false,
    defaultTitleIndex: 0,
    department: {},
    realAvatarUrl: DEFAULT_IMAGE,
    userId: null,
    personalInfo: null
  },
  onLoad: function(options) {
    this.loadUserInfo(options.id)
  },
  loadUserInfo(userId) {
    app.showLoading('加载中...')
    userInfosCollection.doc(userId).get().then(res => {
      console.log('加载用户信息成功', res.data)
      let userInfo = res.data
      let personalInfo
      if (!userInfo.personalInfo) {
        personalInfo = {}
      } else {
        personalInfo = userInfo.personalInfo
      }
      let realAvatarUrl = personalInfo.realAvatarUrl ? personalInfo.realAvatarUrl : DEFAULT_IMAGE
      if (personalInfo.departmentId) {
        this.loadDepartment(personalInfo.departmentId)
      }

      this.setData({
        userId: userInfo._id,
        personalInfo: personalInfo,
        realAvatarUrl: realAvatarUrl
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
        department: res.data
      })
    }).catch(err => {
      console.error('加载科室失败', err)
    })
  },
  chooseImage() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
    wx.chooseImage({
      count: 1,
      success: res => {
        console.log('选择图片或拍照成功', res)
        this.setData({
          realAvatarUrl: res.tempFilePaths[0],
        })
      },
      fail: err => {
        // {errMsg: "chooseImage:fail cancel"}
        console.log('选择图片或拍照失败', err)
      }
    })
  },
  onRealNameChanged(event) {
    this.data.personalInfo.realName = event.detail.trim()
  },
  onPhoneChanged(event) {
    this.data.personalInfo.phone = event.detail.trim()
  },
  onSkilledChanged(event) {
    this.data.personalInfo.skilled = event.detail.trim()
  },
  onIntroChanged(event) {
    this.data.personalInfo.intro = event.detail.trim()
  },
  showChooseTitleActionSheet() {
    let defaultTitleIndex = 0;
    if (this.data.personalInfo.title) {
      defaultTitleIndex = this.data.titleList.findIndex(item => {
        return item.title === this.data.personalInfo.title
      })
    } else {
      this.handleTitleChanged(this.data.titleList[0].title)
    }
    this.setData({
      defaultTitleIndex: defaultTitleIndex,
      chooseTitleActionSheetVisible: true
    })
  },
  hideChooseTitleActionSheet() {
    this.setData({
      chooseTitleActionSheetVisible: false
    })
  },
  handleTitleChanged(title) {
    this.data.personalInfo.title = title
    this.setData({
      personalInfo: this.data.personalInfo
    })
  },
  onTitleChanged(event) {
    this.handleTitleChanged(event.detail.value.title)
  },
  chooseDepartment() {
    console.log('选择科室')
    wx.navigateTo({
      url: '/pages/child/department/choose/choose',
      events: {
        onSelectedDepartment: department => {
          this.setData({
            department: department
          })
          this.data.personalInfo.departmentId = department._id
        }
      }
    })
  },
  submit() {
    let personalInfo = this.data.personalInfo
    console.log(personalInfo)
    if (this.data.realAvatarUrl === DEFAULT_IMAGE) {
      app.showToast('请选择个人图片')
      return
    }
    if (!personalInfo.realName || personalInfo.realName.length == 0) {
      app.showToast('请选输入真实姓名')
      return
    }
    if (!personalInfo.phone || personalInfo.phone.length == 0) {
      app.showToast('请选输入手机号')
      return
    }
    if (!personalInfo.departmentId) {
      app.showToast('请选择科室')
      return
    }
    if (!personalInfo.title || personalInfo.title.length == 0) {
      app.showToast('请选择职称')
      return
    }
    if (!personalInfo.skilled || personalInfo.skilled.length == 0) {
      app.showToast('请输入擅长')
      return
    }
    if (!personalInfo.intro || personalInfo.intro.length == 0) {
      app.showToast('请填写个人简介')
      return
    }

    if (this.data.realAvatarUrl.startsWith('cloud://')) {
      this.performSubmit()
    } else {
      this.uploadImage()
    }
  },
  uploadImage() {
    app.showLoading('上传个人图片中...')
    let image = this.data.realAvatarUrl
    let suffix = /\.\w+$/.exec(image)[0]
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/uploadFile/client.uploadFile.html
    wx.cloud.uploadFile({
      cloudPath: `user/${new Date().getTime()}_${Math.floor(Math.random() * 10000)}${suffix}`,
      filePath: image
    }).then(res => {
      console.log('上传成功', res)
      this.data.realAvatarUrl = res.fileID
      this.performSubmit()
    }).catch(err => {
      wx.hideLoading()
      app.showToast('上传个人图片失败')
      console.error('上传失败', err.errMsg)
    })
  },
  performSubmit() {
    this.data.personalInfo.realAvatarUrl = this.data.realAvatarUrl

    console.log(this.data.personalInfo)
    app.showLoading('提交中...')
    wx.cloud.callFunction({
      name: 'userInfos',
      data: {
        $url: "updatePersonalInfo",
        userId: this.data.userId,
        personalInfo: this.data.personalInfo
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.code == 0) {
        console.log('修改成功', res)
        wx.navigateBack({})
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