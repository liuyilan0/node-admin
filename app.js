const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const https = require('https')
const router = require('./router')

// 创建 express 应用
const app = express()

// 解析request
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// 解决跨域问题
app.use(cors())  
// 页面路由
app.use('/', router)

// 配置https请求
const privateKey = fs.readFileSync('https/www.liugezhou.online.key', 'utf8')
const certificate = fs.readFileSync('https/www.liugezhou.online.pem', 'utf8')
const credentials = { key: privateKey, cert: certificate }
const httpsServer = https.createServer(credentials, app)

const SSLPORT = 80
httpsServer.listen(SSLPORT, function() {
  console.log('HTTPS Server is running on: https://www.liugezhou.online:%s', SSLPORT)
})

// 使 express 监听 5000 端口号发起的 http 请求
// const server = app.listen(5000, function() {
//   const { address, port } = server.address()
//   console.log('Http启动成功，监听http://%s:%s', address, port)
// })