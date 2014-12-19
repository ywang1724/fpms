'use strict';

module.exports = function(app) {
	// Routing logic   
    var rookie = require('../../app/controllers/rookie.server.controller');
    app.route('/rookie.js').get(rookie.index);
};
