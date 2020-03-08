const fs = require('fs')
const epub = require('../utils/epub')

const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')

class Book {
    constructor(file, data) {
        if (file) {
            this.createBookFromFile(file)
        } else {
            this.createBookFromData(data)
        }
    }

    createBookFromFile(file) {
        console.log(file)
        const {
            destination,
            filename,  // 经过multer处理的文件名，不会重复
            mimetype = MIME_TYPE_EPUB,
            originalname,
            path       // 文件路径
        } = file
        const suffix = mimetype == MIME_TYPE_EPUB ? '.epub' : ''   // 后缀
        const oldBookPath = path
        const bookPath = `${destination}/${filename}${suffix}`  // 存储路径   /Users/liuyilan/Desktop/upload/admin-book/book/filename.epub
        const url = `${UPLOAD_URL}/book/${filename}${suffix}`   // 浏览和下载路径  http://el.liugezhou.online:8080/upload/admin-book/book/
        const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`    // 解压后的文件夹路径
        const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`      // 解压后的浏览路径

        // 如果解压路径不存在，创建解压文件夹
        if (!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, { recursive: true })
        }
        // 给文件重命名，加入.epub后缀
        if (fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
            fs.renameSync(oldBookPath, bookPath)
        }

        this.filename = filename
        this.path = `/book/${filename}${suffix}`   // 相对路径
        this.filePath = this.path
        this.unzipPath = `/unzip/${filename}`  // 解压后的相对路径
        this.unzipUrl = unzipUrl      // 解压后的文件夹链接
        this.url = url
        this.title = ''
        this.auther = ''
        this.publiser = ''
        this.contents = []   // 目录
        this.cover = ''
        this.category = -1   // 分类 默认-1
        this.categoryText = ''   // 分类名称
        this.language = ''
        this.originalname = originalname
    }

    createBookFromData(data) {

    }
}

module.exports = Book