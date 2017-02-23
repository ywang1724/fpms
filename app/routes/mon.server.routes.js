'use strict';
var mongoose = require("mongoose"),
	Task = mongoose.model('Task'),
	App = mongoose.model('App'),
	User = mongoose.model('User');
module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mon = require('../controllers/mon.server.controller.js')(app.get("gridfs"));
	// 应用路由
	app.route('/mon')
		.get(users.requiresLogin, mon.list);

    app.route("/mon/getFile")
        .get(users.requiresLogin, mon.getFileById);

	app.route('/mon/:monId')
		.get(users.requiresLogin, mon.read);
	// 绑定App中间件

	app.param('monId', mon.monByID);

};
