const express = require('express')
const Result = require('../models/result')  // 接口处理
const multer = require('multer')   // 文件上传
const { UPLOAD_PATH } = require('../utils/constant')
const Book = require('../models/book')

const router = express.Router()

/**
 * book类处理的接口:
 * /book/upload  - 上传接口
 */

/* 上传接口 */
router.post('/upload', multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),

    function (req, res, next) {
        if (!req.file || req.file.length === 0) {
            new Result('上传电子书失败').fail(res)
        } else {
            const book = new Book(req.file)
            console.log(book)
            new Result('上传电子书成功').success(res)
        }
    })

module.exports = router