'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps', 'Tasks',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService', 'SweetAlert',
    function ($scope, $stateParams, $location, Authentication, Apps, Tasks, DTOptionsBuilder, $http, $timeout, PageService, SweetAlert) {
        $scope.authentication = Authentication;

        //可从后台动态获取数据，以后有时间完成
        $scope.type = 'java';
        $scope.types = ['java', 'node.js', 'android', 'ios'];

        $scope.deadLinkInterval = 3600000;
        $scope.deadLinkIntervals = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
        $scope.alarmInterval = 900000;
        $scope.alarmIntervals = [
            {label: '5分钟',value: 300000},
            {label: '10分钟',value: 600000},
            {label: '15分钟',value: 900000},
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];

        //是否开启用户行为监测
        $scope.toggleOpenUB = 0;
        $scope.toggleOpenUBs = [
            {label: '开启', value:1},
            {label: '关闭', value: 0}
        ];

        $scope.alarmtype = [1, 2, 3, 4];
        $scope.alarmtypes = [
            {label: 'JavaScript异常', value: 1, checked: true},
            {label: 'Ajax请求异常', value: 2, checked: true},
            {label: '静态资源请求异常', value: 3, checked: true},
            {label: '死链接异常', value: 4, checked: true},
            {label: '页面加载异常', value: 5, checked: false},
            {label: 'DOM结构异常', value: 6, checked: false},
            {label: '内存异常', value: 7, checked: false}
        ];
        $scope.uiInterval = 3600000;
        $scope.uiIntervals = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
        $scope.toggleSelection = function (obj, i) {
            var objValue = parseInt(obj.target.value);
            if(obj.target.checked){
                if(i === 1){
                    $scope.typekind.push(objValue);
                }else {
                    $scope.app.alarmtype.push(objValue);
                }
            }else{
                if(i === 1){
                    $scope.alarmtype.splice($scope.alarmtype.indexOf(objValue), 1);
                }else {
                    $scope.app.alarmtype.splice($scope.app.alarmtype.indexOf(objValue), 1);
                }
            }
        };

        if (Authentication.user) {
            $scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;
        }

        /*
        $scope.script = '<script type="text/javascript">var fp = document.createElement("script");' +
                        'fp.type = "text/javascript";' +
                        'fp.async = true;' +
                        'fp.src = "http://' + $location.host() + ':' + $location.port() + '/rookie.js/' +
                            $stateParams.appId + '";' +
                        'var s = document.getElementsByTagName("script")[0];' +
                        's.parentNode.insertBefore(fp, s);</script>';
        */

        // 性能&异常监测脚本
        $scope.script = '<script type="text/javascript" ' + 'id="feException" ' + 'src="http://' + $location.host() + ':' +
                        $location.port() + '/bookie.js/' + $stateParams.appId + '"' + '></script>';

        // 用户行为监测脚本
        $scope.UBscript = '<script type="text/javascript" ' + 'id="feException" ' + 'src="http://' + $location.host() + ':' +
                        $location.port() + '/behavior.js/' + $stateParams.appId + '"' + '></script>';

        // Create new App
        $scope.create = function () {
            // Create new App object
            var app = new Apps({
                name: this.name,
                type: this.type,
                host: this.host,
                deadLinkInterval: this.deadLinkInterval,
                uiInterval: this.uiInterval,
                alarmtype: this.alarmtype,
                alarmInterval: this.alarmInterval,
                alarmEmail: this.alarmEmail,
                toggleOpenUB: this.toggleOpenUB
            });

            // Redirect after save
            app.$save(function (response) {
                $location.path('apps/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.type = 'java';
                $scope.host = '';
                $scope.alarmtype = [1, 2, 3, 4];
                $scope.deadLinkInterval = 3600000;
                $scope.deadLinkInterval = 3600000;
                $scope.alarmInterval = 900000;
                $scope.alarmEmail = '';
                $scope.toggleOpenUB = 0;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing App
        $scope.remove = function (app) {
            SweetAlert.swal({
                    title: '确定删除该应用?',
                    text: '应用删除后不可恢复哟!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定，删掉它!',
                    cancelButtonText: '不删，考虑一下!',
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        //删除应用代码
                        if (app) {
                            app.$remove();
                            for (var i in $scope.apps) {
                                if ($scope.apps [i] === app) {
                                    $scope.apps.splice(i, 1);
                                }
                            }
                            SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                        } else {
                            SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                            $scope.app.$remove(function () {
                                $location.path('apps');
                            });
                        }
                    } else {
                        SweetAlert.swal('删除取消!', '该应用仍然存在 :)', 'error');
                    }
                });
        };

        // Update existing App
        $scope.update = function () {
            var app = $scope.app;

            app.$update(function () {
                $location.path('apps/' + app._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Apps
        $scope.find = function () {
            $scope.apps = Apps.query();
        };

        // Find existing App
        $scope.intApp = function () {
            $scope.app = Apps.get({
                appId: $stateParams.appId
            });


            $http.get('pages/' + $stateParams.appId).
                success(function (data) {
                    $scope.pages = data;
                });

            $scope.tasks = Tasks.query({
                appId: $stateParams.appId
            });

            //修改APP配置初始化报警类型
            $scope.alarmtypes = [
                {label: 'JavaScript异常', value: 1, checked: false},
                {label: 'Ajax请求异常', value: 2, checked: false},
                {label: '静态资源请求异常', value: 3, checked: false},
                {label: '死链接异常', value: 4, checked: false},
                {label: '页面加载异常', value: 5, checked: false},
                {label: 'DOM结构异常', value: 6, checked: false},
                {label: '内存异常', value: 7, checked: false}
            ];

            //angularjs默认按需加载，因此将代码放入then中
            $scope.app.$promise.then(function(data){
                for(var i=0; i < $scope.app.alarmtype.length; i++){
                    var j = $scope.app.alarmtype[i];
                    if(j){
                        $scope.alarmtypes[j-1].checked = true;
                    }
                }
            });

        };

        //跳转至性能详情
        $scope.gotoPerformance = function(page){
            PageService.setCurrentPage({'_id': page._id, 'pathname': page.pathname});
            PageService.setIdentifier(2);
            $location.path('apps/performance/' + $scope.app._id);
        };

        //跳转至异常详情
        $scope.gotoException = function(page){
            PageService.setCurrentPage({'_id': page._id, 'pathname': page.pathname});
            PageService.setIdentifier(2);
            $location.path('apps/exception/' + $scope.app._id);
        };

        // 跳转至UI任务添加页面
        $scope.gotoAddTask= function(){
            $location.path('apps/' + $stateParams.appId + "/ui/create");
        };
        // 跳转至UI任务添加页面
        $scope.gotoTaskDetail= function(task){
            $location.path('apps/' + $stateParams.appId + "/ui/" + task._id);
        };

        //删除页面
        $scope.deletePage = function(page){
            SweetAlert.swal({
                    title: '确定删除该页面?',
                    text: '页面删除后不可恢复哟!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',confirmButtonText: '确定，删掉它!',
                    cancelButtonText: '不删，考虑一下!',
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                        $scope.pages = $scope.pages.filter(function(elem){
                            return elem._id !== page._id;
                        });
                        $http.delete('pages/' + $scope.app._id, {
                            params: {pageId: page._id}
                        });
                    } else {
                        SweetAlert.swal('删除取消!', '该页面仍然存在 :)', 'error');
                    }
                });
        };

        $scope.canUpdate = function () {
            return $scope.appForm.$valid;
        };

        $scope.removeErr = function () {
            $scope.error = false;
        };

        $scope.back = function () {
            window.history.back();
        };


        $scope.clip = function () {
            $scope.isClip = true;
            $timeout(function () {
                $scope.isClip = false;
            }, 3000);
        };

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

        //
        //$scope.pt = function () {
        //    $scope.showProgress = true;
        //    $http.get('/phantomjs/test').success(function (result) {
        //        $scope.ptResult = result;
        //        $scope.showProgress = false;
        //    });
        //};

    }
]);
