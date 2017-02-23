'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    App = mongoose.model('App'),
    Task = mongoose.model('Task'),
    Mon = mongoose.model("Mon"),
    _ = require('lodash');


/**
 * Create a App
 */
var gridfs;
var create = function (req, res) {
    var task = new Task(req.body);
    req.task = task;
    task.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * Show the current App
 */
var read = function (req, res) {
    res.jsonp(req.task);
};

/**
 * Update a App
 */
var update = function (req, res) {
    var task = req.task;
    if(_.isEqual(task.diffRules, req.body.diffRules)) {
        task = _.extend(task, req.body);
    } else {
        task = _.extend(task, req.body, {base: null}); //diffRule变更了，重置base页面
    }
    task.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * 删除任务
 */
var remove = function (req, res) {
    var task = req.task;
    Mon.find({taskId: task._id}, function(err, mons) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            _.forEach(mons, function(mon){
                mon.data && _.forEach(mon.data.toObject(), function(value, key){
                    value && gridfs.remove({_id: value.toString()}, function (err) {
                        if (err) console.err(err.toString());
                        console.log('file delete success');
                    });
                    mon.remove();
                })
            })

            task.remove(function(err){
                if(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(task);
                }
            })
        }
    })

};

/**
 * List of Tasks
 */
var list = function (req, res) {
    var appId = req.query.appId;
    Task.find({app: appId}).exec(function (err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tasks);
        }
    });
};

/**
 * App middleware
 */
var taskByID = function (req, res, next, id) {
    Task.findById(id).populate('app', 'user').exec(function (err, task) {
        if (err) return next(err);
        if (!task) return next(new Error('Failed to load Task ' + id));
        req.task = task;
        next();
    });
};

/**
 * App authorization middleware
 */
var hasAuthorization = function (req, res, next) {
    if (req.task.app.user.toString() !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
/**
 * 获取bookie.js
 */
var uookie = function (req, res) {
    if (!req.isAuthenticated() || !req.user.isActive ) {
        res.type("text/javascript");
        res.send("");
        return;
    }
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
        fileName = 'ui.js';
    //存储appId到session
    req.session.appId = req.app._id;
    //发送文件
    App.findById(req.app._id, function (err, app) {
        if (app.config.ui) {
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
        } else {
            res.type("text/javascript");
            res.send("");
        }
    })

};
var uookieCSS = function (req, res) {
    //配置文件参数

    var options = {
            root: process.env.NODE_ENV === 'production' ? 'static/dist/' : 'static/css',
            dotfiles: 'allow',
            headers: {
                'Content-Type': 'text/css; charset=UTF-8',
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        },
        fileName = 'uookie.css';
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

var addRule = function(req, res) {
     if (req.session.appId) {
          App.findById(req.session.appId).exec(function (err, app) {
            if (err) {
                console.log(errorHandler.getErrorMessage(err));
            } else {
                var uookie = JSON.parse(decodeURIComponent(req.url.substring(req.url.indexOf('?') + 1)));
                Task.findOne({app: req.session.appId, url: uookie.pageUrl}, function(err, task) {
                    if(uookie.type == "diff") {
                        var _diffRules = _.extend({}, task.diffRules);
                        task.diffRules.push(uookie.rule)
                        task.diffRules = _.unique(task.diffRules);
                        if(!_.isEqual(task.diffRules, _diffRules)) {
                            task.base = null; // 规则变更了充值base页面
                        }
                        task.save(function(err){
                            if (err) {
                                console.log(errorHandler.getErrorMessage(err));
                            } 
                        });
                    } else if(uookie.type == "dom") {
                        task.domRules = _.unique(task.domRules.concat(uookie.rule), 'selector');
                        console.log(task.domRules);
                        task.save(function(err){
                            if (err) {
                                console.log(errorHandler.getErrorMessage(err));
                            } 
                        });
                    }
                    
                })
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
        fileName = '_ui.gif';

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
}
/** 传入gridfs **/
module.exports = function (gsf) {
    gridfs = gsf;
    return {
        create: create,
        read: read,
        update: update,
        delete: remove,
        list: list,
        taskByID: taskByID,
        hasAuthorization: hasAuthorization,
        uookie: uookie,
        uookieCSS: uookieCSS,
        addRule: addRule
    }
}
