'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	detect = require('./../tools/detect'),
	statistics = require('./../tools/statistics'),
	Exception = mongoose.model('Exception'),
	ExceptionKind = mongoose.model('ExceptionKind'),
	App = mongoose.model('App'),
	Page = mongoose.model('Page'),
	Q = require('q'),
	_ = require('lodash');

/**
 * Create a Exception
 * TODO:报警，死链接检测
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

								//判断是否有该异常种类,没有的话新建一个，有的话更新
								ExceptionKind.findOne({page: bookie.page, type: bookie.type,
									errorurl: bookie.errorurl, stack: bookie.stack,
									message: bookie.message, requrl: bookie.requrl}).exec(function (err, exceptionKind){
									if (err) {
										console.log(errorHandler.getErrorMessage(err));
									} else {
										//长度为0即表示没有，添加一个即可,同时报警；否则检查是否要报警并更新
										if (!exceptionKind) {
											//报警，然后新建
											new ExceptionKind({page: bookie.page, type: bookie.type,
												errorurl: bookie.errorurl, stack: bookie.stack,
												message: bookie.message, requrl: bookie.requrl,
												lastAlarmTime: new Date(), isAlarm: 1}).save(function (err) {
												if (err) {
													console.log(errorHandler.getErrorMessage(err));
												}
												console.log(Date.now());
											});
										} else {
											//TODO更新种类,报警并更新部分异常种类字段
											console.log('alarm.....');
											console.log('update exceptionKind');
										}
									}
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
					pieData: [],
					browserData: [0, 0, 0, 0, 0, 0],
					trendData:[]
				}
			};

			//返回当前时间异常分布曲线
			var timeDisData = statistics.timeDistribute(exceptions);
			result.data.trendData[0] = ((timeDisData !== null) ? timeDisData:[0]);

			//返回历史时间异常分布曲线数据
			var promise1 = Exception.find({
				page: {$in: pages}
			}).exec(function (err, exceptions) {
				var historyTimeDis = statistics.historyTimeDist(exceptions);
				if(historyTimeDis){
					result.data.trendData[1] = historyTimeDis;
				}else{
					result.data.trendData[1] = [0];
				}

			});

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

				//浏览器分布情况统计
				switch (exceptions[i].ui.browser){
					case 'Chrome':
						result.data.browserData[0]++;
						break;
					case 'Firefox':
						result.data.browserData[1]++;
						break;
					case 'Internet Explorer':
						result.data.browserData[2]++;
						break;
					case 'Safari':
						result.data.browserData[3]++;
						break;
					case 'Opera':
						result.data.browserData[4]++;
						break;
					default:
						result.data.browserData[5]++;
						break;

				}
			}

			//返回有效的异常统计饼状图信息
			for(var j=0; j<pieData.length; j++){
				if(pieData[j].y !== 0){
					result.data.pieData.push(pieData[j]);
				}
			}

			Q.all([promise1]).then(function (){
				res.json(result);
			});
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
