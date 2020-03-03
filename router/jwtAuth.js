const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

// JWT认证
const jwtAuth = expressJwt({
    secret: PRIVATE_KEY,
    credentialsRequired: true
}).unless({
    path: [    // 白名单
        '/',
        '/user/login'
    ]
})

module.exports = {
    jwtAuth
}