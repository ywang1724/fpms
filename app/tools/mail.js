'use strict';
/**
 * Created by xjw919 on 15/12/6.
 */


var nodemailer = require('nodemailer'),
    config = require('../../config/config'),
    moment = require('moment');

exports.sendMail = function (toAddress, subject, exception, app, page){
    var transport = nodemailer.createTransport(config.q_mailer.options);
    var excepType = {1: 'JavaScript异常', 2: 'Ajax请求异常', 3: '静态资源丢失异常', 4:　'死链接异常', 5: '页面加载异常', 6: 'DOM结构异常', 7: '内存异常'};

    var mailMessage = '您好，您的应用 ' + app.name + ' 下的' + page.pathname + ' 发生异常，异常详情如下：<br>' +
                      '异常类型：' + excepType[exception.type] + '<br>' +
                      '异常消息：' + exception.message + '<br>' +
                      '发生时间：' + moment(exception.occurTime).format('YYYY-MM-DD HH:mm:ss') + '<br>' +
                      '浏览器：' + exception.ui.browser + '版本号' + exception.ui.version + '<br>' +
                      '平台信息：'　+　exception.ui.os + '版本号' + exception.ui.osversion + '<br>' +
                      '堆栈消息：' + exception.stack + '<br>' +
                      '请求链接：' + exception.requrl + '<br>' +
                      '异常文件：' + (exception.errorurl === '' ? '当前页面' : exception.errorurl) + '<br>' +
                      '异常页面：' + page.pathname;


    var mailOptions = {
        from: config.q_mailer.from, // 发件地址
        to: toAddress, // 收件列表
        subject: subject, // 标题
        html: mailMessage // html 内容
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
