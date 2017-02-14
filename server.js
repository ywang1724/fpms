'use strict';
/**
 * 加载依赖模块
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    chalk = require('chalk'),
    env = require('./env.json'),
    Grid = require('gridfs-stream');
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

// 开启一个新的连接， 用于存取到Grid FS
Grid.mongo = mongoose.mongo;
var conn = mongoose.createConnection(config.db);
conn.on('open', function () {
    var gridfs = Grid(conn.db);

    // 初始化express框架应用
    var app = require('./config/express')(db, gridfs),
        User = mongoose.model("User");

    // 初始化用户设置
    User.find({username: "admin"}, function (err, user) {
        if (err) console.log(err.toString());
        else if (user.length < 1) {
            var admin = new User(env.adminAccount_init);
            admin.save(function (err) {
                if (err) console.log(err.toString());
                else console.log("user init ok!");
            });
        }
    });

    // 启动passport配置
    require('./config/passport')();



// 启动应用并开启监听端口
//     if (cluster.isMaster) {
//         console.log('宿主启动...');
//         // 启动UI监控服务（将监控任务由master执行，防止出现任务重复生成的情况
//         require('./app/service/uiMonitoring')();
//
//         for (var i = 0; i < numCPUs; i++) {
//             cluster.fork();
//         }
//         cluster.on('listening', function (worker, address) {
//             console.log('核心' + i + ' pid:' + worker.process.pid);
//         });
//         cluster.on('exit', function (worker, code, signal) {
//             console.log('核心' + i + ' pid:' + worker.process.pid + ' 重启');
//             setTimeout(function () {
//                 cluster.fork();
//             }, 2000);
//         });
//     } else {
//         app.listen(config.port);
//     }

    app.listen(config.port);
    require('./app/service/uiMonitoring')();

    // 打印应用启动日志
    console.log('FPMS started on port ' + config.port + ' and process.env.NODE_ENV = ' + process.env.NODE_ENV);
    
});
conn.on("error", function (err) {
    console.error(err);
});



