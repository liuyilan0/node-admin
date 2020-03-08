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
  let token = req.get('Authorization')
  if (token.indexOf('Bearer') >= 0) {
    token = token.replace('Bearer ', '')
  } 
  return jwtToken.verify(token, PRIVATE_KEY)
}

module.exports = {
    md5,
    jwtToToken,
    decode
}