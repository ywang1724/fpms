'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mail = mongoose.model('Mail'),
	Exception = mongoose.model('Exception'),
	App = mongoose.model('App'),
	Page = mongoose.model('Page'),
	User = mongoose.model('User'),
	_ = require('lodash'),
	nodemailer = require('nodemailer'),
	config = require('../../config/config'),
	moment = require('moment');

/**
 * Create a Mail
 */
var createMail = function(mailObj, user) {
	var mail = new Mail(mailObj);
	mail.user = user;

	mail.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('mail created!');
		}
	});
};



/**
 * 说明：发送邮件
 * @param toAddress
 * @param subject
 * @param exception
 * @param app
 * @param page
 */
var sendMail = function (toAddress, subject, exception, app, page){
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
		subject: excepType[exception.type] + '报警', // 标题
		html: mailMessage // html 内容
	};

	var mailObj = {
		'theme': excepType[exception.type] + '报警',
		'content': mailMessage,
		'receiver': toAddress
	};

	transport.sendMail(mailOptions, function(error, response) {
		if (error) {
			console.error(error);
			mailObj.status = 2;//设置发送失败标识位
			createMail(mailObj, app.user);
		} else {
			console.log(response);
			mailObj.status = 1;//设置发送成功标识位
			createMail(mailObj, app.user);
		}
		transport.close(); // 如果没用，关闭连接池
	});
};

//将发送邮件功能暴漏给模块外
exports.sendMail = sendMail;

/**
 * 手动报警
 */
exports.manualAlarm = function (req, res){
	var user = new User(req.body.appObj.user);
	var app = new App(req.body.appObj);
	app.user = user;
	var exception = req.body.exception;
	exception.ui = exception.occurTimeAndUi.ui;
	var toAddress = app.alarmEmail;
	var subject = '异常报警';
	var pageObj;
	Page.findOne({_id: exception.page}).exec(function (err, page){
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
		} else {
			pageObj = page;
			sendMail (toAddress, subject, exception, app, pageObj);
			//更新报警时间
			Exception.findOneAndUpdate({_id: exception._id}, {lastAlarmTime: new Date() }).exec(function (err){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
			});

		}
	});

	res.json({success: true});

};

/**
 * Show the current Mail
 */
exports.read = function(req, res) {
	res.jsonp(req.mail);
};

/**
 * Update a Mail
 */
exports.update = function(req, res) {
	var mail = req.mail ;

	mail = _.extend(mail , req.body);

	mail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mail);
		}
	});
};

/**
 * Delete an Mail
 */
exports.delete = function(req, res) {
	var mail = req.mail ;

	mail.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mail);
		}
	});
};

/**
 * List of Mails
 */
exports.list = function(req, res) {

	if (req.user.roles[0] === 'admin') {
		Mail.find().sort('-created').populate('user', 'displayName').exec(function(err, mails) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(mails);
			}
		});
	} else {
		Mail.find({user: req.user._id}).sort('-created').populate('user', 'displayName').exec(function(err, mails) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(mails);
			}
		});
	}
};

/**
 * Mail middleware
 */
exports.mailByID = function(req, res, next, id) { 
	Mail.findById(id).populate('user', 'displayName').exec(function(err, mail) {
		if (err) return next(err);
		if (! mail) return next(new Error('Failed to load Mail ' + id));
		req.mail = mail ;
		next();
	});
};

/**
 * Mail authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mail.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


