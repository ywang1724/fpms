'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
    // Init Variables
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    if (user) {
        if (user.roles[0] === 'admin' && user._id.toString() !== req.body._id) {
            User.findById(req.body._id, '-password -salt', function (err, obj) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    user = _.extend(obj, req.body);
                    user.updated = Date.now();

                    user.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.json(user);
                        }
                    });
                }
            });
        } else {
            delete req.body.isActive;
            // Merge existing user
            user = _.extend(user, req.body);
            user.updated = Date.now();

            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    req.login(user, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            });
        }
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Send User
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};

/**
 * List of Users
 */
exports.list = function (req, res) {
    if (req.user.roles[0] === 'admin') {
        User.find(null, '-password -salt').exec(function (err, users) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(users);
            }
        });
    }
};
