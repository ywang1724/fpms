var path = require('path');
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');
var config = require("./config");

Grid.mongo = mongoose.mongo; 

require("./models/mon"); // 引入Model
require("./models/task");

mongoose.Promise = global.Promise; // 设置mongoose的Promise为原生自带的Promise

var conn = mongoose.createConnection(config.mongodbURI); // 连接Mongodb

conn.on('open', function () {
    var gfs = Grid(conn.db); // 获取Gridfs对象
    global.gridfs = gfs; // 将Gridfs对象设置为全局对象，便于后续使用方便
    require("./controller/diff")(gridfs, conn); // 加载核心
});

conn.on("error", function (err) { // 错误处理
    throw new Error(err);
});
