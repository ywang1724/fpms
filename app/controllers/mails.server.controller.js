'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mail = mongoose.model('Mail'),
	_ = require('lodash');

/**
 * Create a Mail
 */
exports.create = function(req, res) {
	var mail = new Mail(req.body);
	mail.user = req.user;

	mail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mail);
		}
	});
};

/**
 * Show the current Mail
 */
exports.read = function(req, res) {
	res.jsonp(req.mail);
};

/**
 * Update a Mail
 */
exports.update = function(req, res) {
	var mail = req.mail ;

	mail = _.extend(mail , req.body);

	mail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mail);
		}
	});
};

/**
 * Delete an Mail
 */
exports.delete = function(req, res) {
	var mail = req.mail ;

	mail.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mail);
		}
	});
};

/**
 * List of Mails
 */
exports.list = function(req, res) { 
	Mail.find().sort('-created').populate('user', 'displayName').exec(function(err, mails) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mails);
		}
	});
};

/**
 * Mail middleware
 */
exports.mailByID = function(req, res, next, id) { 
	Mail.findById(id).populate('user', 'displayName').exec(function(err, mail) {
		if (err) return next(err);
		if (! mail) return next(new Error('Failed to load Mail ' + id));
		req.mail = mail ;
		next();
	});
};

/**
 * Mail authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mail.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
