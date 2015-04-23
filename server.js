'use strict';
/**
 * 加载依赖模块
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    chalk = require('chalk');

/**
 * 主程序入口文件
 * 加载顺序非常重要
 */

// 启动数据库连接
var db = mongoose.connect(config.db, function (err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});

// 初始化express框架应用
var app = require('./config/express')(db);

// 启动passport配置
require('./config/passport')();

// 启动应用并开启监听端口
if (cluster.isMaster) {
    console.log('宿主启动...');

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('listening', function (worker, address) {
        console.log('核心' + i + ' pid:' + worker.process.pid);
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('核心' + i + ' pid:' + worker.process.pid + ' 重启');
        setTimeout(function () {
            cluster.fork();
        }, 2000);
    });
} else {
    app.listen(config.port);
}
//app.listen(config.port);

// 暴露app变量
exports = module.exports = app;

// 打印应用启动日志
console.log('FPMS started on port ' + config.port + ' and process.env.NODE_ENV = ' + process.env.NODE_ENV);
