'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
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
                if (app.server === req._remoteAddress) {
                    var rookie = JSON.parse(decodeURI(req.url.substring(req.url.indexOf('?') + 1))),
                        page = {};
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
                console.log('304 cache hit for ' + fileName);
                return;
            }
            console.log(err);
            res.status(err.status).end();
        } else {
            console.log('Sent:', fileName);
        }
    });
};

/**
 * Show the current Timing
 */
exports.read = function (req, res) {
    res.jsonp(req.timing);
};

/**
 * List of Timings
 */
exports.list = function (req, res) {
    Timing.find({
        page: req.param('pageId'),
        created: { $gte: new Date(req.param('fromDate')), $lt: new Date(req.param('untilDate')) }
    }).sort('created').populate('navTiming').exec(function (err, timings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var result = {
                    data: []
                },
                buckets = {},
                key,
                num = 0;
            for (var i = 0; i < timings.length; i++) {
                var currentKey = Date.UTC(timings[i].created.getFullYear(), timings[i].created.getMonth(),
                    timings[i].created.getDate()).toString(),
                    value = timings[i].navTiming.loadEventEnd - timings[i].navTiming.navigationStart;
                if (buckets[currentKey]) {
                    buckets[currentKey] = value + buckets[currentKey];
                    num++;
                } else {
                    if (num > 0) {
                        result.data.push([Number(key), buckets[key] / num]);
                    }
                    key = currentKey;
                    num = 1;
                    buckets[currentKey] = value;
                }
            }
            res.jsonp(result);//just for test
        }
    });
};

/**
 * Timing middleware
 */
exports.timingByID = function (req, res, next, id) {
    Timing.findById(id).populate('app', 'name').exec(function (err, timing) {
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
                console.log('304 cache hit for ' + fileName);
                return;
            }
            console.log(err);
            res.status(err.status).end();
        } else {
            console.log('Sent:', fileName);
        }
    });
};
