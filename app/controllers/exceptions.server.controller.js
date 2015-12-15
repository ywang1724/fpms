'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	detect = require('./../tools/detect'),
	statistics = require('./../tools/statistics'),
	mail = require('./mails.server.controller'),
	Exception = mongoose.model('Exception'),
	App = mongoose.model('App'),
	Page = mongoose.model('Page'),
	Q = require('q'),
	request = require('request-promise'),
	_ = require('lodash');

/**
 * Create a Exception
 * TODO:报警;考虑如何做加载异常报警和内存异常报警。
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

								//设置条件判断，区分对待死链接异常和其它异常
								if (bookie.type !== 4) {
									//死链接外的异常


									//判断是否有该异常种类,没有的话新建一个，有的话更新
									Exception.findOne({page: bookie.page, type: bookie.type,
										errorurl: bookie.errorurl, stack: bookie.stack,
										message: bookie.message, requrl: bookie.requrl}).exec(function (err, exception){
										if (err) {
											console.log(errorHandler.getErrorMessage(err));
										} else {
											//长度为0即表示没有，添加一个即可,同时报警；否则检查是否要报警并更新
											if (!exception) {
												//查看应用是否含有该报警类型，报警并新建异常
												if(app.alarmtype.indexOf(bookie.type) !== -1){
													//报警的话添加上次报警时间为new Date()
													mail.sendMail(app.alarmEmail, '异常报警',bookie, app, page);
													new Exception({page: bookie.page, type: bookie.type,
														errorurl: bookie.errorurl, stack: bookie.stack,
														message: bookie.message, requrl: bookie.requrl,
														lastAlarmTime: new Date(), isAlarm: 1,
														createTime: bookie.occurTime, occurTimeAndUi: [{time: bookie.occurTime, ui: bookie.ui}]
													}).save(function (err) {
															if (err) {
																console.log(errorHandler.getErrorMessage(err));
															}
															console.log(Date.now());
														});
												} else {
													//不报警的话添加上次报警时间为0
													new Exception({page: bookie.page, type: bookie.type,
														errorurl: bookie.errorurl, stack: bookie.stack,
														message: bookie.message, requrl: bookie.requrl,
														lastAlarmTime: 0, isAlarm: 1,
														createTime: bookie.occurTime, occurTimeAndUi: [{time: bookie.occurTime, ui: bookie.ui}]
													}).save(function (err) {
															if (err) {
																console.log(errorHandler.getErrorMessage(err));
															}
															console.log(Date.now());
														});
												}
											} else {
												//报警并更新部分异常种类字段(报警条件：1、应用配置了该大类异常报警；2、改异常详细种类被设置为报警；3、异常的报警间隔大于应用配置的时间间隔)
												if((app.alarmtype.indexOf(bookie.type) !== -1) && (exception.isAlarm === 1) && ((new Date()).getTime() - exception.lastAlarmTime.getTime() >= app.alarmInterval )){
													mail.sendMail(app.alarmEmail, '异常报警',bookie, app, page);
													//报警的话更新上次报警时间和对应的平台信息和时间信息
													Exception.findOneAndUpdate({_id: exception._id}, {lastAlarmTime: new Date(), $push: {occurTimeAndUi: {time: bookie.occurTime, ui: bookie.ui}}}).exec(function (err){
														if (err) {
															return res.status(400).send({
																message: errorHandler.getErrorMessage(err)
															});
														}
													});
												} else {
													//不报警的话仅更新添加发生时间和对应的平台信息
													Exception.findOneAndUpdate({_id: exception._id}, {$push: {occurTimeAndUi: {time: bookie.occurTime, ui: bookie.ui}}}).exec(function (err){
														if (err) {
															return res.status(400).send({
																message: errorHandler.getErrorMessage(err)
															});
														}
													});
												}
												console.log('alarm.....');
												console.log('update exception');
											}
										}
									});
								} else {

									//死链接异常处理
									//1.如果上次检测时间是0，代表没有检测过，则进行检测
									//2.如果上次检测时间非0，代表检测过，则进行判断，这次是否需要检测
									//2.1 如果 现在时间-上次检测时间 >= 死链接检测间隔，则再次检测并更新app
									//2.2 如果 现在时间-上次检测时间 < 死链接间隔，则放弃检测
									var nowDate = new Date();
									if ((app.linkLastCheckTime.getTime()) === 0 || 	((nowDate.getTime() - app.linkLastCheckTime.getTime()) >= app.deadLinkInterval )){



										//更新链接上次检测时间字段
										App.findOneAndUpdate({_id: app._id}, {linkLastCheckTime: nowDate})
											.exec(function (err) {
												if (err) {
													console.log(errorHandler.getErrorMessage(err));
												}
											});

										//异常类型是4时，异常链接放在stack传到后台
										var urlArray = bookie.stack;
										//临时存放有效、无效链接
										var validLinks = [],
											deadLinks = [];

										//将链接转换为promise
										var optionsReq = urlArray.map(function (item){
											return request({url: item, method: 'HEAD'}, function (error, response, body) {
												if (!error && response.statusCode === 200) {
													validLinks.push(item);
												}else {
													deadLinks.push(item);
												}
											});
										});

										//链接结果检测完之后，存储失效链接
										Q.allSettled(optionsReq).then(function (){

											for (var k = 0; k < deadLinks.length; k ++) {

												(function (l){
													//新建异常并保存


													//处理异常种类信息
													//判断是否有该异常种类,没有的话新建一个，有的话更新
													Exception.findOne({type: 4, page: bookie.page, errorurl: '', requrl: deadLinks[l], message: '页面存在死链接' + deadLinks[l], stack: deadLinks[l] + '是死链接'}).exec(function (err, exception){
														if (err) {
															console.log(errorHandler.getErrorMessage(err));
														} else {
															//长度为0即表示没有，添加一个即可,同时报警；否则检查是否要报警并更新
															if (!exception) {
																//报警，然后新建
																if(app.alarmtype.indexOf(bookie.type) !== -1){

																	//临时存放exception对象，用于报警
																	var bookieObj1 = {
																		'type': 4,
																		'page': bookie.page,
																		'occurTime': bookie.occurTime,
																		'errorurl': '',
																		'requrl': deadLinks[l],
																		'message': '页面存在死链接' + deadLinks[l],
																		'stack': deadLinks[l] + '是死链接',
																		'ui': bookie.ui
																	};
																	mail.sendMail(app.alarmEmail, '异常报警',bookieObj1, app, page);
																	//报警的话添加上次报警时间lastAlarmTime为new Date()
																	new Exception({type: 4, page: bookie.page,
																		errorurl: '', requrl: deadLinks[l],
																		message: '页面存在死链接' + deadLinks[l], stack: deadLinks[l] + '是死链接',
																		lastAlarmTime: new Date(), isAlarm: 1,
																		createTime: bookie.occurTime, occurTimeAndUi: [{time: bookie.occurTime, ui: bookie.ui}]
																	}).save(function (err) {
																			if (err) {
																				console.log(errorHandler.getErrorMessage(err));
																			}
																			console.log(Date.now());
																		});

																} else {
																	//不报警的话添加上次报警时间为0
																	new Exception({type: 4, page: bookie.page,
																		errorurl: '', requrl: deadLinks[l],
																		message: '页面存在死链接' + deadLinks[l], stack: deadLinks[l] + '是死链接',
																		lastAlarmTime: 0, isAlarm: 1,
																		createTime: bookie.occurTime, occurTimeAndUi: [{time: bookie.occurTime, ui: bookie.ui}]
																	}).save(function (err) {
																			if (err) {
																				console.log(errorHandler.getErrorMessage(err));
																			}
																			console.log(Date.now());
																		});
																}
															} else {
																//报警并更新部分异常种类字段(报警条件：1、应用配置了该大类异常报警；2、改异常详细种类被设置为报警；3、异常的报警间隔大于应用配置的时间间隔)
																if((app.alarmtype.indexOf(bookie.type) !== -1) && (exception.isAlarm === 1) && ((new Date()).getTime() - exception.lastAlarmTime.getTime() >= app.alarmInterval )){

																	//临时存放exception对象，用于报警
																	var bookieObj2 = {
																		'type': 4,
																		'page': bookie.page,
																		'occurTime': bookie.occurTime,
																		'errorurl': '',
																		'requrl': deadLinks[l],
																		'message': '页面存在死链接' + deadLinks[l],
																		'stack': deadLinks[l] + '是死链接',
																		'ui': bookie.ui
																	};
																	mail.sendMail(app.alarmEmail, '异常报警',bookieObj2, app, page);

																	Exception.findOneAndUpdate({_id: exception._id}, {lastAlarmTime: new Date(), $push: {occurTimeAndUi: {time: bookie.occurTime, ui: bookie.ui}}}).exec(function (err){
																		if (err) {
																			return res.status(400).send({
																				message: errorHandler.getErrorMessage(err)
																			});
																		}
																	});
																} else {
																	Exception.findOneAndUpdate({_id: exception._id}, {$push: {occurTimeAndUi: {time: bookie.occurTime, ui: bookie.ui}}}).exec(function (err){
																		if (err) {
																			return res.status(400).send({
																				message: errorHandler.getErrorMessage(err)
																			});
																		}
																	});
																}
																console.log('alarm.....');
																console.log('update exception');
															}
														}
													});

												})(k);
											}
										},function (err){
											console.log(err);
										});
									}

								}

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
	var exception = req.body.exception ;


	Exception.findOneAndUpdate({_id: exception._id},{isAlarm:　exception.isAlarm},{upsert: true}).exec(function(err, exception) {
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
		page: {$in: pages}
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
					exceptionsAll: [],
					pieData: [],
					browserData: [0, 0, 0, 0, 0, 0],
					trendData:[],
					exceptionKinds: []
				}
			};


			//返回异常种类,注意这里查询出来的exceptions是异常的种类
			result.data.exceptionKinds = exceptions;

			//返回所有的异常历史记录，每次发生时间一条
			for (var i=0; i<exceptions.length; i++) {
				if(exceptions[i].occurTimeAndUi.length === 1){
					result.data.exceptions.push({_id: exceptions[i]._id, createTime: exceptions[i].createTime,
						occurTimeAndUi: exceptions[i].occurTimeAndUi[0], lastAlarmTime: exceptions[i].lastAlarmTime,
						page: exceptions[i].page, type: exceptions[i].type,
						errorurl: exceptions[i].errorurl,
						stack: exceptions[i].stack, message: exceptions[i].message,
						requrl: exceptions[i].requrl, isAlarm: exceptions[i].isAlarm
					});
				} else {
					for(var j=0; j<exceptions[i].occurTimeAndUi.length; j++){
						result.data.exceptions.push({_id: exceptions[i]._id, createTime: exceptions[i].createTime,
							occurTimeAndUi: exceptions[i].occurTimeAndUi[j], lastAlarmTime: exceptions[i].lastAlarmTime,
							page: exceptions[i].page, type: exceptions[i].type,
							errorurl: exceptions[i].errorurl,
							stack: exceptions[i].stack, message: exceptions[i].message,
							requrl: exceptions[i].requrl, isAlarm: exceptions[i].isAlarm
						});
					}
				}
			}

			//返回统计区间内的所有exception
			result.data.exceptionsAll = result.data.exceptions;

			//过滤并返回统计时间区间内的exceptions
			result.data.exceptions = result.data.exceptions.filter(function (elem){
				return staticDayGte <= elem.occurTimeAndUi.time &&  elem.occurTimeAndUi.time <= staticDayLt;
			});

			//返回当前时间异常分布曲线
			var timeDisData = statistics.timeDistribute(result.data.exceptions);
			result.data.trendData[0] = ((timeDisData !== null) ? timeDisData:[0]);

			//返回历史时间异常分布曲线数据
			var promise1 = Exception.find({
				page: {$in: pages}
			}).exec(function (err, exceptions) {
				var tempExceptions = [];
				for (var i=0; i<exceptions.length; i++) {
					if(exceptions[i].occurTimeAndUi.length === 1){
						tempExceptions.push({_id: exceptions[i]._id, createTime: exceptions[i].createTime,
							occurTimeAndUi: exceptions[i].occurTimeAndUi[0], lastAlarmTime: exceptions[i].lastAlarmTime,
							page: exceptions[i].page, type: exceptions[i].type,
							errorurl: exceptions[i].errorurl,
							stack: exceptions[i].stack, message: exceptions[i].message,
							requrl: exceptions[i].requrl, isAlarm: exceptions[i].isAlarm
						});
					} else {
						for(var j=0; j<exceptions[i].occurTimeAndUi.length; j++){
							tempExceptions.push({_id: exceptions[i]._id, createTime: exceptions[i].createTime,
								occurTimeAndUi: exceptions[i].occurTimeAndUi[j], lastAlarmTime: exceptions[i].lastAlarmTime,
								page: exceptions[i].page, type: exceptions[i].type,
								errorurl: exceptions[i].errorurl,
								stack: exceptions[i].stack, message: exceptions[i].message,
								requrl: exceptions[i].requrl, isAlarm: exceptions[i].isAlarm
							});
						}
					}
				}
				var historyTimeDis = statistics.historyTimeDist(tempExceptions);
				if(historyTimeDis){
					result.data.trendData[1] = historyTimeDis;
				}else{
					result.data.trendData[1] = [0];
				}

			});

			//返回异常JSON数据
			for(var k=0; k<result.data.exceptions.length; k++){
				var item = {};
				item.id = result.data.exceptions[k]._id;
				item.type = result.data.exceptions[k].type;
				item.time = result.data.exceptions[k].time;
				item.stack = result.data.exceptions[k].stack;
				item.message = result.data.exceptions[k].message;
				item.errorurl = result.data.exceptions[k].message;
				item.requrl = result.data.exceptions[k].requrl;
				item.occurTimeAndUi = result.data.exceptions[k].occurTimeAndUi;
				pieData[item.type-1].y++;

				//浏览器分布情况统计
				switch (result.data.exceptions[k].occurTimeAndUi.ui.browser){
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
			for(var l=0; l<pieData.length; l++){
				if(pieData[l].y !== 0){
					result.data.pieData.push(pieData[l]);
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
