'use strict';

// Talks controller
angular.module('talks').controller('TalksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Talks',
	function($scope, $stateParams, $location, Authentication, Talks) {
		$scope.authentication = Authentication;

		// Create new Talk
		$scope.create = function() {
			// Create new Talk object
			var talk = new Talks ({
				name: this.name
			});

			// Redirect after save
			talk.$save(function(response) {
				$location.path('talks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Talk
		$scope.remove = function(talk) {
			if ( talk ) { 
				talk.$remove();

				for (var i in $scope.talks) {
					if ($scope.talks [i] === talk) {
						$scope.talks.splice(i, 1);
					}
				}
			} else {
				$scope.talk.$remove(function() {
					$location.path('talks');
				});
			}
		};

		// Update existing Talk
		$scope.update = function() {
			var talk = $scope.talk;

			talk.$update(function() {
				$location.path('talks/' + talk._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Talks
		$scope.find = function() {
			$scope.talks = Talks.query();
		};

		// Find existing Talk
		$scope.findOne = function() {
			$scope.talk = Talks.get({ 
				talkId: $stateParams.talkId
			});
		};
	}
]);