'use strict';

//Setting up route
angular.module('mails').config(['$stateProvider',
	function($stateProvider) {
		// Mails state routing
		$stateProvider.
		state('listMails', {
			url: '/mails',
			templateUrl: 'modules/mails/views/list-mails.client.view.html'
		}).
		state('viewMail', {
			url: '/mails/:mailId',
			templateUrl: 'modules/mails/views/view-mail.client.view.html'
		});
	}
]);
