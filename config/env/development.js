'use strict';

var env = require('./../../env.json');

module.exports = {
	db: 'mongodb://' + env.DB_DEV_USERNAME + ':' + env.DB_DEV_PASSWORD + '@127.0.0.1/fpms',
    adminAccount_init: env.adminAccount_init,
    rabbitURI: env.rabbitURI,
	app: {
		title: 'FPMS - Development Environment'
	}
};
