'use strict';
var schedule = require('node-schedule'),
    amqp = require('amqplib/callback_api'),
    mongoose = require("mongoose"),
    config = require("../../config/config"),
    Mon = mongoose.model("Mon"),
    Task = mongoose.model("Task"),
    count = 0;


function sendMessageUtil(channel, queueName) {
    return function (message) {
        channel.sendToQueue(queueName, new Buffer(JSON.stringify(message), "utf-8"), { persistent: true });
    }
}

function generateTask(channel) {
    var addTask = sendMessageUtil(channel, 'phantomjs_task_queue'),
        rule = new schedule.RecurrenceRule(); // 创建定时任务规则

    rule.second = [0, 30]; // 每个小时的0分，30分执行一次，也就是美半小时执行一次任务

    var job = schedule.scheduleJob(rule, function () { // 启动任务
        var now = new Date();
        Task.find({}, function (err, tasks) {
            if (err) console.error(err.toString())
            else {
                tasks.forEach(function (task) { // 创建任务
                    if (task.isRunning && (now - task.lastRunTime) >= task.monitoringInterval) {
                        addTask({ taskId: task._id }); // 将任务消息发送到消息队列
                    }
                });
            }
        });
    });
}

function processData(channel) {
    var queue = 'phantomjs_response_queue';// 声明消息队列名
    channel.assertQueue(queue, { durable: true }); // 设置消息队列
    channel.prefetch(1); // 设置 RabbitMQ 每次接受的消息不超过1条

    console.log("万恒");
    channel.consume(queue, function (msg) {
        count++;
        if (count < 1) {
            console.log("收到新消息", msg.content.toString() + "\n");
            channel.ack(msg);
        }
    }, { noAck: false });
}

module.exports = function () {
    amqp.connect(config.rabbitURI, function (err, conn) { // 连接Rabbit MQ
        conn.createChannel(function (err, channel) { // 创建通道
            generateTask(channel);
            processData(channel);
        })
    });

}
