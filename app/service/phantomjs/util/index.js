var fs = require("fs");
var config = require("../config");

/**
 * 存储文件到Gridfs
 * @param gridfs 访问gridfs的引用
 * @param filename 文件名
 * @param fileUri 文件路径
 * @returns {Promise} 返回Promsie
 */
exports.saveToGridFS = function (gridfs, filename, fileUri) {
    return new Promise(function (resolve, reject) {
        var is = fs.createReadStream(fileUri);
        var os = gridfs.createWriteStream({
            filename: filename,
        });
        is.pipe(os);
        os.on("close", function (file) {
            resolve(file);
        })
        os.on("error", function (err) {
            reject(err);
        })
    });
}

/**
 * 从Gridfs中读取文件
 * @param gridfs 访问gridfs的引用
 * @param id 文件ID
 * @param filepath 文件路径
 * @returns {Promise} 返回Promsie
 */
exports.readFromGridFS = function (gridfs, id, filepath) {
    return new Promise(function (resolve, reject) {
        var is = gridfs.createReadStream({
            _id: id
        });
        var os = fs.createWriteStream(filepath);
        is.pipe(os);
        os.on("close", function (file) {
            resolve(file);
        })
        os.on("error", function (err) {
            reject(err);
        })
    });
}

/***
 * 判断指定的文件夹是否存在
 * @param path
 * @returns {Promise}
 */
exports.exists = function (path) {
    return new Promise(function (resolve) {
        fs.access(path, function (err) {
            if (err) resolve(false);
            resolve(true);
        })
    })
}

/**
 * 发动消息给RabbitMQ的高阶函数
 * @param channel
 * @param queueName
 * @returns {Function}
 */
exports.sendMessage = function (channel, queueName) {
    return function (message) {
        channel.sendToQueue(queueName, new Buffer(JSON.stringify(message), "utf-8"), { persistent: true });
    }
}
