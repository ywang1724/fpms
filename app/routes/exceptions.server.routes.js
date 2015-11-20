'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var exceptions = require('../../app/controllers/exceptions.server.controller');
	var apps = require('../../app/controllers/apps.server.controller');

	// Exceptions Routes
	app.route('/exceptions')
		.get(users.requiresLogin, exceptions.statisticList)
		.post(users.requiresLogin, exceptions.create);

	app.route('/exceptions/:exceptionId')
		.get(exceptions.read)
		.put(users.requiresLogin, exceptions.hasAuthorization, exceptions.update)
		.delete(users.requiresLogin, exceptions.hasAuthorization, exceptions.delete);


	app.route('/bookie.js/:appId').get(exceptions.bookie);
	app.route('/_fe.gif').get(exceptions.create);

	// Finish by binding the Exception middleware
	app.param('exceptionId', exceptions.exceptionByID);
	app.param('appId', apps.appByID);
};
