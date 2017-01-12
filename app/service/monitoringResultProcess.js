'use strict';
var amqp = require('amqplib/callback_api');
var mongoose = require("mongoose");
var config = require("../../config/config");
var Mon = mongoose.model("Mon"),
    Task = mongoose.model("Task");
var count = 0;
module.exports = function(app){
    amqp.connect(config.rabbitURI, function (err, conn) { // 连接Rabbit MQ
        conn.createChannel(function (err, ch) { // 创建通道
            var queue = 'phantomjs_response_queue';// 声明消息队列名
            ch.assertQueue(queue, {durable: true}); // 设置消息队列
            ch.prefetch(1); // 设置 RabbitMQ 每次接受的消息不超过1条

            console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);
            ch.consume(queue, function (msg)  {
                count ++;
                if(count < 1) {
                    console.log("收到新消息", msg.content.toString() + "\n");
                    ch.ack(msg);
                }
            }, {noAck: false});
        });
    });
}
