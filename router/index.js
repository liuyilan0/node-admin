const express = require('express')
const boom = require('boom')   // 异常处理
const { jwtAuth } = require('./jwtAuth')    // jwt认证
const Result = require('../models/result')  // res封装
const userRouter = require('./user')   // 路由接口处理

// 注册路由
const router = express.Router()

// 对路由进行jwt认证
router.use(jwtAuth)

// 路由配置
router.get('/', function(req, res, next) {
    res.send('欢迎进入后台管理平台')
})
router.use('/user', userRouter)    // 终端查看接口是否可以访问指令： curl https://www.liugezhou.online:80/login -X POST -d "username=liuyilan&password=123456"/


/** 异常处理 */
router.use((req, res, next) => {
    next(boom.notFound('接口不存在'))
})

/** 自定义异常 */
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      new Result(null, 'token失效', {
        error: err.status,
        errorMsg: err.name
      }).expired(res.status(err.status))
    } else {
      const msg = (err && err.message) || '系统错误'
      const statusCode = (err.output && err.output.statusCode) || 500;
      const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
      new Result(null, msg, {
        error: statusCode,
        errorMsg
      }).fail(res.status(statusCode))
    }
  })

module.exports = router