'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    detect = require('./../tools/detect'),
    statistics = require('./../tools/statistics'),
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
                    //定义页面对象
                    var page = {};
                    //查找Web应用对应页面，如果存在则返回，如果不存在则新建
                    Page.findOneAndUpdate({app: app, pathname: rookie.pathname}, page, {upsert: true})
                        .exec(function (err, obj) {
                            if (err) {
                                console.log(errorHandler.getErrorMessage(err));
                            } else {
                                page = obj;
                                //新建导航计时文档
                                var promise1 = NavTiming.create(rookie.navTiming, function (err, saved) {
                                    if (err) {
                                        console.log(errorHandler.getErrorMessage(err));
                                    } else {
                                        rookie.navTiming = saved;
                                        rookie.totalTime = saved.loadEventEnd - saved.navigationStart;
                                    }
                                });
                                //新建资源计时文档
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
                                //页面和用户相关信息赋值
                                rookie.page = page;
                                rookie.ui = detect.getUserInformation(rookie.userAgent, rookie.platform, req.ip);
                                //按序存储数据
                                Q.all([promise1, promise2]).then(function () {
                                    new Timing(rookie).save(function (err) {
                                        if (err) {
                                            console.log(errorHandler.getErrorMessage(err));
                                        }
                                        console.log(Date.now());
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
    var pages = (typeof req.query.pageId === 'string') ? [req.query.pageId] : req.query.pageId,
        browsers = (req.query.browser === 'all') ? [new RegExp('.*', 'i'), null] : [req.query.browser];
    if (req.param('dateNumber')) {
        var gteDate = new Date(Number(req.param('dateNumber'))), ltDate;
        switch (req.param('interval')) {
            case 'day':
                ltDate = new Date(Date.UTC(gteDate.getFullYear(), gteDate.getMonth(), gteDate.getDate() + 1));
                break;
            case 'month':
                ltDate = new Date(Date.UTC(gteDate.getFullYear(), gteDate.getMonth() + 1));
                break;
            case 'year':
                ltDate = new Date(Date.UTC(gteDate.getFullYear() + 1, 0));
                break;
        }
        Timing.find({
            page: {$in: pages},
            'ui.browser': {$in: browsers},
            created: {
                $gte: gteDate,
                $lt: ltDate
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
            page: {$in: pages},
            'ui.browser': {$in: browsers},
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
                        redirectData: [],
                        dnsData: [],
                        connectData: [],
                        processingData: [],
                        onLoadData: [],
                        numData: [],
                        statisticData: {
                            sum: timings.length
                        }
                    },
                    buckets = {
                        pageLoad: {},
                        network: {},
                        backend: {},
                        frontend: {},
                        redirect: {},
                        dns: {},
                        connect: {},
                        processing: {},
                        onLoad: {}
                    },
                    key,
                    num = 0,
                    tempArr = {
                        pageLoad: [],
                        network: [],
                        backend: [],
                        frontend: [],
                        redirect: [],
                        dns: [],
                        connect: [],
                        processing: [],
                        onLoad: []
                    };
                if (timings.length > 0) {
                    for (var i = 0; i < timings.length; i++) {
                        var currentKey;
                        switch (req.param('interval')) {
                            case 'day':
                                currentKey = Date.UTC(timings[i].created.getFullYear(), timings[i].created.getMonth(),
                                    timings[i].created.getDate()).toString();
                                break;
                            case 'month':
                                currentKey = Date.UTC(timings[i].created.getFullYear(), timings[i].created.getMonth()).toString();
                                break;
                            case 'year':
                                currentKey = Date.UTC(timings[i].created.getFullYear(), 0).toString();
                                break;
                        }
                        var pageLoad = timings[i].navTiming.loadEventEnd - timings[i].navTiming.navigationStart,
                            network = timings[i].navTiming.connectEnd - timings[i].navTiming.navigationStart,
                            backend = timings[i].navTiming.responseEnd - timings[i].navTiming.requestStart,
                            frontend = timings[i].navTiming.loadEventEnd - timings[i].navTiming.domLoading,
                            redirect = timings[i].navTiming.redirectEnd - timings[i].navTiming.redirectStart,
                            dns = timings[i].navTiming.domainLookupEnd - timings[i].navTiming.domainLookupStart,
                            connect = timings[i].navTiming.connectEnd - timings[i].navTiming.connectStart,
                            processing = timings[i].navTiming.domComplete - timings[i].navTiming.domLoading,
                            onLoad = timings[i].navTiming.loadEventEnd - timings[i].navTiming.loadEventStart;
                        tempArr.pageLoad.push(pageLoad);
                        tempArr.network.push(network);
                        tempArr.backend.push(backend);
                        tempArr.frontend.push(frontend);
                        tempArr.redirect.push(redirect);
                        tempArr.dns.push(dns);
                        tempArr.connect.push(connect);
                        tempArr.processing.push(processing);
                        tempArr.onLoad.push(onLoad);
                        if (buckets.pageLoad[currentKey]) {
                            buckets.pageLoad[currentKey].push(pageLoad);
                            buckets.network[currentKey].push(network);
                            buckets.backend[currentKey].push(backend);
                            buckets.frontend[currentKey].push(frontend);
                            buckets.redirect[currentKey].push(redirect);
                            buckets.dns[currentKey].push(dns);
                            buckets.connect[currentKey].push(connect);
                            buckets.processing[currentKey].push(processing);
                            buckets.onLoad[currentKey].push(onLoad);
                            num++;
                        } else {
                            if (num > 0) {
                                switch (req.param('statistic')) {
                                    case 'mean':
                                        result.pageLoadData.push([Number(key), Number(statistics.mean(buckets.pageLoad[key]).toFixed(2))]);
                                        result.networkData.push([Number(key), Number(statistics.mean(buckets.network[key]).toFixed(2))]);
                                        result.backendData.push([Number(key), Number(statistics.mean(buckets.backend[key]).toFixed(2))]);
                                        result.frontendData.push([Number(key), Number(statistics.mean(buckets.frontend[key]).toFixed(2))]);
                                        result.redirectData.push([Number(key), Number(statistics.mean(buckets.redirect[key]).toFixed(2))]);
                                        result.dnsData.push([Number(key), Number(statistics.mean(buckets.dns[key]).toFixed(2))]);
                                        result.connectData.push([Number(key), Number(statistics.mean(buckets.connect[key]).toFixed(2))]);
                                        result.processingData.push([Number(key), Number(statistics.mean(buckets.processing[key]).toFixed(2))]);
                                        result.onLoadData.push([Number(key), Number(statistics.mean(buckets.onLoad[key]).toFixed(2))]);
                                        break;
                                    case 'median':
                                        result.pageLoadData.push([Number(key), Number(statistics.median(buckets.pageLoad[key]).toFixed(2))]);
                                        result.networkData.push([Number(key), Number(statistics.median(buckets.network[key]).toFixed(2))]);
                                        result.backendData.push([Number(key), Number(statistics.median(buckets.backend[key]).toFixed(2))]);
                                        result.frontendData.push([Number(key), Number(statistics.median(buckets.frontend[key]).toFixed(2))]);
                                        result.redirectData.push([Number(key), Number(statistics.median(buckets.redirect[key]).toFixed(2))]);
                                        result.dnsData.push([Number(key), Number(statistics.median(buckets.dns[key]).toFixed(2))]);
                                        result.connectData.push([Number(key), Number(statistics.median(buckets.connect[key]).toFixed(2))]);
                                        result.processingData.push([Number(key), Number(statistics.median(buckets.processing[key]).toFixed(2))]);
                                        result.onLoadData.push([Number(key), Number(statistics.median(buckets.onLoad[key]).toFixed(2))]);
                                        break;
                                    case 'quantile_90':
                                        result.pageLoadData.push([Number(key), Number(statistics.quantile(buckets.pageLoad[key], 0.9).toFixed(2))]);
                                        result.networkData.push([Number(key), Number(statistics.quantile(buckets.network[key], 0.9).toFixed(2))]);
                                        result.backendData.push([Number(key), Number(statistics.quantile(buckets.backend[key], 0.9).toFixed(2))]);
                                        result.frontendData.push([Number(key), Number(statistics.quantile(buckets.frontend[key], 0.9).toFixed(2))]);
                                        result.redirectData.push([Number(key), Number(statistics.quantile(buckets.redirect[key], 0.9).toFixed(2))]);
                                        result.dnsData.push([Number(key), Number(statistics.quantile(buckets.dns[key], 0.9).toFixed(2))]);
                                        result.connectData.push([Number(key), Number(statistics.quantile(buckets.connect[key], 0.9).toFixed(2))]);
                                        result.processingData.push([Number(key), Number(statistics.quantile(buckets.processing[key], 0.9).toFixed(2))]);
                                        result.onLoadData.push([Number(key), Number(statistics.quantile(buckets.onLoad[key], 0.9).toFixed(2))]);
                                        break;
                                }
                                result.numData.push([Number(key), num]);
                            }
                            key = currentKey;
                            num = 1;
                            buckets.pageLoad[currentKey] = [pageLoad];
                            buckets.network[currentKey] = [network];
                            buckets.backend[currentKey] = [backend];
                            buckets.frontend[currentKey] = [frontend];
                            buckets.redirect[currentKey] = [redirect];
                            buckets.dns[currentKey] = [dns];
                            buckets.connect[currentKey] = [connect];
                            buckets.processing[currentKey] = [processing];
                            buckets.onLoad[currentKey] = [onLoad];
                        }
                    }
                    switch (req.param('statistic')) {
                        case 'mean':
                            result.pageLoadData.push([Number(key), Number(statistics.mean(buckets.pageLoad[key]).toFixed(2))]);
                            result.networkData.push([Number(key), Number(statistics.mean(buckets.network[key]).toFixed(2))]);
                            result.backendData.push([Number(key), Number(statistics.mean(buckets.backend[key]).toFixed(2))]);
                            result.frontendData.push([Number(key), Number(statistics.mean(buckets.frontend[key]).toFixed(2))]);
                            result.redirectData.push([Number(key), Number(statistics.mean(buckets.redirect[key]).toFixed(2))]);
                            result.dnsData.push([Number(key), Number(statistics.mean(buckets.dns[key]).toFixed(2))]);
                            result.connectData.push([Number(key), Number(statistics.mean(buckets.connect[key]).toFixed(2))]);
                            result.processingData.push([Number(key), Number(statistics.mean(buckets.processing[key]).toFixed(2))]);
                            result.onLoadData.push([Number(key), Number(statistics.mean(buckets.onLoad[key]).toFixed(2))]);
                            result.statisticData.pageLoad = statistics.mean(tempArr.pageLoad).toFixed(2);
                            result.statisticData.network = statistics.mean(tempArr.network).toFixed(2);
                            result.statisticData.backend = statistics.mean(tempArr.backend).toFixed(2);
                            result.statisticData.frontend = statistics.mean(tempArr.frontend).toFixed(2);
                            result.statisticData.redirect = statistics.mean(tempArr.redirect).toFixed(2);
                            result.statisticData.dns = statistics.mean(tempArr.dns).toFixed(2);
                            result.statisticData.connect = statistics.mean(tempArr.connect).toFixed(2);
                            result.statisticData.processing = statistics.mean(tempArr.processing).toFixed(2);
                            result.statisticData.onLoad = statistics.mean(tempArr.onLoad).toFixed(2);
                            break;
                        case 'median':
                            result.pageLoadData.push([Number(key), Number(statistics.median(buckets.pageLoad[key]).toFixed(2))]);
                            result.networkData.push([Number(key), Number(statistics.median(buckets.network[key]).toFixed(2))]);
                            result.backendData.push([Number(key), Number(statistics.median(buckets.backend[key]).toFixed(2))]);
                            result.frontendData.push([Number(key), Number(statistics.median(buckets.frontend[key]).toFixed(2))]);
                            result.redirectData.push([Number(key), Number(statistics.median(buckets.redirect[key]).toFixed(2))]);
                            result.dnsData.push([Number(key), Number(statistics.median(buckets.dns[key]).toFixed(2))]);
                            result.connectData.push([Number(key), Number(statistics.median(buckets.connect[key]).toFixed(2))]);
                            result.processingData.push([Number(key), Number(statistics.median(buckets.processing[key]).toFixed(2))]);
                            result.onLoadData.push([Number(key), Number(statistics.median(buckets.onLoad[key]).toFixed(2))]);
                            result.statisticData.pageLoad = statistics.median(tempArr.pageLoad).toFixed(2);
                            result.statisticData.network = statistics.median(tempArr.network).toFixed(2);
                            result.statisticData.backend = statistics.median(tempArr.backend).toFixed(2);
                            result.statisticData.frontend = statistics.median(tempArr.frontend).toFixed(2);
                            result.statisticData.redirect = statistics.median(tempArr.redirect).toFixed(2);
                            result.statisticData.dns = statistics.median(tempArr.dns).toFixed(2);
                            result.statisticData.connect = statistics.median(tempArr.connect).toFixed(2);
                            result.statisticData.processing = statistics.median(tempArr.processing).toFixed(2);
                            result.statisticData.onLoad = statistics.median(tempArr.onLoad).toFixed(2);
                            break;
                        case 'quantile_90':
                            result.pageLoadData.push([Number(key), Number(statistics.quantile(buckets.pageLoad[key], 0.9).toFixed(2))]);
                            result.networkData.push([Number(key), Number(statistics.quantile(buckets.network[key], 0.9).toFixed(2))]);
                            result.backendData.push([Number(key), Number(statistics.quantile(buckets.backend[key], 0.9).toFixed(2))]);
                            result.frontendData.push([Number(key), Number(statistics.quantile(buckets.frontend[key], 0.9).toFixed(2))]);
                            result.redirectData.push([Number(key), Number(statistics.quantile(buckets.redirect[key], 0.9).toFixed(2))]);
                            result.dnsData.push([Number(key), Number(statistics.quantile(buckets.dns[key], 0.9).toFixed(2))]);
                            result.connectData.push([Number(key), Number(statistics.quantile(buckets.connect[key], 0.9).toFixed(2))]);
                            result.processingData.push([Number(key), Number(statistics.quantile(buckets.processing[key], 0.9).toFixed(2))]);
                            result.onLoadData.push([Number(key), Number(statistics.quantile(buckets.onLoad[key], 0.9).toFixed(2))]);
                            result.statisticData.pageLoad = statistics.quantile(tempArr.pageLoad, 0.9).toFixed(2);
                            result.statisticData.network = statistics.quantile(tempArr.network, 0.9).toFixed(2);
                            result.statisticData.backend = statistics.quantile(tempArr.backend, 0.9).toFixed(2);
                            result.statisticData.frontend = statistics.quantile(tempArr.frontend, 0.9).toFixed(2);
                            result.statisticData.redirect = statistics.quantile(tempArr.redirect, 0.9).toFixed(2);
                            result.statisticData.dns = statistics.quantile(tempArr.dns, 0.9).toFixed(2);
                            result.statisticData.connect = statistics.quantile(tempArr.connect, 0.9).toFixed(2);
                            result.statisticData.processing = statistics.quantile(tempArr.processing, 0.9).toFixed(2);
                            result.statisticData.onLoad = statistics.quantile(tempArr.onLoad, 0.9).toFixed(2);
                            break;
                    }
                    result.numData.push([Number(key), num]);
                }
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
        fileName = 'rookie.js';
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
