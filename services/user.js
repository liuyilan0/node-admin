const { querySql, queryOne } = require('../db')

// 登录查询用户是否存在
function login({ username, password }) {
    return querySql(`select * from admin_user where username='${username}' && password='${password}'`)
}

// 查询某个用户的信息
function findUser(username) {
    const sql = `select * from admin_user where username='${username}'`
    return queryOne(sql)
  }

module.exports = {
    login,
    findUser
}