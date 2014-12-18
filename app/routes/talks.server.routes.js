'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var talks = require('../../app/controllers/talks.server.controller');

	// Talks Routes
	app.route('/talks')
		.get(talks.list)
		.post(users.requiresLogin, talks.create);

	app.route('/talks/:talkId')
		.get(talks.read)
		.put(users.requiresLogin, talks.hasAuthorization, talks.update)
		.delete(users.requiresLogin, talks.hasAuthorization, talks.delete);

	// Finish by binding the Talk middleware
	app.param('talkId', talks.talkByID);
};
