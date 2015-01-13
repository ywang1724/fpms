'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var timings = require('../../app/controllers/timings.server.controller');
	var apps = require('../../app/controllers/apps.server.controller');

	// Timings Routes
	/*app.route('/timings')
		.get(timings.list)
		.post(users.requiresLogin, timings.create);

	app.route('/timings/:timingId')
		.get(timings.read)
		.put(users.requiresLogin, timings.hasAuthorization, timings.update)
		.delete(users.requiresLogin, timings.hasAuthorization, timings.delete);*/

	app.route('/rookie.js/:appId').get(timings.rookie);
	app.route('/_fp.gif').get(timings.create);

	app.route('/timings/:appId')
		.post(timings.create);

	// Finish by binding the Timing middleware
	/*app.param('timingId', timings.timingByID);*/
	app.param('appId', apps.appByID);
};
