const { insert, queryOne, querySql, update } = require('../db')
const db = require('../db')
const _ = require('lodash')
const Book = require('../models/book')
const { debug } = require('../utils/constant')

// 查看电子书(title、author、publisher都相同的情况)是否存在
function db_exists(book) {
    const { title, author, publisher } = book
    const sql = `select * from book where title='${title}' and author='${author}' and publisher='${publisher}'`
    return queryOne(sql)
}

// 如果电子书已经存在，删除当前电子书
async function db_removeBook(book) {
    if (book) {
        // 删除目录下电子书
        book.reset()
        // 删除数据库中电子书
        if (book.fileName) {
            const removeBookSql = `delete from book where fileName='${book.fileName}'`
            const removeContentSql = `delete from contents where fileName='${book.fleName}'`
            await querySql(removeBookSql)
            await querySql(removeContentSql)
        }
    }
}

// 插入目录方法
function db_insertContents(book) {
    const contents = book.getContents()
    return new Promise(async (resolve, reject) => {
        if (contents && contents.length > 0) {
            for (let index = 0; index < contents.length; index++) {
                const content = contents[index];
                const _content = _.pick(content, [
                    'fileName',
                    'id',
                    'href',
                    'level',
                    'label',
                    'pid',
                    'navId',
                    'order',
                    'text'
                ])
                // 插入操作
                await insert(_content, 'contents').then(() => {
                    resolve('上传成功')
                })
            }
        }
    })
}

// 添加图书
function db_insertBook(book) {
    return new Promise(async (resolve, reject) => {
        try {
            if (book instanceof Book) {
                const result = await db_exists(book)
                if (result) {
                    await db_removeBook(book)
                    reject(new Error('电子书已经存在'))
                } else {
                    // 插入操作
                    await insert(book.toDb(), 'book')
                    await db_insertContents(book)
                    resolve()
                }
            } else {
                reject(new Error('添加的图书模型不合法'))
            }
        } catch (error) {
            reject(error)
        }
    })
}

// 更新编辑图书
function db_updateBook(book) {
    return new Promise(async (resolve, reject) => {
        try {
            if (book instanceof Book) {
                const result = await db_getBook(book.fileName)
                if (result) {
                    const model = book.toDb()
                    await update(model, 'book', `where fileName='${book.fileName}'`)
                    resolve('成功更新电子书')
                }
            } else {
                reject(new Error('添加的图书模型不合法'))
            }
        } catch (error) {
            reject(error)
        }
    })
}

// 读取电子书
function db_getBook(fileName) {
    return new Promise(async (resolve, reject) => {
        const bookSql = `select * from book where fileName='${fileName}'`
        const contentSql = `select * from contents where fileName='${fileName}' order by \`order\``
        const book = await queryOne(bookSql)
        const contents = await querySql(contentSql)
        if (book) {
            book.cover = Book.genCoverUrl(book)
            book.contentsTree = Book.genContentsTree(contents) // 目录树形结构
            resolve(book)
        } else {
            reject(new Error('电子书不存在'))
        }
    })
}

// 获取分类数据
async function db_getBookCategory() {
    const sql = 'select * from category order by category asc'
    const result = await querySql(sql)
    const categroyList = []
    result.forEach(item => {
        categroyList.push({
            label: item.categoryText,
            value: item.category,
            num: item.num
        })
    });
    return categroyList
}

// 获取电子书列表数据
async function db_getBookList(query) {
    const {
        category,
        author,
        title,
        sort,
        page = 1,
        pageSize = 20
    } = query
    
    let sql = 'select * from book'
    let where = 'where'
    title && (where = db.sqlLike(where, 'title', title)) // 条件查询（like）
    author && (where = db.sqlLike(where, 'author', author)) // 条件查询（like）
    category && (where = db.sqlAnd(where, 'category', category)) // 条件查询
    if (where !== 'where') { // 如果有条件查询，则将sql拼接起来
        sql = `${sql} ${where}`
    }
    if (sort) { // 排序
        const symbol = sort[0] // + 或 -
        const column = sort.slice(1, sort.length) // 排序依据的字段
        const order = symbol === '+' ? 'asc' : 'desc'
        sql = `${sql} order by \`${column}\` ${order}`
    }
    const offset = (page - 1) * pageSize // 分页偏移量
    sql = `${sql} limit ${pageSize} offset ${offset}`
    const bookList = await querySql(sql)
    return { bookList }
}

// 删除某电子书
function db_deleteBook(book) {
    return new Promise(async (resolve, reject) => {
        try {
            if (book instanceof Book) {
                const result = await db_exists(book)
                if (result) {
                    // 删除
                    const sql = `delete from book where id='${book.id}'`
                } else {
                    reject(new Error('电子书不存在'))
                }
            } else {
                reject(new Error('添加的图书模型不合法'))
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    db_insertBook, // 插入电子书
    db_getBook, // 查询电子书
    db_updateBook, // 更新电子书
    db_getBookCategory, // 获取分类数据
    db_getBookList // 获取电子书列表
}