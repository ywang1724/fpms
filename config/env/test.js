'use strict';

var env = require('./../../env.json');

module.exports = {
	db: 'mongodb://localhost/fpms-test',
	port: 3001,
	app: {
		title: 'FPMS - Test Environment'
	},
	mailer: {
		from: env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			},
			host: env.MAILER_HOST || 'MAILER_HOST'
		}
	}
};
