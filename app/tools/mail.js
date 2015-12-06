'use strict';
/**
 * Created by xjw919 on 15/12/6.
 */


var nodemailer = require('nodemailer'),
    config = require('../../config/config');

exports.sendMail = function (toAddress, subject, message){
    var transport = nodemailer.createTransport(config.q_mailer.options);

    var mailOptions = {
        from: config.q_mailer.from, // 发件地址
        to: toAddress, // 收件列表
        subject: subject, // 标题
        html: message // html 内容
    };

    transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.error(error);
        } else {
            console.log(response);
        }
        transport.close(); // 如果没用，关闭连接池
    });
};
