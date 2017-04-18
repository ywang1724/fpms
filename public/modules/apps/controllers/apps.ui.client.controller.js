'use strict';

// Apps controller
angular.module('apps').filter("formatTime", function(){
    return function(inputData) {
        var standard = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
        for(var i = 0; i < standard.length; i++) {
            if(standard[i].value == inputData){
                return standard[i].label;
            }
        }
        return inputData + "毫秒";
    }
})
angular.module('apps').controller('UIController', ['$scope', '$stateParams', '$window', '$location', 'Authentication', 'Apps', 'Tasks', 'Mons',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService', 'SweetAlert', 'ModalService',
    function ($scope, $stateParams, $window, $location, Authentication, Apps, Tasks, Mons, DTOptionsBuilder, $http, $timeout, PageService, SweetAlert, ModalService) {
        $scope.authentication = Authentication;
        $scope.uiType = {
            'add': '添加DOM节点',
            'remove': '删除DOM节点',
            'style': '样式变化',
            'text': '文本变化'
        };
        $scope.fileName = {
            'diffPic': '页面对比图片.jpeg',
            'screenShot': '页面截图.jpeg',
            'info': '页面信息.json',
            'tree': 'DOM树信息.json'
        };
        $scope.monitoringIntervals = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
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
        $scope.remove = function () {
            SweetAlert.swal({
                title: '确定删除该应用?',
                text: '应用删除后不可恢复哟!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定，删掉它!',
                cancelButtonText: '不删，考虑一下!',
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        //删除应用代码
                        SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                        $scope.task.$remove(function () {
                            $location.path('apps/' + $stateParams.appId);
                        });
                    } else {
                        SweetAlert.swal('删除取消!', '该应用仍然存在 :)', 'error');
                    }
                });
        }
        $scope.removeErr = function () {
            $scope.error = false;
        };

        $scope.initTask = function () {
            $scope.task = Tasks.get({
                taskId: $stateParams.taskId
            })
            $scope.mons = Mons.query({
                taskId: $stateParams.taskId
            });
        };

        $scope.initMon = function () {
            $scope.mon = Mons.get({
                monId: $stateParams.monId
            })
        };

        $scope.listTask = function() {
            $scope.app = Apps.get({
                appId: $stateParams.appId
            });
            $scope.tasks = Tasks.query({
                appId: $stateParams.appId
            });
        }
        // 跳转至UI任务添加页面
        $scope.gotoAddTask= function(){
            $location.path('apps/' + $stateParams.appId + "/ui/create");
        };
        // 跳转至UI任务添加页面
        $scope.gotoTaskDetail= function(task){
            $location.path('apps/' + $stateParams.appId + "/ui/" + task._id);
        };
        $scope.back = function () {
            window.history.back();
        };

        $scope.addRule = function () {
            //通过Image对象请求发送数据
            var img = new Image(1, 1);
            img.src = '/_ui.gif/send?' + JSON.stringify({isOpenUI: true});
            img.onload = function(){
                $window.open($scope.task.url, '_blank');
            }
            img.onerror = function(err){
                SweetAlert.swal('跳转失败!', '服务器开了小差 :)', 'error');
            }
        };

        $scope.removeRule = function ($event, index, type) {
            if (type == 'dom') {
                $scope.task.domRules.splice(index, 1);
            } else if (type == 'diff') {
                $scope.task.diffRules.splice(index, 1);
            }

            $scope.task.$update(function () {
                SweetAlert.swal('删除成功!', '该规则已被成功删除.', 'success');
            }, function (errorResponse) {
                SweetAlert.swal('删除失败!', '服务器开了小差 :)', 'error');
            });

        };

        $scope.switchTaskStatus = function (status) {
            switch (status) {
                case 'off':
                    $scope.task.isRunning = false;
                    break;
                case 'on':
                    $scope.task.isRunning = true;
                    break;
            }
            $scope.task.$update(function () {
            }, function (errorResponse) {
                SweetAlert.swal('更新!', '服务器开了小差 :)', 'error');
            });
        };


        $scope.gotoMonDetail = function (mon) {
            $location.path('apps/' + $stateParams.appId + "/ui/" + $stateParams.taskId + "/mon/" + mon._id);
        };

        $scope.downloadFile = function (id) {
            $window.open("/mon/getFile?fileId=" + id, '_blank');
        }

        $scope.modifyInterval = function(monitoringIntervals, task){
            ModalService.showModal({
                templateUrl: 'modules/apps/views/ui/modify-interval.client.view.html',
                inputs: {
                    title: '修改监控时间间隔'
                },
                controller: ['$scope', 'close', function($scope, close){
                    var _monitoringInterval = task.monitoringInterval;
                    $scope.monitoringIntervals = monitoringIntervals;
                    $scope.task = task;
                    $scope.ok = function (result){
                        $scope.task.$update();
                        close(100);
                    };
                    $scope.cancel = function(){
                        task.monitoringInterval = _monitoringInterval;
                        close(100);
                    }
                }]
            }).then(function (modal) {
                modal.element.show();
            });
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
