'use strict';

//Setting up route
angular.module('apps').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('listApps', {
			url: '/apps',
			templateUrl: 'modules/apps/views/app/list-apps.client.view.html'
		}).
		state('createApp', {
			url: '/apps/create',
			templateUrl: 'modules/apps/views/app/create-app.client.view.html'
		}).
		state('editApp', {
			url: '/apps/:appId/edit',
			templateUrl: 'modules/apps/views/app/edit-app.client.view.html'
		}).
		state('viewApp', {
			url: '/apps/:appId',
			templateUrl: 'modules/apps/views/app/view-app.client.view.html'
		}).
		state('viewAppPerformance', {
			url: '/apps/performance/:appId',
			templateUrl: 'modules/apps/views/performance/view-performance.client.view.html'
		});
	}
]);
