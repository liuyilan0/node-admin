/** 类型判断：判断是否是一个对象 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = {
    isObject
}