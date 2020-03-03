const crypto = require('crypto')

function md5(param) {
    return crypto.createHash('md5').update(String(param)).digest('hex')
}

module.exports = {
    md5
}