const express = require('express')
const router = express.Router()
const Result = require('../models/result')
const { login } = require('../services/user')
const { md5 } = require('../utils/crypto')
const { PWD_SALT } = require('../utils/constant')
const { body, validationResult } = require('express-validator')
const boom = require('boom')

// curl https://www.liugezhou.online:80/login -X POST -d "username=liuyilan&password=123456"/

/**
 * 登录接口
 */
router.post('/login',
  [
    body('username').isString().withMessage('用户名必须为字符'),
    body('password').isNumeric().withMessage('密码必须为数字')
  ],
  function (req, res, next) {

    const err = validationResult(req)
    // 格式校验
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      next(boom.badRequest(msg))
    } else {
      // 对密码进行md5加密
      let { username, password } = req.body
      password = md5(`${password}${PWD_SALT}`)

      login({ username, password }).then(user => {
        if (!user || user.length == 0) {
          new Result('登录失败').fail(res)
        } else {
          new Result('登录成功').success(res)
        }
      })
    }
  })

router.get('/list', function (req, res, next) {
  res.json('user list...')
})

router.get('/detail', function (req, res, next) {
  res.json('user detail...')
})

module.exports = router