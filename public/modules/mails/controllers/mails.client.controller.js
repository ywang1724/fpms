'use strict';

// Mails controller
angular.module('mails').controller('MailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mails', 'DTOptionsBuilder',
	function($scope, $stateParams, $location, Authentication, Mails, DTOptionsBuilder) {
		$scope.authentication = Authentication;



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
			.withBootstrap()
			.withBootstrapOptions({
				pagination: {
					classes: {
						ul: 'pagination pagination-sm'
					}
				}
			})
			.withOption('responsive', true);
	}
]);
