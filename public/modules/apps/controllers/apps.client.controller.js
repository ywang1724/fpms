'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
	function($scope, $stateParams, $location, Authentication, Apps) {
		$scope.authentication = Authentication;

		// Create new App
		$scope.create = function() {
			// Create new App object
			var app = new Apps ({
				name: this.name
			});

			// Redirect after save
			app.$save(function(response) {
				$location.path('apps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing App
		$scope.remove = function(app) {
			if ( app ) { 
				app.$remove();

				for (var i in $scope.apps) {
					if ($scope.apps [i] === app) {
						$scope.apps.splice(i, 1);
					}
				}
			} else {
				$scope.app.$remove(function() {
					$location.path('apps');
				});
			}
		};

		// Update existing App
		$scope.update = function() {
			var app = $scope.app;

			app.$update(function() {
				$location.path('apps/' + app._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Apps
		$scope.find = function() {
			$scope.apps = Apps.query();
		};

		// Find existing App
		$scope.findOne = function() {
			$scope.app = Apps.get({ 
				appId: $stateParams.appId
			});
		};
	}
]);