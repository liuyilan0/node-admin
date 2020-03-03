const express = require('express')
const boom = require('boom')
const Result = require('../models/result')
const { md5, jwtToToken, decode } = require('../utils/crypto')
const { PWD_SALT } = require('../utils/constant')
const { body, validationResult } = require('express-validator')
const { db_login, db_findUser } = require('../services/user')

const router = express.Router()

/**
 * user类处理的接口:
 * /user/login  - 登录接口
 * /user/info   - 用户信息接口
 */

/* 处理登录接口 */
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

      db_login({ username, password }).then(user => {
        if (!user || user.length == 0) {
          new Result('登录失败').fail(res)
        } else {
          // JWT生成token 并传给前端
          const token = jwtToToken(username)
          new Result({ token }, '登录成功').success(res)
        }
      })
    }
  })

  /* 处理查询用户信息接口 */
  router.get('/info', function(req, res) {
    const decoded = decode(req)
    if (decoded && decoded.username) {
      db_findUser(decoded.username).then(user => {
        if (user) {
          user.roles = [user.role]
          new Result(user, '获取用户信息成功').success(res)
        } else {
          new Result('获取用户信息失败').fail(res)
        }
      })
    } else {
      new Result('用户信息解析失败').fail(res)
    }
  })


module.exports = router