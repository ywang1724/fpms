var path = require('path');
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');
var config = require("./config");
var schedule = require('node-schedule');
var fs = require('fs-extra')
Grid.mongo = mongoose.mongo; 

require("./models/mon"); // 引入Model
require("./models/task"); // 引入Task

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
var rule = new schedule.RecurrenceRule(); // 创建定时任务规则
rule.minute = 0;
rule.hour = 10; // 每天的上午十点执行清理工作
// rule.second = [0, 10, 20, 30, 40, 50]; // 测试用
var cleanJob = schedule.scheduleJob(rule, function () { // 启动任务
    fs.emptyDir(config.phantomConfig.path.root, function(err){
        if(err) console.error(err.toString());
        else console.log("清理文件成功。");
    })
});
