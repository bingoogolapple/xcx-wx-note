const db = wx.cloud.database()
const departmentCollection = db.collection('department')
const app = getApp()

const ROOT_ID = 'root'
const ROOT_DEPARTMENT = {
  _id: ROOT_ID,
  title: '无（设置为顶级科室）'
}

Page({
  data: {
    department: {
      parentId: ROOT_ID
    },
    isEdit: false,
    parentDepartment: ROOT_DEPARTMENT,
    rootDepartmentList: [ROOT_DEPARTMENT],
    showChooseParentActionSheet: false,
    defaultIndex: 0
  },
  onLoad: function(options) {
    this.loadRootDepartmentList()
    if (options.id) {
      departmentCollection.doc(options.id).get().then(res => {
        console.log('获取科室成功', res)
        this.loadParent(res.data.parentId)
        this.setData({
          department: res.data,
          isEdit: true
        })
        wx.setNavigationBarTitle({
          title: '编辑科室'
        })
      }).catch(err => {
        app.showToast('获取科室失败，请稍后再试')
        console.error('获取科室失败', err)
      })
    }
  },
  loadRootDepartmentList() {
    departmentCollection.where({
      parentId: 'root'
    }).get().then(res => {
      console.log('加载科室列表成功', res.data)
      this.setData({
        rootDepartmentList: this.data.rootDepartmentList.concat(res.data)
      })
    }).catch(err => {
      console.log('加载科室列表失败', err)
    })
  },
  loadParent(parentId) {
    if (parentId === ROOT_ID) {
      return
    }
    departmentCollection.doc(parentId).get().then(res => {
      console.log('获取父级科室成功', res)
      this.setData({
        parentDepartment: res.data
      })
    }).catch(err => {
      console.error('获取父级科室失败', err)
    })
  },
  onTitleChanged(event) {
    this.data.department.title = event.detail.trim()
  },
  showChooseParentActionSheet() {
    let defaultIndex = 0;
    if (this.data.parentDepartment._id !== ROOT_ID) {
      defaultIndex = this.data.rootDepartmentList.findIndex(item => {
        return item._id === this.data.parentDepartment._id
      })
    }
    this.setData({
      defaultIndex: defaultIndex,
      showChooseParentActionSheet: true
    })
  },
  hideChooseParentActionSheet() {
    this.setData({
      showChooseParentActionSheet: false
    })
  },
  onRootDepartmenChanged(event) {
    console.log(event)
    let parentDepartment = event.detail.value
    this.data.department.parentId = parentDepartment._id
    this.setData({
      parentDepartment: parentDepartment
    })
  },
  confirm() {
    console.log('提交科室', this.data.department)
    let title = this.data.department.title
    if (title.length == 0) {
      app.showToast('请填写科室名称')
      return
    }

    // 检查重复
    departmentCollection.where({
      title: title
    }).get().then(res => {
      console.log('根据标题查询', res)
      if (this.data.isEdit) {
        if (res.data.length == 0 || res.data[0]._id === this.data.department._id) {
          this.performUpdate()
        } else {
          app.showToast('科室名称已存在')
        }
      } else {
        if (res.data.length == 0) {
          this.performAdd()
        } else {
          app.showToast('科室名称已存在')
        }
      }
    }).catch(err => {
      console.error('根据名称查询失败', err)
      app.showToast(`${this.data.isEdit? '编辑':'添加'}失败`)
    })
  },
  performAdd() {
    app.showLoading('添加中...')
    departmentCollection.add({
      data: this.data.department
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
  },
  performUpdate() {
    app.showLoading('修改中...')
    departmentCollection.doc(this.data.department._id).update({
      data: {
        parentId: this.data.department.parentId,
        title: this.data.department.title
      }
    }).then(res => {
      wx.hideLoading()
      console.log('修改成功', res.data)
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('refreshDepartmentList', {});
      wx.navigateBack({})
    }).catch(err => {
      wx.hideLoading()
      console.error('修改失败', err)
      app.showToast('修改失败')
    })
  },
  delete() {
    app.showLoading('删除中...')
    departmentCollection.doc(this.data.department._id).remove().then(res => {
      wx.hideLoading()
      console.log('删除成功', res.data)
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('refreshDepartmentList', {});
      wx.navigateBack({})
    }).catch(err => {
      wx.hideLoading()
      console.error('删除失败', err)
      app.showToast('删除失败')
    })
  }
})