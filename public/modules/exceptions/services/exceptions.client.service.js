'use strict';

//Exceptions service used to communicate Exceptions REST endpoints
angular.module('exceptions').factory('Exceptions', ['$resource',
	function($resource) {
		return $resource('exceptions/:exceptionId', { exceptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);