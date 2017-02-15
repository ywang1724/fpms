'use strict';

// Mails controller
angular.module('mails').controller('MailsController', ['$scope', '$sce', '$stateParams', '$location', 'Authentication', 'Mails', 'DTOptionsBuilder', 'ModalService',
	function($scope, $sce,  $stateParams, $location, Authentication, Mails, DTOptionsBuilder, ModalService) {
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


		//查看邮件详情
		$scope.viewMail = function (mail){

			//查看本次异常详情
			ModalService.showModal({
				templateUrl: 'modules/mails/views/view-mail.client.view.html',
				inputs: {
					title: '邮件详情',
					mail: mail
				},
				controller: function($scope, close, title, mail){
					$scope.title = title;
					$scope.mail = mail;
					$scope.explicitlyTrustedEmailDetail = $sce.trustAsHtml(mail.content);
                    $scope.close = function (result){
						close(result, 200);
					};
				}
			}).then(function (modal) {
				modal.element.show();
				modal.close.then(function (result) {
					console.log(result);
				});
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
