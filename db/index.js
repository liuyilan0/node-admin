const mysql = require('mysql')
const config = require('./config')
const { debug } = require('../utils/constant')
const { isObject } = require('../utils/util')

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
      debug && console.log('\n执行语句： ' + sql + '\n')
      conn.query(sql, (err, results) => {
        if (err) {
          // debug && console.log('查询失败:', JSON.stringify(err))
          reject(err)
        } else {
          // debug && console.log('查询结果:', JSON.stringify(results))
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

/** 插入 */
function insert(model, tableName) {
  return new Promise((resolve, reject) => {
    if (!isObject(model)) {
      reject(new Error('插入失败，数据类型不对'))
    } else {
      const keys = []
      const values = []
      Object.keys(model).forEach(key => {
        if (model.hasOwnProperty(key)) {
          keys.push(`\`${key}\``)
          values.push(`'${model[key]}'`)
        }
      })
      if (keys.length > 0 && values.length > 0) {
        let sql = `INSERT INTO \`${tableName}\` (`
        const keysString = keys.join(',')
        const valuesString = values.join(',')
        sql = `${sql}${keysString}) VALUES (${valuesString})`
        debug && console.log('\n执行sql语句: \n' + sql)

        const conn = connect()
        try {
          conn.query(sql, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        } catch (e) {
          reject(e)
        } finally {
          conn.end()
        }
      } else {
        reject(new Error('插入数据库失败，对象中没有任何属性'))
      }
    }
  })
}

/** 更新 */
function update(model, tableName, where) {
  return new Promise((resolve, reject) => {
    if (!isObject(model)) {
      reject(new Error('更新失败，数据类型不对'))
    } else {
      const entry = []
      Object.keys(model).forEach(key => {
        if (model.hasOwnProperty(key)) {
          entry.push(`\`${key}\`='${model[key]}'`)
        }
      })
      if (entry.length > 0) {
        let sql = `UPDATE \`${tableName}\` SET`
        sql = `${sql} ${entry.join(',')} ${where}`
        debug && console.log('\n执行sql语句: \n' + sql)

        const conn = connect()
        try {
          conn.query(sql, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        } catch (e) {
          reject(e)
        } finally {
          conn.end()
        }
      } 
    }
  })
}

// 拼接sql语句
function sqlAnd(where, k, v) {
  if (where === 'where') {
    return `${where} \`${k}\`='${v}'`
  } else {
    return `${where} and \`${k}\`='${v}'`
  }
}

// 拼接sql语句：like
function sqlLike(where, k, v) {
  if (where === 'where') {
    return `${where} \`${k}\` like '%${v}%'`
  } else {
    return `${where} and \`${k}\` like '%${v}%'`
  }
}

module.exports = {
  querySql,
  queryOne,
  insert,
  update,
  sqlAnd,
  sqlLike
}