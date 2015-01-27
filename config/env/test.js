'use strict';

var env = require('./../../env.json');

module.exports = {
	db: 'mongodb://' + env.DB_TEST_USERNAME + ':' + env.DB_TEST_PASSWORD + '@localhost/fpms-test',
	port: 3001,
	app: {
		title: 'FPMS - Test Environment'
	}
};
