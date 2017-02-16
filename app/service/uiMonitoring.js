'use strict';
var schedule = require('node-schedule'),
    amqp = require('amqplib/callback_api'),
    mongoose = require("mongoose"),
    config = require("../../config/config"),
    Mon = mongoose.model("Mon"),
    Task = mongoose.model("Task"),
    sendMail = require("../controllers/mails.server.controller").sendMail,
    _ = require("lodash");


function sendMessageUtil(channel, queueName) {
    return function (message) {
        console.log('======================= send message ========================');
        console.log(JSON.stringify(message, null, '\t'));
        channel.sendToQueue(queueName, new Buffer(JSON.stringify(message), "utf-8"), { persistent: true });
    }
}

function generateTask(channel) {
    var addTask = sendMessageUtil(channel, 'phantomjs_task_queue'),
        rule = new schedule.RecurrenceRule(); // 创建定时任务规则

    // rule.second = [0, 30]; // 每个小时的0分，30分执行一次，也就是美半小时执行一次任务
    rule.second = _.range(0, 59, 5);
    console.log("我的定时任务啊");
    var myjob = schedule.scheduleJob(rule, function () { // 启动任务
        var now = new Date();
        console.log('启动任务。。。。。。');
        Task.find({}, function (err, tasks) {
            if (err) console.error(err.toString())
            else {
                console.log("tasks。。。。。。。", tasks);
                tasks.forEach(function (task) { // 创建任务
                    if (task.isRunning && (now - task.lastRunTime) >= task.monitoringInterval) {
                        addTask({ taskId: task._id }); // 将任务消息发送到消息队列
                    }
                });
            }
        });
    });
}

function clean(gridfs) {
    var rule = new schedule.RecurrenceRule(); // 创建定时任务规则
    // rule.minute = 0;
    // rule.hour = 0;
    // rule.month = [1, 15];
    rule.second = _.range(0, 59, 5);
    var job = schedule.scheduleJob(rule, function () { // 启动任务
        Mon.find({"timestamp":{"$lt":Date.now() - 1 * 60 * 1000}}, function(err, mons){ // 移除一个月之前的old data
            _.forEach(mons, function(mon){
                mon.data && _.forEach(mon.data.toObject(), function(value, key){
                    value && gridfs.remove({_id: value.toString()}, function (err) { // 一移除保存的截图等监控数据
                        if (err) console.err(err.toString());
                        console.log('file delete success');
                    });
                    console.log("移除监控结果：", mon);
                    mon.remove(); // 移除监控任务
                })
            })
        })
    });
}
function processData(channel, gridfs) {
    var queue = 'phantomjs_response_queue';// 声明消息队列名
    channel.assertQueue(queue, { durable: true }); // 设置消息队列
    channel.prefetch(1); // 设置 RabbitMQ 每次接受的消息不超过1条

    console.log("等待接收消息.....");
    channel.consume(queue, function (msg) {
        console.log("收到新消息", msg.content.toString() + "\n");
        var parsedMsg = JSON.parse(msg.content.toString("utf-8"));
        if(parsedMsg.errInfo) {
            console.error(parsedMsg.errInfo);
        } else {
            if(parsedMsg.mon && parsedMsg.mon.hasException) { // 有异常发生
                var mon = parsedMsg.mon;
                Task.findById(parsedMsg.taskId).populate('app').exec(function (err, task) {
                    if(err) console.error(err.toString());
                    else {
                        sendMail(task.app.alarmEmail, '页面监测异常报警', mon, task.app, task.url, 'ui', gridfs);
                        task.lastRunTime = parsedMsg.mon.timestamp;
                        task.save(function(err){
                            if(err) console.error(err.toString());
                        });
                    }
                });
            }
        }
        channel.ack(msg); // 向消息队列发出应答，表明已经处理了此条消息
    }, { noAck: false });
}


/* 启动 */
module.exports = function(gridfs) {
    return function() {
        amqp.connect(config.rabbitURI, function (err, conn) { // 连接Rabbit MQ
            conn.createChannel(function (err, channel) { // 创建通道
                generateTask(channel);
                processData(channel, gridfs);
                // clean(gridfs);
            })
        });
    }
}
