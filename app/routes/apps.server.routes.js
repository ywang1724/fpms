'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var apps = require('../../app/controllers/apps.server.controller');

	// Apps Routes
	app.route('/apps')
		.get(users.requiresLogin, apps.list)
		.post(users.requiresLogin, apps.create);

	app.route('/apps/:appId')
		.get(users.requiresLogin, apps.read)
		.put(users.requiresLogin, apps.hasAuthorization, apps.update)
		.delete(users.requiresLogin, apps.hasAuthorization, apps.delete);

	// Pages Routes
	app.route('/pages/:appId')
		.get(users.requiresLogin, apps.pageList);

	// Finish by binding the App middleware
	app.param('appId', apps.appByID);
};
