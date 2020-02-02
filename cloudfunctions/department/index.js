const os = require('os')
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const departmentCollection = db.collection('department')
const ROOT_ID = 'root'

async function addOrUpdateDepartment(ctx) {
  try {
    const event = ctx.event
    const department = ctx.event.department

    let result
    if (department._id) {
      console.log('修改科室')
      result = await departmentCollection.doc(department._id).update({
        data: {
          parentId: department.parentId,
          title: department.title
        }
      })
    } else {
      console.log('添加科室')
      // 云端添加时默认不会添加 _openid 字段，需要单独设置
      department._openid = ctx.event.userInfo.openId
      result = await departmentCollection.add({
        data: department
      })
    }

    console.log(result)

    const isSuccess = result.errMsg.indexOf(':ok') !== -1
    ctx.body = {
      code: isSuccess ? 0 : 1,
      data: isSuccess,
      errMsg: isSuccess ? '操作成功' : '操作失败'
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function deleteDepartment(ctx) {
  try {
    const event = ctx.event
    const result = await departmentCollection.doc(event.id).remove()
    console.log(result)

    const isSuccess = result.errMsg.indexOf(':ok') !== -1
    ctx.body = {
      code: isSuccess ? 0 : 1,
      data: isSuccess,
      errMsg: isSuccess ? '操作成功' : '操作失败'
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

async function departmentTree(ctx) {
  try {
    const event = ctx.event
    // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.lookup.html
    const result = await departmentCollection.aggregate()
      .match({
        parentId: 'root'
      })
      .lookup({
        from: 'department',
        localField: '_id',
        foreignField: 'parentId',
        as: 'children'
      })
      .end()
    console.log(result)
    ctx.body = {
      code: 0,
      data: result.list
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      code: 1,
      errMsg: err.errMsg
    }
  }
}

//---------------------------------------------------------------
exports.main = async(event, context) => {
  if (os.type() === 'Darwin') {
    console.log(event)
  } else {
    cloud.logger().info(event)
  }

  const app = new TcbRouter({
    event
  })

  app.use(async(ctx, next) => {
    ctx.event = event
    ctx.context = context
    await next()
  })

  app.router('addOrUpdateDepartment', addOrUpdateDepartment)
  app.router('deleteDepartment', deleteDepartment)
  app.router('departmentTree', departmentTree)

  return app.serve()
}