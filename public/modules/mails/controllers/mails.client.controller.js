'use strict';

// Mails controller
angular.module('mails').controller('MailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mails',
	function($scope, $stateParams, $location, Authentication, Mails) {
		$scope.authentication = Authentication;

		// Create new Mail
		$scope.create = function() {
			// Create new Mail object
			var mail = new Mails ({
				name: this.name
			});

			// Redirect after save
			mail.$save(function(response) {
				$location.path('mails/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mail
		$scope.remove = function(mail) {
			if ( mail ) { 
				mail.$remove();

				for (var i in $scope.mails) {
					if ($scope.mails [i] === mail) {
						$scope.mails.splice(i, 1);
					}
				}
			} else {
				$scope.mail.$remove(function() {
					$location.path('mails');
				});
			}
		};

		// Update existing Mail
		$scope.update = function() {
			var mail = $scope.mail;

			mail.$update(function() {
				$location.path('mails/' + mail._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mails
		$scope.find = function() {
			$scope.mails = Mails.query();
		};

		// Find existing Mail
		$scope.findOne = function() {
			$scope.mail = Mails.get({ 
				mailId: $stateParams.mailId
			});
		};
	}
]);