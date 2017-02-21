var Monitor = require("../page-monitor");
var fs = require('fs');
var path = require("path");
var util = require("../util");
var amqp = require('amqplib/callback_api');
var config = require("../config");

/**
 * 执行DIFF和DOM check 的主函数
 * @param gridfs
 * @param db
 */

module.exports = function (gridfs, db) {
    var Mon = db.model("Mon"),
        Task = db.model("Task");

    amqp.connect(config.rabbitURI, function (err, conn) { // 连接Rabbit MQ
        conn.createChannel(function (err, ch) { // 创建通道

            var queue = 'phantomjs_task_queue',// 声明消息队列名
                response_queue = "phantomjs_response_queue";

            ch.assertQueue(queue, {durable: true}); // 设置消息队列
            ch.assertQueue(response_queue, {durable: true}); // 设置消息队列

            ch.prefetch(1); // 设置 RabbitMQ 每次接受的消息不超过1条

            console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);

            var sendMessage = util.sendMessage(ch, response_queue);

            ch.consume(queue, function (msg) {
                console.log("收到新消息", msg.content.toString());
                var taskId = JSON.parse(msg.content.toString("utf-8")).taskId; // 获取任务ID

                Task.findById(taskId).then(function (task) {
                    config.phantomConfig.walk.excludeSelectors = task.diffRules;
                    config.phantomConfig.domRules = task.domRules;
                    console.log("===================== domRules ============");
                    console.log(config.phantomConfig.domRules);
                    console.log("===================== task ============");
                    console.log(task);
                    var monitor = new Monitor(task.url, config.phantomConfig);
                    monitor.on('debug', function (data) {
                        console.log('[DEBUG] ' + data);
                    });
                    monitor.on('error', function (data) {
                        console.error('[ERROR] ' + data);
                    });

                    var basedir, // 截图文件的目录
                        tree, // tree.json ObjectId
                        tree, // tree.json ObjectId
                        info, // info.json ObjectId
                        screenShot, // screenShot.jpg ObjectId
                        diffPic, // diff picture ObjectId
                        domException = [], // DOM 异常
                        timestamp; // 时间戳
                    if (!task.base) { // 没有基准页面
                        var files = ["tree.json", "info.json", "screenShot.jpg"];
                        monitor.capture(function (code) {
                            if (code != 0) {
                                sendMessage({
                                    taskId: taskId,
                                    status: -1,
                                    errInfo: monitor.log.error
                                });
                                ch.ack(msg);
                                return;
                            }
                            monitor.log.debug.forEach(function (value, index) {
                                if (/save capture /.test(value)) {
                                    basedir = value.match(/\[(.*)\]/)[1];
                                }
                            });
                            if (!basedir) {
                                sendMessage({
                                    taskId: taskId,
                                    status: -1,
                                    errInfo: monitor.log.error
                                });
                                ch.ack(msg);
                                return;
                            }
                            timestamp = parseInt(path.parse(basedir).name);
                            task.base = new Date(timestamp);

                            if (monitor.log.dom && monitor.log.dom[0]) { // DOM 异常
                                domException = JSON.parse(monitor.log.dom[0]);
                            }

                            Promise.all(files.map(function (filename) {
                                return util.saveToGridFS(gridfs, filename, path.join(basedir, filename));
                            }))
                                .then(function (files) {
                                    Promise.all([
                                        (new Mon({
                                            taskId: taskId,
                                            timestamp: timestamp,
                                            hasException: domException.length && true || false,
                                            data: {
                                                tree: files[0]._id,
                                                info: files[1]._id,
                                                screenShot: files[2]._id,
                                                diffPic: null
                                            },
                                            uiExceptions: {
                                                add: 0,
                                                remove: 0,
                                                text: 0,
                                                style: 0
                                            },
                                            domExceptions: domException
                                        })).save(),
                                        task.save()
                                    ])
                                        .then(function (data) {
                                            sendMessage({
                                                taskId: taskId,
                                                status: 0,
                                                mon: data[0]
                                            });
                                            ch.ack(msg);
                                        })
                                        .catch(function (err) {
                                            sendMessage({
                                                taskId: taskId,
                                                status: -1,
                                                errInfo: err.toString()
                                            });
                                            ch.ack(msg);
                                        })
                                })
                        }, true); //

                    } else { // 有基准页面
                        var files = [
                                {
                                    filename: "tree.json",
                                    name: "tree"
                                },
                                {
                                    filename: "info.json",
                                    name: "info"
                                },
                                {
                                    filename: "screenShot.jpg",
                                    name: "screenShot"
                                }],
                            basePage = task.base.getTime(), // 获取基准页面时间戳
                            basePageDir, // 基准页面dir
                            parseDir; // 解析过后的path
                        monitor.capture(function (code) { // 截取当前时间点图片，
                            if (code != 0) {
                                sendMessage({
                                    taskId: taskId,
                                    status: -1,
                                    errInfo: monitor.log.error
                                });
                                ch.nack(msg); // 异常出现，将消息返回给队列
                                return;
                            }
                            monitor.log.debug.forEach(function (value, index) {
                                if (/save capture /.test(value)) {
                                    basedir = value.match(/\[(.*)\]/)[1];
                                }
                            });
                            if (!basedir) {
                                sendMessage({
                                    taskId: taskId,
                                    status: -1,
                                    errInfo: monitor.lEEog.error
                                });
                                ch.nack(msg); // 异常出现，将消息返回给队列
                                return;
                            }
                            // console.log(monitor.log);
                            console.log("basedir:", basedir);
                            var parsedDir = path.parse(basedir)
                            timestamp = parseInt(parsedDir.name);
                            parsedDir.name = parsedDir.base = basePage.toString();
                            basePageDir = path.format(parsedDir);
                            console.log("basePageDir: ", basePageDir);

                            task.base = timestamp; // 重新设置基准页面
                            files = files.map(function (file) {
                                file.fileUri = path.join(basedir, file.filename);
                                return file;
                            })

                            if (monitor.log.dom && monitor.log.dom[0]) { // DOM 异常
                                domException = JSON.parse(monitor.log.dom[0]);
                            }
                            util.exists(basePageDir)
                                .then(function (status) {
                                    if (!status) { // 基准页面不存在
                                        fs.mkdirSync(basePageDir);
                                        return Mon.findOne({timestamp: basePage})
                                            .then(function (mon) {
                                                return Promise.all(files.map(function (file) {
                                                    return util.readFromGridFS(gridfs,
                                                        mon.data[file.name],
                                                        path.join(basePageDir, file.filename)
                                                    );
                                                }))

                                            })
                                    } else {
                                        return Promise.resolve(); // 基准页面存在直接返回
                                    }
                                })
                                .then(function () {
                                    monitor.diff(basePage, timestamp, function (code) {
                                        console.log("========== diff page ===========\n");
                                        if (!monitor.log.info[0]) {
                                            console.log("页面没有变化！\n");
                                            if (monitor.log.warning &&
                                                monitor.log.warning.some(function (item) {
                                                    return item.trim() == "no change"
                                                })) { // 对比无变化
                                                var count = {
                                                    "add": 0,
                                                    "remove": 0,
                                                    "style": 0,
                                                    "text": 0
                                                };
                                            } else { // 错误返回
                                                sendMessage({
                                                    taskId: taskId,
                                                    status: -1,
                                                    errInfo: monitor.log.error
                                                });
                                                ch.ack(msg);
                                                return;
                                            }
                                        } else { // 对比有变化
                                            console.log("页面有变化！\n");
                                            // console.log(monitor.log.info[0]); // diff result
                                            console.log('[DONE] exit [' + code + ']');
                                            var info = JSON.parse(monitor.log.info[0])
                                            files.push({
                                                filename: basePage + " - " + timestamp + ".jpg",
                                                name: "screenShot",
                                                fileUri: info.diff.screenshot
                                            })
                                            var count = info.diff.count;

                                        }
                                        Promise.all(files.map(function (file) {
                                            return util.saveToGridFS(gridfs, file.filename, file.fileUri)
                                        }))
                                            .then(function (files) {
                                                // res.json(files);
                                                var hasException = !(count.add == 0 &&
                                                    count.remove == 0 &&
                                                    count.style == 0 &&
                                                    count.text == 0) || domException.length;
                                                return Promise.all([
                                                    (new Mon({
                                                        taskId: taskId,
                                                        timestamp: timestamp,
                                                        hasException: hasException,
                                                        data: {
                                                            tree: files[0]._id,
                                                            info: files[1]._id,
                                                            screenShot: files[2]._id,
                                                            diffPic: (files[3] && files[3]._id) || null
                                                        },
                                                        uiExceptions: count,
                                                        domExceptions: domException
                                                    })).save(),
                                                    task.save()
                                                ])
                                            })
                                            .then(function (data) {
                                                sendMessage({
                                                    taskId: taskId,
                                                    status: 0,
                                                    mon: data[0]
                                                });
                                                ch.ack(msg);
                                            })
                                            .catch(function (err) {
                                                sendMessage({
                                                    taskId: taskId,
                                                    status: -1,
                                                    errInfo: err.toString()
                                                });
                                                ch.ack(msg);
                                            })
                                    });
                                })
                                .catch(function (err) {
                                    sendMessage({
                                        taskId: taskId,
                                        status: -1,
                                        errInfo: err.toString()
                                    });
                                    ch.ack(msg);
                                })
                        }, true)
                    }
                }).catch(function (err) {
                    sendMessage({
                        taskId: taskId,
                        status: -1,
                        errInfo: err.toString()
                    });
                    ch.ack(msg);
                })
            }, {noAck: false});
        });
    });
}






























