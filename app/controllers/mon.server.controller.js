'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    App = mongoose.model('App'),
    Mon = mongoose.model("Mon"),
    mime = require("mime");

/**
 * Create a App
 */

var gridfs;
/**
 * Show the current App
 */
var read = function (req, res) {
    res.jsonp(req.mon);
};
/**
 * List of Tasks
 */
var list = function (req, res) {
    var taskId = req.query.taskId;
    Mon.find({taskId: taskId}).exec(function (err, mons) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(mons);
        }
    });
};

var getFileById = function(req, res) {
    var fileId = req.query.fileId || "";
    gridfs.findOne({_id: fileId}, function (err, file) {
        if(err) res.json(err);
        if(!file) {
            res.send("file not found!");
        } else {
            var is = gridfs.createReadStream({
                _id: fileId
            });
            res.type(mime.lookup(file.filename));
            is.pipe(res);
        }
    })
}
/**
 * App middleware
 */
var monByID = function (req, res, next, id) {
    Mon.findById(id).populate('app', 'user').exec(function (err, mon) {
        if (err) return next(err);
        if (!mon) return next(new Error('Failed to load Mon ' + id));
        req.mon = mon;
        next();
    });
};


/** 传入gridfs **/
module.exports = function (gsf) {
    gridfs = gsf;
    return {
        read: read,
        getFileById: getFileById,
        list: list,
        monByID: monByID,
    }
}
