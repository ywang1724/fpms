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
		}).
		state('viewAppException', {
			url: '/apps/exception/:appId',
			templateUrl: 'modules/apps/views/exception/view-exception.client.view.html'
		}).
        state('viewAppUI', {
            url: '/apps/ui/:appId',
            templateUrl: 'modules/apps/views/ui/list-task.client.view.html'
        }).
        state('addUITask', {
            url: '/apps/:appId/ui/create',
            templateUrl: 'modules/apps/views/ui/add-task.client.view.html'
        }).
        state('viewUITask', {
            url: '/apps/:appId/ui/:taskId',
            templateUrl: 'modules/apps/views/ui/view-task.client.view.html'
        }).
        state('viewUIMon', {
            url: '/apps/:appId/ui/:taskId/mon/:monId',
            templateUrl: 'modules/apps/views/ui/view-mon.client.view.html'
        }).
		state('viewAppBehavior', {
			url: '/apps/behavior/:appId',
			templateUrl: 'modules/apps/views/behavior/view-behavior.client.view.html'
		});

	}
]);
