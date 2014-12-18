'use strict';

// Timings controller
angular.module('timings').controller('TimingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timings',
	function($scope, $stateParams, $location, Authentication, Timings) {
		$scope.authentication = Authentication;

		// Create new Timing
		$scope.create = function() {
			// Create new Timing object
			var timing = new Timings ({
				name: this.name
			});

			// Redirect after save
			timing.$save(function(response) {
				$location.path('timings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Timing
		$scope.remove = function(timing) {
			if ( timing ) { 
				timing.$remove();

				for (var i in $scope.timings) {
					if ($scope.timings [i] === timing) {
						$scope.timings.splice(i, 1);
					}
				}
			} else {
				$scope.timing.$remove(function() {
					$location.path('timings');
				});
			}
		};

		// Update existing Timing
		$scope.update = function() {
			var timing = $scope.timing;

			timing.$update(function() {
				$location.path('timings/' + timing._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Timings
		$scope.find = function() {
			$scope.timings = Timings.query();
		};

		// Find existing Timing
		$scope.findOne = function() {
			$scope.timing = Timings.get({ 
				timingId: $stateParams.timingId
			});
		};
	}
]);