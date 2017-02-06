/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/6
 */
'use strict';

var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Behavior = mongoose.model('Behavior');
var App = mongoose.model('App');


/**
 * Create a behavior
 */
exports.create = function (req, res) {
  if(req.session.appId) {
    App.findById(req.session.appId).exec(function (err, app) {
      if(err) {
        console.log(errorHandler.getErrorMessage(err));
      } else {

      }
    })
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
    fileName = '_ub.gif';
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

/**
 * behavior middleware
 */
exports.behaviorByID = function(req, res, next, id) {
  Behavior.findById(id).populate('user', 'displayName').exec(function(err, behavior) {
    if (err) return next(err);
    if (! behavior) return next(new Error('Failed to load Exception ' + id));
    req.behavior = behavior ;
    next();
  });
};

/**
 * 获取behavior.js
 */
exports.behavior = function (req, res) {
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
    fileName = 'behavior.js';
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
