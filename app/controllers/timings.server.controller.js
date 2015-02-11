'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    detect = require('./../tools/detect'),
    Timing = mongoose.model('Timing'),
    NavTiming = mongoose.model('NavTiming'),
    ResTiming = mongoose.model('ResTiming'),
    App = mongoose.model('App'),
    Page = mongoose.model('Page'),
    Q = require('q'),
    _ = require('lodash');

/**
 * Create a Timing
 */
exports.create = function (req, res) {
    if (req.session.appId) {
        App.findById(req.session.appId).exec(function (err, app) {
            if (err) {
                console.log(errorHandler.getErrorMessage(err));
            } else {
                var rookie = JSON.parse(decodeURI(req.url.substring(req.url.indexOf('?') + 1)));
                if (rookie.appHost === app.host) {
                    var page = {};
                    Page.findOneAndUpdate({app: app, pathname: rookie.pathname}, page, {upsert: true})
                        .exec(function (err, obj) {
                            if (err) {
                                console.log(errorHandler.getErrorMessage(err));
                            } else {
                                page = obj;
                                var promise1 = NavTiming.create(rookie.navTiming, function (err, saved) {
                                    if (err) {
                                        console.log(errorHandler.getErrorMessage(err));
                                    } else {
                                        rookie.navTiming = saved;
                                        rookie.totalTime = saved.loadEventEnd - saved.navigationStart;
                                    }
                                });
                                var promise2 = ResTiming.create(rookie.resTimings, function (err) {
                                    if (err) {
                                        console.log(errorHandler.getErrorMessage(err));
                                    } else {
                                        rookie.resTimings = [];
                                        for (var i = 1; i < arguments.length; i++) {
                                            rookie.resTimings.push(arguments[i]);
                                        }
                                    }
                                });
                                rookie.page = page;
                                rookie.ui = detect.getUserInformation(rookie.userAgent, rookie.platform, req.ip);
                                Q.all([promise1, promise2]).then(function () {
                                    new Timing(rookie).save(function (err) {
                                        if (err) {
                                            console.log(errorHandler.getErrorMessage(err));
                                        }
                                    });
                                }, function (err) {
                                    if (err) {
                                        console.log(errorHandler.getErrorMessage(err));
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
 * Show the current Timing
 */
exports.read = function (req, res) {
    var result = {
        errs: req.timing.errs,
        initiatorTypes: {}
    };
    if (req.timing.errs.length === 0) {
        result.allResourcesCalc = req.timing.resTimings.map(function (currR) {
            var isRequest = currR.name.indexOf('http') === 0,
                urlFragments, maybeFileName, fileExtension;

            if (isRequest) {
                urlFragments = currR.name.match(/:\/\/(.[^/]+)([^?]*)\??(.*)/);
                maybeFileName = urlFragments[2].split('/').pop();
                fileExtension = maybeFileName.substr((Math.max(0, maybeFileName.lastIndexOf('.')) || Infinity) + 1);
            } else {
                urlFragments = ['', req.ip];
                fileExtension = currR.name.split(':')[0];
            }

            var currRes = {
                name: currR.name,
                domain: urlFragments[1],
                initiatorType: currR.initiatorType || fileExtension || 'SourceMap或未定义',
                fileExtension: fileExtension || 'Ajax请求或未定义',
                loadtime: (currR.duration).toFixed(2),
                isRequestToHost: urlFragments[1] === req.ip
            };

            if (currR.requestStart) {
                currRes.requestStartDelay = (currR.requestStart - currR.startTime).toFixed(2);
                currRes.dns = (currR.domainLookupEnd - currR.domainLookupStart).toFixed(2);
                currRes.tcp = (currR.connectEnd - currR.connectStart).toFixed(2);
                currRes.ttfb = (currR.responseStart - currR.startTime).toFixed(2);
                currRes.requestDuration = (currR.responseStart - currR.requestStart).toFixed(2);
            }
            if (currR.secureConnectionStart) {
                currRes.ssl = (currR.connectEnd - currR.secureConnectionStart).toFixed(2);
            }

            return currRes;
        });
    }
    res.jsonp(result);
};

/**
 * List of Timings
 */
exports.statisticList = function (req, res) {
    if (req.param('dateNumber')) {
        Timing.find({
            page: req.param('pageId'),
            created: {
                $gte: new Date(Number(req.param('dateNumber'))),
                $lt: new Date(Number(req.param('dateNumber')) + 86400000)
            }
        }).sort('created').populate('navTiming').exec(function (err, timings) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var result = {
                    data: []
                };
                for (var i = 0; i < timings.length; i++) {
                    var item = {};
                    item.id = timings[i]._id;
                    item.created = timings[i].created;
                    item.pageLoad = timings[i].navTiming.loadEventEnd - timings[i].navTiming.navigationStart;
                    item.network = timings[i].navTiming.connectEnd - timings[i].navTiming.navigationStart;
                    item.backend = timings[i].navTiming.responseEnd - timings[i].navTiming.requestStart;
                    item.frontend = timings[i].navTiming.loadEventEnd - timings[i].navTiming.domLoading;
                    item.redirect = timings[i].navTiming.redirectEnd - timings[i].navTiming.redirectStart;
                    item.dns = timings[i].navTiming.domainLookupEnd - timings[i].navTiming.domainLookupStart;
                    item.connect = timings[i].navTiming.connectEnd - timings[i].navTiming.connectStart;
                    item.processing = timings[i].navTiming.domComplete - timings[i].navTiming.domLoading;
                    item.onLoad = timings[i].navTiming.loadEventEnd - timings[i].navTiming.loadEventStart;
                    item.ip = timings[i].ui.ip;
                    item.browser = (timings[i].ui.browser + ' ' + timings[i].ui.version).trim();
                    item.os = (timings[i].ui.os + ' ' + timings[i].ui.osversion).trim();
                    result.data.push(item);
                }
                res.jsonp(result);
            }
        });
    } else {
        Timing.find({
            page: req.param('pageId'),
            created: {$gte: new Date(req.param('fromDate')), $lt: new Date(req.param('untilDate'))}
        }).sort('created').populate('navTiming').exec(function (err, timings) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var result = {
                        pageLoadData: [],
                        networkData: [],
                        backendData: [],
                        frontendData: [],
                        numData: [],
                        statisticData: {
                            sum: timings.length,
                            pageLoad: 0,
                            network: 0,
                            backend: 0,
                            frontend: 0
                        }
                    },
                    buckets = {
                        pageLoad: {},
                        network: {},
                        backend: {},
                        frontend: {}
                    },
                    key,
                    num = 0;
                for (var i = 0; i < timings.length; i++) {
                    var currentKey = Date.UTC(timings[i].created.getFullYear(), timings[i].created.getMonth(),
                            timings[i].created.getDate()).toString(),
                        pageLoad = timings[i].navTiming.loadEventEnd - timings[i].navTiming.navigationStart,
                        network = timings[i].navTiming.connectEnd - timings[i].navTiming.navigationStart,
                        backend = timings[i].navTiming.responseEnd - timings[i].navTiming.requestStart,
                        frontend = timings[i].navTiming.loadEventEnd - timings[i].navTiming.domLoading;
                    result.statisticData.pageLoad += pageLoad;
                    result.statisticData.network += network;
                    result.statisticData.backend += backend;
                    result.statisticData.frontend += frontend;
                    if (buckets.pageLoad[currentKey]) {
                        buckets.pageLoad[currentKey] = pageLoad + buckets.pageLoad[currentKey];
                        buckets.network[currentKey] = network + buckets.network[currentKey];
                        buckets.backend[currentKey] = backend + buckets.backend[currentKey];
                        buckets.frontend[currentKey] = frontend + buckets.frontend[currentKey];
                        num++;
                    } else {
                        if (num > 0) {
                            result.pageLoadData.push([Number(key), Number((buckets.pageLoad[key] / num).toFixed(2))]);
                            result.networkData.push([Number(key), Number((buckets.network[key] / num).toFixed(2))]);
                            result.backendData.push([Number(key), Number((buckets.backend[key] / num).toFixed(2))]);
                            result.frontendData.push([Number(key), Number((buckets.frontend[key] / num).toFixed(2))]);
                            result.numData.push([Number(key), num]);
                        }
                        key = currentKey;
                        num = 1;
                        buckets.pageLoad[currentKey] = pageLoad;
                        buckets.network[currentKey] = network;
                        buckets.backend[currentKey] = backend;
                        buckets.frontend[currentKey] = frontend;
                    }
                }
                result.pageLoadData.push([Number(key), Number((buckets.pageLoad[key] / num).toFixed(2))]);
                result.networkData.push([Number(key), Number((buckets.network[key] / num).toFixed(2))]);
                result.backendData.push([Number(key), Number((buckets.backend[key] / num).toFixed(2))]);
                result.frontendData.push([Number(key), Number((buckets.frontend[key] / num).toFixed(2))]);
                result.numData.push([Number(key), num]);
                result.statisticData.pageLoad = (result.statisticData.pageLoad / result.statisticData.sum).toFixed(2);
                result.statisticData.network = (result.statisticData.network / result.statisticData.sum).toFixed(2);
                result.statisticData.backend = (result.statisticData.backend / result.statisticData.sum).toFixed(2);
                result.statisticData.frontend = (result.statisticData.frontend / result.statisticData.sum).toFixed(2);
                res.jsonp(result);
            }
        });
    }
};

/**
 * Timing middleware
 */
exports.timingByID = function (req, res, next, id) {
    Timing.findById(id).populate('navTiming').populate('resTimings').exec(function (err, timing) {
        if (err) return next(err);
        if (!timing) return next(new Error('Failed to load Timing ' + id));
        req.timing = timing;
        next();
    });
};

/**
 * 获取rookie.js
 */
exports.rookie = function (req, res) {
    var options = {
            root: process.env.NODE_ENV === 'production' ? 'static/dist/' : 'static/js/',
            dotfiles: 'allow',
            headers: {
                'Content-Type': 'text/javascript; charset=UTF-8',
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        },
        fileName = 'rookie.js';
    req.session.appId = req.app._id;
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
