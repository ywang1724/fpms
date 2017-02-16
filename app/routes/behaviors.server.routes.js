/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/6
 */
'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var behaviors = require('../../app/controllers/behaviors.server.controller');
  var apps = require('../../app/controllers/apps.server.controller');

  // behavior Routes
  app.route('/behaviors').get(users.requiresLogin, behaviors.statisticList);

  //流量分析
  app.route('/behavior.js/:appId').get(behaviors.behavior);
  app.route('/behavior.custom.css/:appId').get(behaviors.returnStyle);
  app.route('/_ub.gif').get(behaviors.create);

  // 事件分析
  app.route('/custom/:appId').get(behaviors.customList);
  app.route('/funnel').get(behaviors.funnel);

  // Finish by binding the Timing middleware
  app.param('behaviorId', behaviors.behaviorByID);
  app.param('appId', apps.appByID);
};
