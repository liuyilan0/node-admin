const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('./constant')

/** md5加密 */
function md5(param) {
    return crypto.createHash('md5').update(String(param)).digest('hex')
}

/** jwt反解token */
function decode(req) {
  const authorization = req.get('Authorization')
  let token = ''
  if (authorization.indexOf('Bearer') >= 0) {
    token = authorization.replace('Bearer ', '')
  } else {
    token = authorization
  }
  return jwt.verify(token, PRIVATE_KEY)
}

module.exports = {
    md5,
    decode
}