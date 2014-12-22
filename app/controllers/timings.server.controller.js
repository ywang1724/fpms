'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Timing = mongoose.model('Timing'),
	_ = require('lodash');

/**
 * Create a Timing
 */
exports.create = function(req, res) {
	var timing = new Timing(req.body);
	timing.user = req.user;

	timing.save(function(err) {
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
 * Show the current Timing
 */
exports.read = function(req, res) {
	res.jsonp(req.timing);
};

/**
 * Update a Timing
 */
exports.update = function(req, res) {
	var timing = req.timing;

	timing = _.extend(timing , req.body);

	timing.save(function(err) {
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
exports.delete = function(req, res) {
	var timing = req.timing ;

	timing.remove(function(err) {
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
exports.list = function(req, res) { 
	Timing.find().sort('-created').populate('user', 'displayName').exec(function(err, timings) {
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
exports.timingByID = function(req, res, next, id) { 
	Timing.findById(id).populate('user', 'displayName').exec(function(err, timing) {
		if (err) return next(err);
		if (! timing) return next(new Error('Failed to load Timing ' + id));
		req.timing = timing ;
		next();
	});
};

/**
 * Timing authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
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
		root: 'app/',
		dotfiles: 'allow',
		headers: {
			'Content-Type': 'text/javascript; charset=UTF-8',
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile('rookie.js', options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log('Sent:', 'rookie.js');
		}
	});
};
