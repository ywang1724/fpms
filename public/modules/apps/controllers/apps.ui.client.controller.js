'use strict';

// Apps controller
angular.module('apps').controller('UIController', ['$scope', '$stateParams', '$window', '$location', 'Authentication', 'Tasks', 'Mons',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService', 'SweetAlert',
    function ($scope, $stateParams, $window, $location, Authentication, Tasks, Mons, DTOptionsBuilder, $http, $timeout, PageService, SweetAlert) {
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

        $scope.back = function () {
            window.history.back();
        };

        $scope.addRule = function () {
            $window.open($scope.task.url, '_blank');
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

        $scope.modifyInterval = function(){
            SweetAlert.swal({
                    title: "请输入监控时间间隔（ms）",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "请输入"
                },
                function(inputValue){
                    if (inputValue === false) return false;

                    if (inputValue === "" || !Number.isInteger(parseInt(inputValue))) {
                        swal.showInputError("输入不合法，请检查后输入");
                        return false;
                    }
                    $scope.task.monitoringInterval = inputValue;
                    $scope.task.$update(function () {
                        swal("监控时间间隔更新成功!", "新的监控时间间隔为：" + inputValue + "ms", "success");
                    }, function (errorResponse) {
                        swal('更新失败!', '服务器开了小差 :)', 'error');
                    });
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
