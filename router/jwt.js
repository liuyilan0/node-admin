const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

const jwtAuth = expressJwt({
    secret: PRIVATE_KEY,
    credentialsRequired: true
}).unless({
    path: [    // jwt白名单
        '/',
        '/user/login'
    ]
})

module.exports = {
    jwtAuth
}