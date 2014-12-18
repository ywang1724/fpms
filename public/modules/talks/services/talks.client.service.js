'use strict';

//Talks service used to communicate Talks REST endpoints
angular.module('talks').factory('Talks', ['$resource',
	function($resource) {
		return $resource('talks/:talkId', { talkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);