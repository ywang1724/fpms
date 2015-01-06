'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	App = mongoose.model('App'),
	_ = require('lodash');

/**
 * Create a App
 */
exports.create = function(req, res) {
	var app = new App(req.body);
	app.user = req.user;

	app.save(function(err) {
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
exports.read = function(req, res) {
	res.jsonp(req.app);
};

/**
 * Update a App
 */
exports.update = function(req, res) {
	var app = req.app ;

	app = _.extend(app , req.body);

	app.save(function(err) {
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
exports.delete = function(req, res) {
	var app = req.app ;

	app.remove(function(err) {
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
exports.list = function(req, res) { 
	App.find().sort('-created').populate('user', 'displayName').exec(function(err, apps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(apps);
		}
	});
};

/**
 * App middleware
 */
exports.appByID = function(req, res, next, id) { 
	App.findById(id).populate('user', 'displayName').exec(function(err, app) {
		if (err) return next(err);
		if (! app) return next(new Error('Failed to load App ' + id));
		req.app = app ;
		next();
	});
};

/**
 * App authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.app.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
