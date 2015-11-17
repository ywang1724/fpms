'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http', '$timeout',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout) {
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

        $scope.alarmkind = [1, 2, 3, 4];
        $scope.alarmkinds = [
            {label: 'JavaScript异常', value: 1, checked: true},
            {label: 'Ajax请求异常', value: 2, checked: true},
            {label: '静态资源请求异常', value: 3, checked: true},
            {label: '死链接异常', value: 4, checked: true},
            {label: '页面加载异常', value: 5, checked: false},
            {label: 'DOM结构异常', value: 6, checked: false},
            {label: '内存异常', value: 7, checked: false}
        ];

        $scope.toggleSelection = function (obj, i) {
            var objValue = parseInt(obj.target.value);
            if(obj.target.checked){
                i == 1 ? $scope.alarmkind.push(objValue) : $scope.app.alarmkind.push(objValue);
            }else{
                i == 1 ? $scope.alarmkind.splice($scope.alarmkind.indexOf(objValue), 1) : $scope.app.alarmkind.splice($scope.app.alarmkind.indexOf(objValue), 1);
            }
        };

        if (Authentication.user) {
            $scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;
        }
        $scope.script = '<script type="text/javascript">var fp = document.createElement("script");' +
                        'fp.type = "text/javascript";' +
                        'fp.async = true;' +
                        'fp.src = "http://' + $location.host() + ':' + $location.port() + '/rookie.js/' +
                            $stateParams.appId + '";' +
                        'var s = document.getElementsByTagName("script")[0];' +
                        's.parentNode.insertBefore(fp, s);</script>';

        // Create new App
        $scope.create = function () {
            // Create new App object
            var app = new Apps({
                name: this.name,
                type: this.type,
                host: this.host,
                deadLinkInterval: this.deadLinkInterval,
                alarmkind: this.alarmkind
            });

            // Redirect after save
            app.$save(function (response) {
                $location.path('apps/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.type = 'java';
                $scope.host = '';
                $scope.alarmkind = [1, 2, 3, 4];
                $scope.deadLinkInterval = 3600000;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing App
        $scope.remove = function (app) {
            if (app) {
                app.$remove();

                for (var i in $scope.apps) {
                    if ($scope.apps [i] === app) {
                        $scope.apps.splice(i, 1);
                    }
                }
            } else {
                $scope.app.$remove(function () {
                    $location.path('apps');
                });
            }
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


            //修改APP配置初始化报警类型
            $scope.alarmkinds = [
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
                for(var i=0; i < $scope.app.alarmkind.length; i++){
                    var j = $scope.app.alarmkind[i];
                    if(j){
                        $scope.alarmkinds[j-1].checked = true;
                    }
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
