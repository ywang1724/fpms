'use strict';

// 初始化应用配置模块
var ApplicationConfiguration = (function() {
	// 初始化模块配置
	var applicationModuleName = 'fpms';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
		'ui.router', 'ui.bootstrap', 'ui.utils', 'datatables', 'datatables.bootstrap', 'mgcrea.ngStrap', 'ngLocale', 'highcharts-ng', 'ngClipboard', 'angularModalService'];

	// 添加一个新的垂直模块
	var registerModule = function(moduleName, dependencies) {
		// 添加angular模块
		angular.module(moduleName, dependencies || []);

		// 添加模块到AngularJS配置文件
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
