'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var apps = require('../../app/controllers/apps.server.controller');

	// 应用路由
	app.route('/apps')
		.get(users.requiresLogin, apps.list)
		.post(users.requiresLogin, apps.create);

	app.route('/apps/:appId')
		.get(users.requiresLogin, apps.read)
		.put(users.requiresLogin, apps.hasAuthorization, apps.update)
		.delete(users.requiresLogin, apps.hasAuthorization, apps.delete);

	// 页面路由
	app.route('/pages/:appId')
		.get(users.requiresLogin, apps.pageList);

	// 绑定App中间件
	app.param('appId', apps.appByID);
};
