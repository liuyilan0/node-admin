const { querySql } = require('../db')

// 登录查询
function login({ username, password }) {
    return querySql(`select * from admin_user where username='${username}' && password='${password}'`)
}

module.exports = {
    login
}