'use strict';

// Exceptions controller
angular.module('exceptions').controller('ExceptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Exceptions',
	function($scope, $stateParams, $location, Authentication, Exceptions) {
		$scope.authentication = Authentication;

		// Create new Exception
		$scope.create = function() {
			// Create new Exception object
			var exception = new Exceptions ({
				name: this.name
			});

			// Redirect after save
			exception.$save(function(response) {
				$location.path('exceptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Exception
		$scope.remove = function(exception) {
			if ( exception ) { 
				exception.$remove();

				for (var i in $scope.exceptions) {
					if ($scope.exceptions [i] === exception) {
						$scope.exceptions.splice(i, 1);
					}
				}
			} else {
				$scope.exception.$remove(function() {
					$location.path('exceptions');
				});
			}
		};

		// Update existing Exception
		$scope.update = function() {
			var exception = $scope.exception;

			exception.$update(function() {
				$location.path('exceptions/' + exception._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Exceptions
		$scope.find = function() {
			$scope.exceptions = Exceptions.query();
		};

		// Find existing Exception
		$scope.findOne = function() {
			$scope.exception = Exceptions.get({ 
				exceptionId: $stateParams.exceptionId
			});
		};
	}
]);