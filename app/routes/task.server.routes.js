'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var task = require('../controllers/task.server.controller.js')(app.get("gridfs"));
	// 应用路由
	app.route('/ui')
		.get(users.requiresLogin, task.list)
		.post(users.requiresLogin, task.create);

	app.route('/ui/:taskId')
		.get(users.requiresLogin, task.read)
		.put(users.requiresLogin, task.hasAuthorization, task.update)
		.delete(users.requiresLogin, task.hasAuthorization, task.delete);

    app.route('/uookie.js/:appId').get(task.uookie);
    app.route('/uookie.css/:appId').get(task.uookieCSS);
	app.route('/_ui.gif').get(task.addRule);
	// 绑定App中间件
	app.param('taskId', task.taskByID);

};
