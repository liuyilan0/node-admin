const { env } = require('./env')
const UPLOAD_PATH = env === 'dev' ? '/Users/liuyilan/Desktop/upload/admin-book' : ''  // 上传本地或者服务器路径
const UPLOAD_URL = env === 'dev' ? 'http://el.liugezhou.online:8080/upload/admin-book' : ''     // 上传浏览的url

module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,

    debug: true,

    PWD_SALT: 'vue-admin',  // 密码md5加密秘钥
    PRIVATE_KEY: 'vue-admin-node',  // JWT秘钥
    JWT_EXPIRED: 60 * 60 * 60,  // token失效时间

    UPLOAD_PATH,
    MIME_TYPE_EPUB: 'application/epub+zip',
    UPLOAD_URL
}