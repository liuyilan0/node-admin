module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,
    
    debug: true,
    PWD_SALT: 'vue-admin',  // 密码md5加密秘钥
    PRIVATE_KEY: 'vue-admin-node',  // JWT秘钥
    JWT_EXPIRED: 60 * 60,  // token失效时间
}