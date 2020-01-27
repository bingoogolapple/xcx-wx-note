// https://github.com/bingoogolapple/nodejs-note/blob/master/commonjs-test/a.js
// https://github.com/bingoogolapple/nodejs-note/blob/master/commonjs-test/index.js

function add(a, b) {
  console.log('math.js 中的 add 方法')
  return a + b
}

// async function independent(ctx) {
const independent = async ctx => {
  console.log('math.js ctx', ctx)
  ctx.data.addResult = await new Promise(resolve => {
    setTimeout(() => {
      const event = ctx.event
      resolve(add(event.a, event.b))
    }, 1500)
  })

  ctx.body = {
    code: 0,
    data: ctx.data
  }
}

// module.exports = add

module.exports = {
  add,
  independent
}