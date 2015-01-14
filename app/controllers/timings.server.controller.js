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
    Q = require('q'),
    _ = require('lodash');

/**
 * Create a Timing
 */
exports.create = function (req, res) {
    if (req.session.appId) {
        var rookie = JSON.parse(decodeURI(req.url.substring(req.url.indexOf('?') + 1)));

        var promise1 = NavTiming.create(rookie.navTiming, function (err, saved) {
            if (err) {
                console.log(errorHandler.getErrorMessage(err));
            } else {
                rookie.navTiming = saved;
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
        var promise3 = App.findById(req.session.appId).exec(function (err, app) {
            if (err) {
                console.log(errorHandler.getErrorMessage(err));
            } else {
                rookie.app = app;
            }
        });

        Q.all([promise1, promise2, promise3]).then(function () {
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

    var options = {
            root: 'app/static/img/',
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
 * Update a Timing
 */
exports.update = function (req, res) {
    var timing = req.timing;

    timing = _.extend(timing, req.body);

    timing.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(timing);
        }
    });
};

/**
 * Delete an Timing
 */
exports.delete = function (req, res) {
    var timing = req.timing;

    timing.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(timing);
        }
    });
};

/**
 * List of Timings
 */
exports.list = function (req, res) {
    Timing.find().sort('-created').populate('user', 'displayName').exec(function (err, timings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(timings);
        }
    });
};

/**
 * Timing middleware
 */
exports.timingByID = function (req, res, next, id) {
    Timing.findById(id).populate('user', 'displayName').exec(function (err, timing) {
        if (err) return next(err);
        if (!timing) return next(new Error('Failed to load Timing ' + id));
        req.timing = timing;
        next();
    });
};

/**
 * Timing authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.timing.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

/**
 * 获取rookie.js
 */
exports.rookie = function (req, res) {
    var options = {
            root: 'app/static/dist/',
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
