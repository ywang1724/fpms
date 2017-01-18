'use strict';

// Apps controller
angular.module('apps').controller('UIController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService', 'SweetAlert',
    function ($scope, $stateParams, $location, Authentication, Tasks, DTOptionsBuilder, $http, $timeout, PageService, SweetAlert) {
        $scope.authentication = Authentication;
        $scope.create = function () {
            // 创建新的任务
            var task = new Tasks({
                url: this.url,
                app: $stateParams.appId
            });
            task.$save(function (response) {
                $location.path('apps/' + $stateParams.appId + '/ui/' + response._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
        $scope.removeErr = function () {
            $scope.error = false;
        };

        $scope.initTask = function () {
            $scope.task = Tasks.get({
                taskId: $stateParams.taskId
            })
        }

        $scope.back = function () {
            window.history.back();
        };

        $scope.addDomRule = function() {

        }
        $scope.removeDomRule = function() {

        }
        $scope.modifyDomRule = function() {

        }
        $scope.addDiffRule = function() {

        }
        $scope.removeDiffRule = function() {

        }
        $scope.modifyDiffRule = function() {

        }
        //datatble配置
        $scope.dtPageOptions = DTOptionsBuilder
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
        // .withOption('responsive', true);
    }]);
