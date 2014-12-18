'use strict';

//Timings service used to communicate Timings REST endpoints
angular.module('timings').factory('Timings', ['$resource',
	function($resource) {
		return $resource('timings/:timingId', { timingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);