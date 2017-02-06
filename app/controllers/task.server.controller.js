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

    task = _.extend(task, req.body);

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
    Mon.find({task: task._id}, function(err, mons) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            mons.forEach(function (mon) {
                mon.data && mon.data.forEach(function (file) {
                    // 删除监控图片和临时数据
                    gridfs.remove({_id: file}, function (err) {
                        if (err) console.err(err.toString());
                        console.log('file delete success');
                    });
                    mon.remove();
                })
            });

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
    }
}
