'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http) {
        $scope.authentication = Authentication;

        //可从后台动态获取数据，以后有时间完成
        $scope.type = 'java';
        $scope.types = ['java', 'node.js'];

        if (Authentication.user) {
            $scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;
        }
        $scope.script = '<script type="text/javascript">var fp = document.createElement("script");' +
                        'fp.type = "text/javascript";' +
                        'fp.async = true;' +
                        'fp.src = "http://192.168.88.8:3000/rookie.js/' + $stateParams.appId + '";' +
                        'var s = document.getElementsByTagName("script")[0];' +
                        's.parentNode.insertBefore(fp, s);</script>';

        // Create new App
        $scope.create = function () {
            // Create new App object
            var app = new Apps({
                name: this.name,
                type: this.type,
                server: this.server
            });

            // Redirect after save
            app.$save(function (response) {
                $location.path('apps/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.type = 'java';
                $scope.server = '';
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
        $scope.findOne = function () {
            $scope.app = Apps.get({
                appId: $stateParams.appId
            });
            $http.get('pages/' + $stateParams.appId).
                success(function (data) {
                    if (data.length) {
                        $scope.showChart = true;
                        $scope.pages = data;
                        $scope.selectPage = $scope.pages[0];
                        // 日期范围初始化
                        var now = new Date();
                        $scope.nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
                        $scope.fromDate = $scope.nowDate - 1296000000; //往前15天
                        $scope.untilDate = new Date($scope.nowDate);
                        $scope.chartTypes = ['line', 'bar', 'pie'];
                        $scope.selectChartType = $scope.chartTypes[0];

                        var getTimings = function () {
                            var trueDate = Date.parse($scope.untilDate) + 86400000;
                            $http.get('timings', {
                                params: {
                                    pageId: $scope.selectPage._id,
                                    fromDate: new Date($scope.fromDate),
                                    untilDate: new Date(trueDate)
                                }
                            }).success(function (result) {
                                $scope.chartConfig.options.chart.type = $scope.selectChartType;
                                $scope.chartConfig.series[0].data = result.data;
                            });
                        };
                        getTimings();

                        $scope.chartConfig = {
                            options: {
                                chart: {
                                    type: ''
                                },
                                legend: {
                                    enabled: false
                                },
                                tooltip: {
                                    xDateFormat: '%Y-%m-%d',
                                    valueSuffix: ' ms'
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                title: {
                                    text: '日期',
                                    align: 'high'
                                },
                                type: 'datetime',
                                dateTimeLabelFormats: {
                                    day: '%m.%d'
                                },
                                tickInterval: 86400000 //一天
                            },
                            yAxis: {
                                title: {
                                    text: '时间（ms）',
                                    align: 'high'
                                }
                            },
                            series: [{
                                name: '平均总时间',
                                data: []
                            }],
                            title: {
                                text: '页面加载平均总时间'
                            }
                        };
                        $scope.refrashChart = getTimings;
                    } else {
                        $scope.showChart = false;
                    }
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

        $scope.canUpdate = function () {
            return $scope.appForm.$valid;
        };

        $scope.removeErr = function () {
            $scope.error = false;
        };

        $scope.back = function () {
            window.history.back();
        };
    }
]);
