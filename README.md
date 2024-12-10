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

## 作者联系方式

| 个人主页 | 邮箱 |
| ------------- | ------------ |
| <a  href="https://www.bingoogolapple.cn" target="_blank">bingoogolapple.cn</a>  | <a href="mailto:bingoogolapple@gmail.com" target="_blank">bingoogolapple@gmail.com</a> |

| 个人微信号 | 微信群 | 公众号 |
| ------------ | ------------ | ------------ |
| <img width="180" alt="个人微信号" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/BGAQrCode.png"> | <img width="180" alt="微信群" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/WeChatGroup1QrCode.jpg"> | <img width="180" alt="公众号" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/GongZhongHao.png"> |

| 个人 QQ 号 | QQ 群 |
| ------------ | ------------ |
| <img width="180" alt="个人 QQ 号" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/BGAQQQrCode.jpg"> | <img width="180" alt="QQ 群" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/QQGroup1QrCode.jpg"> |

## 打赏支持作者

如果您觉得 BGA 系列开源库或工具软件帮您节省了大量的开发时间，可以扫描下方的二维码打赏支持。您的支持将鼓励我继续创作，打赏后还可以加我微信免费开通一年 [上帝小助手浏览器扩展/插件开发平台](https://github.com/bingoogolapple/bga-god-assistant-config) 的会员服务

| 微信 | QQ | 支付宝 |
| ------------- | ------------- | ------------- |
| <img width="180" alt="微信" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/donate-wechat.jpg"> | <img width="180" alt="QQ" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/donate-qq.jpg"> | <img width="180" alt="支付宝" src="https://github.com/bingoogolapple/bga-god-assistant-config/raw/main/images/donate-alipay.jpg"> |

## 作者项目推荐

* 欢迎您使用我开发的第一个独立开发软件产品 [上帝小助手浏览器扩展/插件开发平台](https://github.com/bingoogolapple/bga-god-assistant-config)
