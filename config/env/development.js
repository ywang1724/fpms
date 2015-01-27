'use strict';

var env = require('./../../env.json');

module.exports = {
	db: 'mongodb://' + env.DB_DEV_USERNAME + ':' + env.DB_DEV_PASSWORD + '@localhost/fpms-dev',
	app: {
		title: 'FPMS - Development Environment'
	}
};
