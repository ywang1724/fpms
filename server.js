'use strict';
/**
 * 加载依赖模块
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

/**
 * 主程序入口文件
 * 加载顺序非常重要
 */

// 启动数据库连接
var db = mongoose.connect(config.db, function(err) {
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
app.listen(config.port);

// 暴露app变量
exports = module.exports = app;

// 打印应用启动日志
console.log('FPMS started on port ' + config.port + ' and process.env.NODE_ENV = ' + process.env.NODE_ENV);
