'use strict';

//Setting up route
angular.module('exceptions').config(['$stateProvider',
	function($stateProvider) {
		// Exceptions state routing
		$stateProvider.
		state('listExceptions', {
			url: '/exceptions',
			templateUrl: 'modules/exceptions/views/list-exceptions.client.view.html'
		}).
		state('createException', {
			url: '/exceptions/create',
			templateUrl: 'modules/exceptions/views/create-exception.client.view.html'
		}).
		state('viewException', {
			url: '/exceptions/:exceptionId',
			templateUrl: 'modules/exceptions/views/view-exception.client.view.html'
		}).
		state('editException', {
			url: '/exceptions/:exceptionId/edit',
			templateUrl: 'modules/exceptions/views/edit-exception.client.view.html'
		});
	}
]);