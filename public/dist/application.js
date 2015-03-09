'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'fpms';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
		'ui.router', 'ui.bootstrap', 'ui.utils', 'datatables', 'mgcrea.ngStrap', 'ngLocale', 'highcharts-ng', 'ngClipboard'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('apps');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Apps module
angular.module('apps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '我的应用', 'apps', 'dropdown', '/apps(/create)?', 'false', ['user']);
		Menus.addSubMenuItem('topbar', 'apps', '应用列表', 'apps');
		Menus.addSubMenuItem('topbar', 'apps', '添加应用', 'apps/create');

		Menus.addMenuItem('topbar', '应用列表', 'apps', 'item', '/apps', 'false', ['admin']);
	}
]);

angular.module('apps').config(["$datepickerProvider", function($datepickerProvider) {
    angular.extend($datepickerProvider.defaults, {
        animation: 'am-flip-x',
        autoclose: true,
        dateType: 'number'
    });
}]);

angular.module('apps').config(["$selectProvider", function($selectProvider) {
    angular.extend($selectProvider.defaults, {
        animation: 'am-flip-x'
    });
}]);

angular.module('apps').config(["$tooltipProvider", function($tooltipProvider) {
    angular.extend($tooltipProvider.defaults, {
        animation: 'am-flip-x',
        trigger: 'hover',
        placement: 'bottom',
        type: 'success'
    });
}]);

angular.module('apps').config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath('lib/zeroclipboard/dist/ZeroClipboard.swf');
}]);

'use strict';

//Setting up route
angular.module('apps').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('listApps', {
			url: '/apps',
			templateUrl: 'modules/apps/views/app/list-apps.client.view.html'
		}).
		state('createApp', {
			url: '/apps/create',
			templateUrl: 'modules/apps/views/app/create-app.client.view.html'
		}).
		state('viewApp', {
			url: '/apps/:appId',
			templateUrl: 'modules/apps/views/app/view-app.client.view.html'
		}).
		state('editApp', {
			url: '/apps/:appId/edit',
			templateUrl: 'modules/apps/views/app/edit-app.client.view.html'
		});
	}
]);

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
            $scope.showData = true;
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
                        $scope.browsers = [
                            {'name': '全部', 'id': 'all'},
                            {'name': 'Internet Explorer', 'id': 'Internet Explorer'}, {'name': 'Chrome', 'id': 'Chrome'},
                            {'name': 'Android Webkit Browser', 'id': 'Android Webkit Browser'},
                            {'name': 'Firefox', 'id': 'Firefox'}, {'name': 'Safari', 'id': 'Safari'}
                        ];
                        $scope.selectBrowser = $scope.browsers[0];
                        $scope.statistics = [
                            {'name': '平均值', 'id': 'mean'}, {'name': 'p50', 'id': 'median'},
                            {'name': 'p90', 'id': 'quantile_90'}
                        ];
                        $scope.selectStatistic = $scope.statistics[0];
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
                            console.log($scope.chartConfig);
                            switch ($scope.selectStatistic.id) {
                                case 'mean':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（平均值）';
                                    break;
                                case 'median':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（p50）';
                                    break;
                                case 'quantile_90':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（p90）';
                                    break;
                            }
                            $http.get('timings', {
                                params: {
                                    pageId: $scope.selectPage._id,
                                    fromDate: new Date(trueFromDate),
                                    untilDate: new Date(trueUntilDate),
                                    interval: $scope.selectInterval.id,
                                    browser: $scope.selectBrowser.id,
                                    statistic: $scope.selectStatistic.id
                                }
                            }).success(function (result) {
                                if (result.statisticData.sum > 0) {
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
                                    $scope.timingPie50.series[0].data = [
                                        ['网络', (result.statisticData.network50 / result.statisticData.pageLoad50) * 100],
                                        ['后端', (result.statisticData.backend50 / result.statisticData.pageLoad50) * 100],
                                        {
                                            name: '前端',
                                            y: (result.statisticData.frontend50 / result.statisticData.pageLoad50) *100,
                                            sliced: true,
                                            selected: true
                                        },
                                        ['其它', ((result.statisticData.pageLoad50 - result.statisticData.network50 -
                                        result.statisticData.backend50 - result.statisticData.frontend50) /
                                        result.statisticData.pageLoad50) * 100]];
                                    $scope.timingPie90.series[0].data = [
                                        ['网络', (result.statisticData.network90 / result.statisticData.pageLoad90) * 100],
                                        ['后端', (result.statisticData.backend90 / result.statisticData.pageLoad90) * 100],
                                        {
                                            name: '前端',
                                            y: (result.statisticData.frontend90 / result.statisticData.pageLoad90) *100,
                                            sliced: true,
                                            selected: true
                                        },
                                        ['其它', ((result.statisticData.pageLoad90 - result.statisticData.network90 -
                                        result.statisticData.backend90 - result.statisticData.frontend90) /
                                        result.statisticData.pageLoad90) * 100]];
                                    $scope.statisticData = result.statisticData;
                                    $scope.showData = true;
                                } else {
                                    $scope.showData = false;
                                }
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
                                                            interval: $scope.selectInterval.id,
                                                            browser: $scope.selectBrowser.id
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
                                name: '总耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '网络耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '后端耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '前端耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面跳转耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '域名查询耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '连接耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM解析耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面渲染耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: ''
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
                                text: '页面加载耗时分布图(平均值)'
                            },
                            series: [{
                                type: 'pie',
                                name: '占总耗时比率',
                                data: []
                            }]
                        };
                        $scope.timingPie50 = {
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
                                text: '页面加载耗时分布图(p50)'
                            },
                            series: [{
                                type: 'pie',
                                name: '占总耗时比率',
                                data: []
                            }]
                        };
                        $scope.timingPie90 = {
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
                                text: '页面加载耗时分布图(p90)'
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
                                    type: 'areaspline',
                                    zoomType: 'x'
                                },
                                plotOptions: {
                                    areaspline: {
                                        fillOpacity: 0.5,
                                        marker: {
                                            enabled: false
                                        }
                                    }
                                },
                                tooltip: {
                                    shared: true
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
                                type: 'datetime'
                            },
                            yAxis: {
                                title: {
                                    text: '耗时（ms）'
                                }
                            },
                            series: [{
                                name: '总耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '网络耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '后端耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '前端耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面跳转耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '域名查询耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '连接耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM解析耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面渲染耗时',
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

'use strict';

// My Apps directive
angular.module('apps').directive('myConfirmClick', [
    function () {
        return {
            priority: -1,
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function (e) {
                    var message = attrs.myConfirmClick;
                    if (message && !confirm(message)) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        };
    }
]);

'use strict';

//Apps service used to communicate Apps REST endpoints
angular.module('apps').factory('Apps', ['$resource',
	function($resource) {
		return $resource('apps/:appId', { appId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

// Configuring the Users module
angular.module('users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '用户列表', 'users', 'item', '/users', 'false', ['admin']);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
		state('listUsers', {
			url: '/users',
			templateUrl: 'modules/users/views/settings/list-users.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				$scope.success = true;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

        $scope.removeErr = function () {
            $scope.error = false;
        };
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.back = function() {
			window.history.back();
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'DTOptionsBuilder',
    function ($scope, $http, $location, Users, Authentication, DTOptionsBuilder) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Update a user profile
        $scope.updateUserProfile = function (isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function (response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function (response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function () {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

        $scope.find = function () {
            $scope.users = Users.query();
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

        $scope.change = function (user) {
            $scope.success = $scope.error = null;
            user.$update(function () {
                $scope.success = true;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.back = function() {
            window.history.back();
        };
    }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);