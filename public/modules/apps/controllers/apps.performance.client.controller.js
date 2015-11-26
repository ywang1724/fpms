'use strict';

// Apps controller
angular.module('apps').controller('AppsPerformanceController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService) {
        $scope.authentication = Authentication;

        //可从后台动态获取数据，以后有时间完成
        $scope.type = 'java';
        $scope.types = ['java', 'node.js', 'android', 'ios'];

        if (Authentication.user) {
            $scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;
        }

        // Find existing App
        $scope.viewPerformance = function () {
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
                },
                global: {
                    useUTC: false
                }
            });
            $http.get('pages/' + $stateParams.appId).
                success(function (data) {
                    $scope.pagesNum = data.length || 0;
                    if (data.length) {
                        $scope.showChart = true;
                        //页面选择
                        var ids = [];
                        for (var i = 0; i < data.length; i++) {
                            ids.push(data[i]._id);
                        }
                        $scope.pages = [{'_id':ids, 'pathname':'全部'}].concat(data);
                        if(PageService.getIdentifier() === 2){
                            //表示从应用详情跳转过来
                            $scope.selectPage = $scope.pages.filter(function(elem){
                                return elem._id === PageService.getCurrentPage()._id;
                            })[0];
                        }else{
                            $scope.selectPage = $scope.pages[0];
                        }
                        //统计间隔
                        $scope.intervals = [
                            {'name': '日', 'id': 'day'}, {'name': '月', 'id': 'month'}, {'name': '年', 'id': 'year'}
                        ];
                        $scope.selectInterval = $scope.intervals[0];
                        //浏览器分类
                        $scope.browsers = [
                            {'name': '全部', 'id': 'all'},
                            {'name': 'Internet Explorer', 'id': 'Internet Explorer'}, {'name': 'Chrome', 'id': 'Chrome'},
                            {'name': 'Android Webkit Browser', 'id': 'Android Webkit Browser'},
                            {'name': 'Firefox', 'id': 'Firefox'}, {'name': 'Safari', 'id': 'Safari'}
                        ];
                        $scope.selectBrowser = $scope.browsers[0];
                        //统计量
                        $scope.statistics = [
                            {'name': '平均值', 'id': 'mean'}, {'name': '中位数', 'id': 'median'},
                            {'name': 'p90', 'id': 'quantile_90'}
                        ];
                        $scope.selectStatistic = $scope.statistics[0];
                        //日期范围初始化
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
                            switch ($scope.selectStatistic.id) {
                                case 'mean':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（平均值）';
                                    break;
                                case 'median':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（中位数）';
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
                                PageService.setIdentifier(1);
                                if (result.statisticData.sum > 0) {
                                    $scope.chartConfig.series[0].data = result.numData;
                                    $scope.chartConfig.series[1].data = result.pageLoadData;
                                    $scope.chartConfig.series[2].data = result.networkData;
                                    $scope.chartConfig.series[3].data = result.backendData;
                                    $scope.chartConfig.series[4].data = result.frontendData;
                                    $scope.chartConfig.series[5].data = result.redirectData;
                                    $scope.chartConfig.series[6].data = result.dnsData;
                                    $scope.chartConfig.series[7].data = result.connectData;
                                    $scope.chartConfig.series[8].data = result.waitingData;
                                    $scope.chartConfig.series[9].data = result.receivingData;
                                    $scope.chartConfig.series[10].data = result.processingData;
                                    $scope.chartConfig.series[11].data = result.contentLoadedData;
                                    $scope.chartConfig.series[12].data = result.onLoadData;
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
                                    $scope.timingline.series[0].data = [
                                        [result.statisticData.dnsTime * 1, (result.statisticData.dnsTime * 1) + (result.statisticData.dns * 1)],
                                        [result.statisticData.connectTime * 1, (result.statisticData.connectTime * 1) + (result.statisticData.connect * 1)],
                                        [result.statisticData.requestTime * 1, (result.statisticData.requestTime * 1) + (result.statisticData.waiting * 1)],
                                        [result.statisticData.receiveTime * 1, (result.statisticData.receiveTime * 1) + (result.statisticData.receiving * 1)],
                                        [result.statisticData.processTime * 1, (result.statisticData.processTime * 1) + (result.statisticData.processing * 1)],
                                        [result.statisticData.contentLoadedTime * 1, (result.statisticData.contentLoadedTime * 1) + (result.statisticData.contentLoaded * 1)],
                                        [result.statisticData.onLoadTime * 1, (result.statisticData.onLoadTime * 1) + (result.statisticData.onLoad * 1)],
                                        [0, result.statisticData.pageLoadTime * 1]
                                    ];
                                    $scope.statisticData = result.statisticData;
                                    $scope.showData = true;
                                } else {
                                    $scope.showData = false;
                                }
                            });
                        };

                        $scope.chartConfig = {
                            options: {
                                chart: {
                                    width: $('.tabWidth').width()
                                },
                                tooltip: {
                                    xDateFormat: '%Y-%m-%d',
                                    shared: true,
                                    style: {
                                        fontSize: '14px'
                                    }
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
                                                        var pageLoad = [], redirect = [], dns = [], connect = [],
                                                            waiting = [], receiving = [], processing = [], contentLoaded = [],
                                                            onLoad = [];
                                                        for (var i = 0; i < result.data.length; i++) {
                                                            var dateNum = Date.parse(result.data[i].created);
                                                            pageLoad.push([dateNum, result.data[i].pageLoad]);
                                                            waiting.push([dateNum, result.data[i].waiting]);
                                                            receiving.push([dateNum, result.data[i].receiving]);
                                                            contentLoaded.push([dateNum, result.data[i].contentLoaded]);
                                                            redirect.push([dateNum, result.data[i].redirect]);
                                                            dns.push([dateNum, result.data[i].dns]);
                                                            connect.push([dateNum, result.data[i].connect]);
                                                            processing.push([dateNum, result.data[i].processing]);
                                                            onLoad.push([dateNum, result.data[i].onLoad]);
                                                        }
                                                        $scope.timingArea.series[0].data = pageLoad;
                                                        $scope.timingArea.series[1].data = redirect;
                                                        $scope.timingArea.series[2].data = dns;
                                                        $scope.timingArea.series[3].data = connect;
                                                        $scope.timingArea.series[4].data = waiting;
                                                        $scope.timingArea.series[5].data = receiving;
                                                        $scope.timingArea.series[6].data = processing;
                                                        $scope.timingArea.series[7].data = contentLoaded;
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
                                name: 'DNS查询耗时',
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
                                name: '等待响应耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '接收文档耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM处理耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM内容加载耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'load事件耗时',
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
                                    plotShadow: false,
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                                    style: {
                                        fontSize: '14px'
                                    }
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
                        $scope.timingArea = {
                            options: {
                                chart: {
                                    type: 'areaspline',
                                    zoomType: 'x',
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
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
                                    xDateFormat: '%Y-%m-%d %H:%M:%S',
                                    shared: true,
                                    style: {
                                        fontSize: '14px'
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
                                name: '页面跳转耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DNS查询耗时',
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
                                name: '等待响应耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '接收文档耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM处理耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM内容加载耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'load事件耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: '真实请求趋势图'
                            }
                        };
                        $scope.timingline = {
                            options: {
                                chart: {
                                    type: 'columnrange',
                                    inverted: true,
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                legend: {
                                    enabled: false
                                },
                                tooltip: {
                                    formatter: function () {
                                        return '<h6>' + this.key + '</h6><br/><table><tr><td>耗时: </td><td><b>' +
                                            (this.point.high - this.point.low).toFixed(2) + ' ms' + '</b></td></tr></table>';
                                    },
                                    style: {
                                        fontSize: '14px'
                                    }
                                },
                                plotOptions: {
                                    columnrange: {
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function () {
                                                return this.y.toFixed(2) + 'ms';
                                            }
                                        }
                                    }
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                categories: ['DNS查询', '连接', '等待响应', '接收文档', 'DOM处理', 'DOM内容加载', 'load事件', '总耗时']
                            },
                            yAxis: {
                                title: {
                                    text: '时间线（ms）'
                                }
                            },
                            series: [{
                                name: '耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: '加载时间线'
                            }
                        };
                        $scope.refrashChart = getTimings;
                        getTimings();
                        //$scope.reflow = function () {
                        //    for (var i = 0; i < Highcharts.charts.length; i++) {
                        //        if (Highcharts.charts[i]) {
                        //            Highcharts.charts[i].reflow();
                        //        }
                        //    }
                        //};
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
            .withBootstrap()
            .withBootstrapOptions({
                pagination: {
                    classes: {
                        ul: 'pagination pagination-sm'
                    }
                }
            })
            .withOption('responsive', true);


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

        /**
         * 切换至异常监控页面
         */
        $scope.gotoException = function (){
            if($scope.selectPage.pathname === '全部'){
                $location.path('apps/exception/' + $scope.app._id);
            } else {
                PageService.setCurrentPage({'_id': $scope.selectPage._id, 'pathname': $scope.selectPage.pathname});
                PageService.setIdentifier(2);
                $location.path('apps/exception/' + $scope.app._id);
            }
        };

        $scope.httpNumTooltip = {
            'title': '包括HTML页面请求，CSS文件、JavaScript文件、图片等资源下载及其它网络请求。'
        };
        $scope.dnsTimeTooltip = {
            'title': '开始进行DNS查询的时间。'
        };
        $scope.connectTimeTooltip = {
            'title': '开始请求连接的时间。'
        };
        $scope.reqTimeTooltip = {
            'title': '浏览器开始请求文档时间。'
        };
        $scope.resTimeTooltip = {
            'title': '浏览器开始接收文档时间。'
        };
        $scope.parseTimeTooltip = {
            'title': '浏览器开始解析HTML文档第一批收到的字节。'
        };
        $scope.reactiveTimeTooltip = {
            'title': '浏览器完成解析并且所有HTML和DOM构建完毕的时间点。'
        };
        $scope.DOMReadyTimeTooltip = {
            'title': '浏览器触发DOMContentLoaded事件的时间。'
        };
        $scope.ResourcesLoadedTimeTooltip = {
            'title': '浏览器完成网页及其所有附属资源下载的时间。'
        };
        $scope.onLoadTimeTooltip = {
            'title': '浏览器开始触发load事件的时间。'
        };
        $scope.pageLoadTimeTooltip = {
            'title': '浏览器完成页面完全加载时间，包括所有onLoad事件以及相关的动态资源加载完成。'
        };
        $scope.pageLoadTooltip = {
            'title': '从页面请求到页面完全加载的时间。'
        };
        $scope.networkTooltip = {
            'title': '从发出请求到完成连接建立的时间。'
        };
        $scope.backendTooltip = {
            'title': '指收到请求后服务器逻辑处理的时间。'
        };
        $scope.frontendTooltip = {
            'title': '从开始解析文档到页面完全加载的时间。'
        };
        $scope.redirectTooltip = {
            'title': '页面请求后进行页面跳转所消耗的时间。'
        };
        $scope.dnsTooltip = {
            'title': 'DNS查询的时间。页面请求会产生一次寻找该页面资源所在主机的DNS查询。在同个域名进行页面切换不会造成新的DNS查询。'
        };
        $scope.connectTooltip = {
            'title': '指浏览器和服务器之间建立TCP/IP连接的时间，对于SSL连接包括握手的时间。'
        };
        $scope.waitingTooltip = {
            'title': '指从开始请求当前文档到开始接收响应的时间。'
        };
        $scope.receivingTooltip = {
            'title': '指开始接收响应到完成收到响应的时间。'
        };
        $scope.DOMProcessingTooltip = {
            'title': '指从完成收到响应到文档的readyState变为complete的时间。'
        };
        $scope.DOMContentLoadedTooltip = {
            'title': '指从文档的DOMContentLoaded事件被触发到文档的DOMContentLoaded事件完成的时间。'
        };
        $scope.onLoadTooltip = {
            'title': '指从文档的load事件被触发到文档的load事件完成的时间。'
        };
    }
]);
