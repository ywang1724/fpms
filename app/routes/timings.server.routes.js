'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var timings = require('../../app/controllers/timings.server.controller');
	var apps = require('../../app/controllers/apps.server.controller');

	// Timings Routes
	app.route('/timings')
		.get(users.requiresLogin, timings.statisticList);

	app.route('/timings/:timingId')
		.get(users.requiresLogin, timings.read);

	app.route('/rookie.js/:appId').get(timings.rookie);
	app.route('/_fp.gif').get(timings.create);

	// Finish by binding the Timing middleware
	app.param('timingId', timings.timingByID);
	app.param('appId', apps.appByID);
};
