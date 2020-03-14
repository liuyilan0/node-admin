const { insert, queryOne, querySql, update } = require('../db')
const _ = require('lodash')
const Book = require('../models/book')

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
            value: item.value,
            num: item.num
        })
    });
    return categroyList
}

// 获取电子书列表数据
function db_getBookList() {
    return new Promise(async (resolve, reject) => {
        const sql = 'select * from book order by id asc'
        const bookList = await querySql(sql)
        if (bookList && bookList.length != 0) {
            resolve(bookList)
        } else {
            reject(new Error('数据库暂无电子书'))
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