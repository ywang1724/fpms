'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http', '$timeout',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout) {
        $scope.authentication = Authentication;

        //可从后台动态获取数据，以后有时间完成
        $scope.type = 'java';
        $scope.types = ['java', 'node.js', 'android', 'ios'];

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
                host: this.host
            });

            // Redirect after save
            app.$save(function (response) {
                $location.path('apps/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.type = 'java';
                $scope.host = '';
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
            Highcharts.setOptions({
                lang: {
                    contextButtonTitle: '导出',
                    printChart: '打印图表',
                    downloadJPEG: '下载JPEG',
                    downloadPDF: '下载PDF',
                    downloadPNG: '下载PNG',
                    downloadSVG: '下载SVG'
                }
            });
            $http.get('pages/' + $stateParams.appId).
                success(function (data) {
                    $scope.pagesNum = data.length || 0;
                    if (data.length) {
                        $scope.showChart = true;
                        var ids = [];
                        for (var i = 0; i < data.length; i++) {
                            ids.push(data[i]._id);
                        }
                        $scope.pages = [{'_id':ids, 'pathname':'全部'}].concat(data);
                        $scope.selectPage = $scope.pages[0];
                        $scope.intervals = [
                            {'name': '日', 'id': 'day'}, {'name': '月', 'id': 'month'}, {'name': '年', 'id': 'year'}
                        ];
                        $scope.selectInterval = $scope.intervals[0];
                        // 日期范围初始化
                        var now = new Date();
                        $scope.nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
                        $scope.fromDate = $scope.nowDate - 1296000000; //往前15天
                        $scope.untilDate = $scope.nowDate;

                        var getTimings = function () {
                            $scope.details = [];
                            var trueFromDate, trueUntilDate;
                            switch ($scope.selectInterval.id) {
                                case 'day':
                                    trueFromDate = $scope.fromDate;
                                    trueUntilDate = $scope.untilDate + 86400000;
                                    $scope.chartConfig.xAxis.tickInterval = 86400000; //1天
                                    $scope.chartConfig.xAxis.dateTimeLabelFormats = {day: '%m.%d'};
                                    $scope.chartConfig.options.tooltip.xDateFormat = '%Y-%m-%d';
                                    break;
                                case 'month':
                                    trueFromDate = Date.UTC((new Date($scope.fromDate)).getFullYear(), (new Date($scope.fromDate)).getMonth());
                                    trueUntilDate = Date.UTC((new Date($scope.untilDate)).getFullYear(), (new Date($scope.untilDate)).getMonth() + 1);
                                    $scope.chartConfig.xAxis.tickInterval = 2419200000; //28天
                                    $scope.chartConfig.xAxis.dateTimeLabelFormats = {month: '%Y.%m'};
                                    $scope.chartConfig.options.tooltip.xDateFormat = '%Y.%m';
                                    break;
                                case 'year':
                                    trueFromDate = Date.UTC((new Date($scope.fromDate)).getFullYear(), 0);
                                    trueUntilDate = Date.UTC((new Date($scope.untilDate)).getFullYear() + 1, 0);
                                    $scope.chartConfig.xAxis.tickInterval = 31104000000; //360天
                                    $scope.chartConfig.xAxis.dateTimeLabelFormats = {day: '%Y'};
                                    $scope.chartConfig.options.tooltip.xDateFormat = '%Y';
                                    break;
                            }
                            $http.get('timings', {
                                params: {
                                    pageId: $scope.selectPage._id,
                                    fromDate: new Date(trueFromDate),
                                    untilDate: new Date(trueUntilDate),
                                    interval: $scope.selectInterval.id
                                }
                            }).success(function (result) {
                                $scope.chartConfig.series[0].data = result.numData;
                                $scope.chartConfig.series[1].data = result.pageLoadData;
                                $scope.chartConfig.series[2].data = result.networkData;
                                $scope.chartConfig.series[3].data = result.backendData;
                                $scope.chartConfig.series[4].data = result.frontendData;
                                $scope.chartConfig.series[5].data = result.redirectData;
                                $scope.chartConfig.series[6].data = result.dnsData;
                                $scope.chartConfig.series[7].data = result.connectData;
                                $scope.chartConfig.series[8].data = result.processingData;
                                $scope.chartConfig.series[9].data = result.onLoadData;
                                $scope.timingPie.series[0].data = [
                                    ['网络', (result.statisticData.network / result.statisticData.pageLoad) * 100],
                                    ['后端', (result.statisticData.backend / result.statisticData.pageLoad) * 100],
                                    {
                                        name: '前端',
                                        y: (result.statisticData.frontend / result.statisticData.pageLoad) *100,
                                        sliced: true,
                                        selected: true
                                    },
                                    ['其它', ((result.statisticData.pageLoad - result.statisticData.network -
                                    result.statisticData.backend - result.statisticData.frontend) /
                                    result.statisticData.pageLoad) * 100]];
                                $scope.statisticData = result.statisticData;
                            });
                        };

                        $scope.chartConfig = {
                            options: {
                                tooltip: {
                                    xDateFormat: '%Y-%m-%d',
                                    shared: true
                                },
                                plotOptions: {
                                    series: {
                                        cursor: 'pointer',
                                        point: {
                                            events: {
                                                click: function () {
                                                    $http.get('timings', {
                                                        params: {
                                                            pageId: $scope.selectPage._id,
                                                            dateNumber: this.category,
                                                            interval: $scope.selectInterval.id
                                                        }
                                                    }).success(function (result) {
                                                        $scope.details = result.data;
                                                        var pageLoad = [], network = [], backend = [], frontend = [],
                                                            redirect = [], dns = [], connect = [], processing = [],
                                                            onLoad = [];
                                                        for (var i = 0; i < result.data.length; i++) {
                                                            var dateNum = Date.parse(result.data[i].created);
                                                            pageLoad.push([dateNum, result.data[i].pageLoad]);
                                                            network.push([dateNum, result.data[i].network]);
                                                            backend.push([dateNum, result.data[i].backend]);
                                                            frontend.push([dateNum, result.data[i].frontend]);
                                                            redirect.push([dateNum, result.data[i].redirect]);
                                                            dns.push([dateNum, result.data[i].dns]);
                                                            connect.push([dateNum, result.data[i].connect]);
                                                            processing.push([dateNum, result.data[i].processing]);
                                                            onLoad.push([dateNum, result.data[i].onLoad]);
                                                        }
                                                        $scope.timingArea.series[0].data = pageLoad;
                                                        $scope.timingArea.series[1].data = network;
                                                        $scope.timingArea.series[2].data = backend;
                                                        $scope.timingArea.series[3].data = frontend;
                                                        $scope.timingArea.series[4].data = redirect;
                                                        $scope.timingArea.series[5].data = dns;
                                                        $scope.timingArea.series[6].data = connect;
                                                        $scope.timingArea.series[7].data = processing;
                                                        $scope.timingArea.series[8].data = onLoad;
                                                    });
                                                }
                                            }
                                        }
                                    }
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
                                tickInterval: 86400000,
                                dateTimeLabelFormats: {
                                    day: '%m.%d',
                                    month: '%Y.%m',
                                    year: '%Y'
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: '耗时（ms）'
                                }
                            }, {
                                title: {
                                    text: '请求总数',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                labels: {
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                allowDecimals: false,
                                opposite: true
                            }],
                            series: [{
                                name: '请求总数',
                                type: 'column',
                                yAxis: 1,
                                data: []
                            }, {
                                name: '平均总耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均网络耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均后端耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均前端耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均页面跳转耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均域名查询耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均连接耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均DOM解析耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '平均页面渲染耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: '页面性能总体趋势图'
                            }
                        };
                        $scope.timingPie = {
                            options: {
                                chart: {
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                            style: {
                                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                            }
                                        }
                                    }
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: '页面加载耗时分布图'
                            },
                            series: [{
                                type: 'pie',
                                name: '占总耗时比率',
                                data: []
                            }]
                        };
                        $scope.timingArea = {
                            options: {
                                chart: {
                                    zoomType: 'x'
                                },
                                tooltip: {
                                    shared: true
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            plotOptions: {
                                area: {
                                    fillColor: {
                                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                                        stops: [
                                            [0, Highcharts.getOptions().colors[0]],
                                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                        ]
                                    },
                                    marker: {
                                        radius: 2
                                    },
                                    lineWidth: 1,
                                    states: {
                                        hover: {
                                            lineWidth: 1
                                        }
                                    },
                                    threshold: null
                                }
                            },
                            xAxis: {
                                title: {
                                    text: '日期',
                                    align: 'high'
                                },
                                type: 'datetime'
                            },
                            yAxis: {
                                title: {
                                    text: '耗时（ms）'
                                }
                            },
                            series: [{
                                name: '总耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '网络耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '后端耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '前端耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面跳转耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '域名查询耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '连接耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM解析耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面渲染耗时',
                                type: 'area',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: '页面性能趋势图'
                            }
                        };
                        $scope.refrashChart = getTimings;
                        getTimings();
                        $scope.reflow = function () {
                            for (var i = 0; i < Highcharts.charts.length; i++) {
                                if (Highcharts.charts[i]) {
                                    Highcharts.charts[i].reflow();
                                }
                            }
                        };
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

        $scope.findTiming = function (timingId) {
            $http.get('timings/' + timingId).success(function (result) {
                $scope.timingData = result;
                $scope.resources = result.allResourcesCalc;
                $scope.timingErrs = result.errs;
            });
        };

        $scope.sumTooltip = {
            'title': '页面请求总数'
        };
        $scope.pageLoadTooltip = {
            'title': '页面请求加载总耗时'
        };
        $scope.networkTooltip = {
            'title': '包括页面跳转、域名查询、请求连接耗时'
        };
        $scope.backendTooltip = {
            'title': '包括从客户端发出请求到服务端完成响应耗时'
        };
        $scope.frontendTooltip = {
            'title': '包括DOM加载、页面渲染耗时'
        };
        $scope.redirectTooltip = {
            'title': '页面页面跳转耗时'
        };
        $scope.dnsTooltip = {
            'title': '域名查询耗时'
        };
        $scope.connectTooltip = {
            'title': '请求连接耗时'
        };
        $scope.processingTooltip = {
            'title': 'DOM加载耗时'
        };
        $scope.onLoadTooltip = {
            'title': '页面渲染耗时'
        };

        $scope.clip = function () {
            $scope.isClip = true;
            $timeout(function () {
                $scope.isClip = false;
            }, 3000);
        };
    }
]);
