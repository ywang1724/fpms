'use strict';

/**
 * 依赖模块
 */
var passport = require('passport');

module.exports = function(app) {
	// User路由
	var users = require('../../app/controllers/users.server.controller');

	// 用户信息相关API
	app.route('/users/me').get(users.requiresLogin, users.me);
	app.route('/users')
		.get(users.requiresLogin, users.list)
		.put(users.requiresLogin, users.update);

	// 用户密码相关API
	app.route('/users/password').post(users.requiresLogin, users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// 用户认证相关API
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// 绑定User中间件
	app.param('userId', users.userByID);
};
