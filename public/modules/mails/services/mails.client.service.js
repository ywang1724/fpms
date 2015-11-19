'use strict';

//Mails service used to communicate Mails REST endpoints
angular.module('mails').factory('Mails', ['$resource',
	function($resource) {
		return $resource('mails/:mailId', { mailId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);