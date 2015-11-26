'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    App = mongoose.model('App'),
    Page = mongoose.model('Page'),
    Exception = mongoose.model('Exception'),
    Timing = mongoose.model('Timing'),
    NavTiming = mongoose.model('NavTiming'),
    ResTiming = mongoose.model('ResTiming'),
    _ = require('lodash');

/**
 * Create a App
 */
exports.create = function (req, res) {
    var app = new App(req.body);
    app.user = req.user;

    app.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(app);
        }
    });
};

/**
 * Show the current App
 */
exports.read = function (req, res) {
    res.jsonp(req.app);
};

/**
 * Update a App
 */
exports.update = function (req, res) {
    var app = req.app;

    app = _.extend(app, req.body);

    app.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(app);
        }
    });
};

/**
 * Delete an App
 */
exports.delete = function (req, res) {
    var app = req.app,
        tfCallback = function (err, timings) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                for (var j = 0; j < timings.length; j++) {
                    NavTiming.findById(timings[j].navTiming).remove(errCallback);
                    ResTiming.find({_id: {$in: timings[j].resTimings}}).remove(errCallback);
                    timings[j].remove();
                }
            }
        },
        errCallback = function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        };

    Page.find({app: req.app.id}).exec(function (err, pages) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            for (var i = 0; i < pages.length; i++) {
                Timing.find({page: pages[i].id}).exec(tfCallback);
                pages[i].remove();
            }
        }
    });
    app.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(app);
        }
    });
};

/**
 * List of Apps
 */
exports.list = function (req, res) {
    if (req.user.roles[0] === 'admin') {
        App.find().populate('user', 'displayName').exec(function (err, apps) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(apps);
            }
        });
    } else {
        App.find({user: req.user.id}).populate('user', 'displayName').exec(function (err, apps) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(apps);
            }
        });
    }
};

/**
 * App middleware
 */
exports.appByID = function (req, res, next, id) {
    App.findById(id).populate('user', 'displayName').exec(function (err, app) {
        if (err) return next(err);
        if (!app) return next(new Error('Failed to load App ' + id));
        req.app = app;
        next();
    });
};

/**
 * App authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.app.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

/**
 * List of Pages
 */
exports.pageList = function (req, res) {
    Page.find({app: req.app.id}, '_id pathname').exec(function (err, pages) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pages);
        }
    });
};

/**
 * delete A page
 */
exports.pageDelete = function (req, res){
    var app = req.app;
    var pageId = req.query.pageId;

    Exception.find({page: pageId}).exec(function (err, exceptions) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            for (var i = 0; i < exceptions.length; i++) {
                exceptions[i].remove();
            }
        }
    });

    Page.find({'_id': pageId}).remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(app);
        }
    });
};
