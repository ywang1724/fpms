'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	detect = require('./../tools/detect'),
	Exception = mongoose.model('Exception'),
	App = mongoose.model('App'),
	Page = mongoose.model('Page'),
	Q = require('q'),
	_ = require('lodash');

/**
 * Create a Exception
 */
exports.create = function(req, res) {
	if (req.session.appId) {
		App.findById(req.session.appId).exec(function (err, app) {
			if (err) {
				console.log(errorHandler.getErrorMessage(err));
			} else {
				var subString = req.url.substring(req.url.indexOf('?') + 1);
				var bookie = JSON.parse(decodeURIComponent(subString));
				if (bookie.userPlatformInfo.appHost === app.host) {
					//定义页面对象
					var page = {};
					//查找Web应用对应页面，如果存在则返回，如果不存在则新建
					Page.findOneAndUpdate({app: app, pathname: bookie.userPlatformInfo.pathname}, page, {upsert: true})
						.exec(function (err, obj) {
							if (err) {
								console.log(errorHandler.getErrorMessage(err));
							} else {
								page = obj;

								//页面和用户相关信息赋值
								bookie.page = page;
								bookie.ui = detect.getUserInformation(bookie.userPlatformInfo.userAgent, bookie.userPlatformInfo.platform, req.ip);

								new Exception(bookie).save(function (err) {
									if (err) {
										console.log(errorHandler.getErrorMessage(err));
									}
									console.log(Date.now());
								});
							}
						});
				}
			}
		});
	}
	var options = {
			root: 'static/img/',
			dotfiles: 'allow',
			headers: {
				'Content-Type': 'image/gif',
				'Pragma': 'no-cache',
				'Cache-Control': 'private, no-cache, no-cache=Set-Cookie, proxy-revalidate'
			}
		},
		fileName = '_fp.gif';
	res.sendFile(fileName, options, function (err) {
		if (err) {
			if (err.code === 'ECONNABORT' && res.statusCode === 304) {
				console.log(new Date() + '304 cache hit for ' + fileName);
				return;
			}
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log(new Date() + 'Sent:', fileName);
		}
	});
};

/**
 * Show the current Exception
 */
exports.read = function(req, res) {
	res.jsonp(req.exception);
};

/**
 * Update a Exception
 */
exports.update = function(req, res) {
	var exception = req.exception ;

	exception = _.extend(exception , req.body);

	exception.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exception);
		}
	});
};

/**
 * Delete an Exception
 */
exports.delete = function(req, res) {
	var exception = req.exception ;

	exception.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exception);
		}
	});
};

/**
 * List of Exceptions
 */
exports.list = function(req, res) { 
	Exception.find().sort('-created').populate('user', 'displayName').exec(function(err, exceptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exceptions);
		}
	});
};

/**
 * Exception middleware
 */
exports.exceptionByID = function(req, res, next, id) { 
	Exception.findById(id).populate('user', 'displayName').exec(function(err, exception) {
		if (err) return next(err);
		if (! exception) return next(new Error('Failed to load Exception ' + id));
		req.exception = exception ;
		next();
	});
};

/**
 * Exception authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.exception.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * 获取统计分析数据
 */
exports.statisticList = function(req, res){
	var pages = (typeof req.query.pageId === 'string') ? [req.query.pageId] : req.query.pageId;

	//初始化查询日期
	var staticDay = new Date(req.query.staticDay);
	var tommorow = new Date(Date.parse(staticDay) + 86400000);
	var staticDayGte = new Date(staticDay.getFullYear(), staticDay.getMonth(), staticDay.getDate());
	var staticDayLt = new Date(tommorow.getFullYear(), tommorow.getMonth(), tommorow.getDate());
	Exception.find({
		page: {$in: pages},
		time: {
			$gte: staticDayGte,
			$lt: staticDayLt
		}
	}).exec(function (err, exceptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var pieData = [{
				name: 'JavaScript异常',
				y: 0
			},{
				name: 'Ajax请求异常',
				y: 0
			},{
				name: '静态资源请求异常',
				y: 0
			},{
				name: '死链接',
				y: 0
			},{
				name: '页面加载异常',
				y: 0
			},{
				name: 'DOM结构异常',
				y: 0
			},{
				name: '内存异常',
				y: 0
			}];
			var result = {
				data: {
					exceptions: [],
					pieData: []
				}
			};

			//返回异常JSON数据
			for(var i=0; i<exceptions.length; i++){
				var item = {};
				item.id = exceptions[i]._id;
				item.type = exceptions[i].type;
				item.time = exceptions[i].time;
				item.stack = exceptions[i].stack;
				item.message = exceptions[i].message;
				item.errorurl = exceptions[i].message;
				item.requrl = exceptions[i].requrl;
				item.ui = exceptions[i].ui;
				result.data.exceptions.push(item);
				pieData[item.type-1].y++;
			}

			//返回异常统计饼状图信息
			for(var j=0; j<pieData.length; j++){
				if(pieData[j].y !== 0){
					result.data.pieData.push(pieData[j]);
				}
			}


			res.json(result);
		}
	});
};

/**
 * 获取bookie.js
 */
exports.bookie = function (req, res) {
	//配置文件参数
	var options = {
			root: process.env.NODE_ENV === 'production' ? 'static/dist/' : 'static/js/',
			dotfiles: 'allow',
			headers: {
				'Content-Type': 'text/javascript; charset=UTF-8',
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		},
		fileName = 'bookie.js';
	//存储appId到session
	req.session.appId = req.app._id;
	//发送文件
	res.sendFile(fileName, options, function (err) {
		if (err) {
			if (err.code === 'ECONNABORT' && res.statusCode === 304) {
				console.log(new Date() + '304 cache hit for ' + fileName);
				return;
			}
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log(new Date() + 'Sent:', fileName);
		}
	});
};
