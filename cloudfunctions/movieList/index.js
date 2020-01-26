// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise')

// 云函数入口函数
exports.main = async(event, context) => {
  return rp(`https://www.wanandroid.com/article/list/${event.page}/json`)
    .then(function(res) {
      // 直接 res.xxx 取不到数据，需要解析后才能获取
      console.log(res)
      // 要转换一次后再返回，否则客户端也要转换一次
      return JSON.parse(res).data.datas
    })
    .catch(function(err) {
      console.log(err)
    })
}