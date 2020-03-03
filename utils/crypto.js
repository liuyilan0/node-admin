const crypto = require('crypto')
const jwtToken = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('./constant')

/** md5加密 */
function md5(param) {
    return crypto.createHash('md5').update(String(param)).digest('hex')
}

/** jwt生成token */
function jwtToToken(username) {
  return jwtToken.sign(
    { username },
    PRIVATE_KEY,
    { expiresIn: JWT_EXPIRED }
  )
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
  return jwtToken.verify(token, PRIVATE_KEY)
}

module.exports = {
    md5,
    jwtToToken,
    decode
}