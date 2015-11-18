'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Exception = mongoose.model('Exception'),
	_ = require('lodash');

/**
 * Create a Exception
 */
exports.create = function(req, res) {
	var exception = new Exception(req.body);
	exception.user = req.user;

	exception.save(function(err) {
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
 * Show the current Exception
 */
exports.read = function(req, res) {
	res.jsonp(req.exception);
};

/**
 * Update a Exception
 */
exports.update = function(req, res) {
	var exception = req.exception ;

	exception = _.extend(exception , req.body);

	exception.save(function(err) {
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
