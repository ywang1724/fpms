'use strict';

//Setting up route
angular.module('timings').config(['$stateProvider',
	function($stateProvider) {
		// Timings state routing
		$stateProvider.
		state('listTimings', {
			url: '/timings',
			templateUrl: 'modules/timings/views/list-timings.client.view.html'
		}).
		state('createTiming', {
			url: '/timings/create',
			templateUrl: 'modules/timings/views/create-timing.client.view.html'
		}).
		state('viewTiming', {
			url: '/timings/:timingId',
			templateUrl: 'modules/timings/views/view-timing.client.view.html'
		}).
		state('editTiming', {
			url: '/timings/:timingId/edit',
			templateUrl: 'modules/timings/views/edit-timing.client.view.html'
		});
	}
]);