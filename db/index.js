const mysql = require('mysql')
const config = require('./config')
const { debug } = require('../utils/constant')

/** 连接数据库 */
function connect() {
    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        multipleStatements: true
    })
}

/** 查询全部 */
function querySql(sql) {
    const conn = connect()
    return new Promise((resolve, reject) => {
        try {
            debug && console.log('\n执行语句： '+ sql+'\n')
            conn.query(sql, (err, results) => {
                if (err) {
                    debug && console.log('查询失败:', JSON.stringify(err))
                    reject(err)
                } else {
                    debug && console.log('查询结果:', JSON.stringify(results))
                    resolve(results)
                }
            })
        } catch (e) {
            reject(e)
        } finally {
            conn.end()
        }
    })
}

/** 查询一个 */
function queryOne(sql) {
    return new Promise((resolve, reject) => {
      querySql(sql)
        .then(results => {
          if (results && results.length > 0) {
            resolve(results[0])
          } else {
            resolve(null)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }

module.exports = {
    querySql,
    queryOne
}