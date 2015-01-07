'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps', 'DTOptionsBuilder',
	function($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder) {
		$scope.authentication = Authentication;
		$scope.type = 'java';
		$scope.types = ['java', 'node.js'];
		$scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;

		// Create new App
		$scope.create = function() {
			// Create new App object
			var app = new Apps ({
				name: this.name,
				type: this.type,
				server: this.server
			});

			// Redirect after save
			app.$save(function(response) {
				$location.path('apps/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.type = 'java';
				$scope.server = '';
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

		$scope.dtOptions = DTOptionsBuilder
			.newOptions()
			.withLanguage({
				'sLengthMenu': '每页显示 _MENU_ 条数据',
				'sInfo': '从 _START_ 到 _END_ /共 _TOTAL_ 条数据',
				'sInfoEmpty': '没有数据',
				'sInfoFiltered': '(从 _MAX_ 条数据中检索)',
				'sZeroRecords': '没有检索到数据',
				'sSearch': '检索:',
				'oPaginate': {
					'sFirst': '首页',
					'sPrevious': '上一页',
					'sNext': '下一页',
					'sLast': '末页'
				}
			})
			// Add Bootstrap compatibility
			.withBootstrap();
	}
]);
