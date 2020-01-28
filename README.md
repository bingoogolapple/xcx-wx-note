# xcx-wx-note

微信小程序学习笔记

* 小程序5个可信域名，需要备案
* 云开发不限制域名个数，不需要备案
* 解决在一个环境中只有 20 个云函数 https://github.com/TencentCloudBase/tcb-router

## vant

* https://youzan.github.io/vant-weapp/#/quickstart

```
cd miniprogram
npm init

cnpm i @vant/weapp -S --production
工具 -> 构建 npm
详情 -> 本地设置 -> 使用 npm 模块
```

## 请求其他网络服务

### request-promise

* https://github.com/request/request-promise
* 每个云函数都要安装一次

```
cnpm install --save request
cnpm install --save request-promise
```

### got

* https://github.com/sindresorhus/got
* 每个云函数都要安装一次
* 最新版 10.x.x 在小程序中使用有问题，用 9.x.x 的最新版

```
cnpm install --save got@9.6.0
```

## TCBRouter

* 解决在一个环境中只有 20 个云函数 https://github.com/TencentCloudBase/tcb-router

```
cnpm install --save tcb-router

yarn add tcb-router
```

## 操作 MySQL

### sequelize

* https://github.com/sequelize/sequelize