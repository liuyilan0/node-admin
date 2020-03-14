const express = require('express')
const Result = require('../models/result')  // 接口处理
const multer = require('multer')   // 文件上传
const { UPLOAD_PATH } = require('../utils/constant')
const Book = require('../models/book')
const boom = require('boom')
const { decode } = require('../utils/crypto')
const bookService = require('../services/book')

const router = express.Router()

/**
 * book类处理的接口:
 * /book/upload  - 上传接口
 * /book/create  - 添加接口
 */

/* 上传接口 */
router.post('/upload', multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),

    function (req, res, next) {
        if (!req.file || req.file.length === 0) {
            new Result('上传电子书失败').fail(res)
        } else {
            const book = new Book(req.file)
            book.parse().then(book => {
                new Result(book, '上传电子书成功').success(res)
            }).catch(err => {
                next(boom.badImplementation(err))
            })
        }
    })

/** 添加图书保存接口 */
router.post('/create', function (req, res, next) {
    const decoded = decode(req)
    if (decoded && decoded.username) {
        req.body.username = decoded.username
    }
    console.log('添加图书接口参数:\n')
    console.log(req.body)
    const book = new Book(null, req.body) // req.body
    bookService.db_insertBook(book).then(() => {
        new Result('成功添加电子书').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

router.post('/update', function (req, res, next) {
    const decoded = decode(req)
    if (decoded && decoded.username) {
        req.body.username = decoded.username
    }
    const book = new Book(null, req.body) 
    bookService.db_updateBook(book).then(() => {
        new Result('成功更新电子书').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

/** 获取图书信息 */
router.get('/get', function(req, res, next) {
    const {fileName} = req.query
    if (!fileName) {
        next(boom.badRequest(new Error('参数不能为空')))
    } else {
        bookService.db_getBook(fileName).then(book => {
            new Result(book, '成功获取图书信息').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})

/** 获取分类数据 */
router.get('/getCategory', function(req, res, next) {
    bookService.db_getBookCategory().then(category => {
        new Result(category, '成功获取分类数据').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

/** 获取列表数据 */
router.get('/getList', function(req, res, next) {
    bookService.db_getBookList().then(bookList => {
        new Result(bookList, '成功获取列表数据').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

module.exports = router