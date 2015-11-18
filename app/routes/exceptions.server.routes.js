'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var exceptions = require('../../app/controllers/exceptions.server.controller');

	// Exceptions Routes
	app.route('/exceptions')
		.get(exceptions.list)
		.post(users.requiresLogin, exceptions.create);

	app.route('/exceptions/:exceptionId')
		.get(exceptions.read)
		.put(users.requiresLogin, exceptions.hasAuthorization, exceptions.update)
		.delete(users.requiresLogin, exceptions.hasAuthorization, exceptions.delete);

	// Finish by binding the Exception middleware
	app.param('exceptionId', exceptions.exceptionByID);
};
