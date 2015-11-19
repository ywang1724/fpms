'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mails = require('../../app/controllers/mails.server.controller');

	// Mails Routes
	app.route('/mails')
		.get(mails.list)
		.post(users.requiresLogin, mails.create);

	app.route('/mails/:mailId')
		.get(mails.read)
		.put(users.requiresLogin, mails.hasAuthorization, mails.update)
		.delete(users.requiresLogin, mails.hasAuthorization, mails.delete);

	// Finish by binding the Mail middleware
	app.param('mailId', mails.mailByID);
};
