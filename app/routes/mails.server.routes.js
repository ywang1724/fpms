'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mails = require('../../app/controllers/mails.server.controller');
	var exceptions = require('../../app/controllers/exceptions.server.controller');

	// Mails Routes
	app.route('/mails')
		.get(mails.list);


	app.route('/mails/:mailId')
		.get(mails.read)
		.put(users.requiresLogin, mails.hasAuthorization, mails.update)
		.delete(users.requiresLogin, mails.hasAuthorization, mails.delete);


	app.route('/mails/alarm/:exceptionId')
		.put(mails.manualAlarm);

	// Finish by binding the Mail middleware
	app.param('mailId', mails.mailByID);
	app.param('exceptionId', exceptions.exceptionByID);
};
