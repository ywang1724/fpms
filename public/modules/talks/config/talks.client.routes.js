'use strict';

//Setting up route
angular.module('talks').config(['$stateProvider',
	function($stateProvider) {
		// Talks state routing
		$stateProvider.
		state('listTalks', {
			url: '/talks',
			templateUrl: 'modules/talks/views/list-talks.client.view.html'
		}).
		state('createTalk', {
			url: '/talks/create',
			templateUrl: 'modules/talks/views/create-talk.client.view.html'
		}).
		state('viewTalk', {
			url: '/talks/:talkId',
			templateUrl: 'modules/talks/views/view-talk.client.view.html'
		}).
		state('editTalk', {
			url: '/talks/:talkId/edit',
			templateUrl: 'modules/talks/views/edit-talk.client.view.html'
		});
	}
]);