const express = require('express')
const boom = require('boom')
const Result = require('../models/result')
const { md5, decode } = require('../utils/crypto')
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { login,findUser } = require('../services/user')

const router = express.Router()

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
          // JWT生成token
          const token = jwt.sign(
            { username },
            PRIVATE_KEY,
            { expiresIn: JWT_EXPIRED }
          )
          new Result({ token }, '登录成功').success(res)
        }
      })
    }
  })

  /** 查询用户信息 */
  router.get('/info', function(req, res) {
    const decoded = decode(req)
    if (decoded && decoded.username) {
      findUser(decoded.username).then(user => {
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

router.get('/list', function (req, res, next) {
  res.json('user list...')
})

router.get('/detail', function (req, res, next) {
  res.json('user detail...')
})

module.exports = router