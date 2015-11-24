'use strict';

// Apps controller
angular.module('apps').controller('AppsExceptionController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http', '$timeout',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout) {
        $scope.authentication = Authentication;

        //可从后台动态获取数据，以后有时间完成
        $scope.type = 'java';
        $scope.types = ['java', 'node.js', 'android', 'ios'];

        if (Authentication.user) {
            $scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;
        }


        $scope.viewException = function () {
            $scope.showData = true;
            $scope.app = Apps.get({
                appId: $stateParams.appId
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
                        $scope.selectPage = $scope.pages[0];

                        $scope.staticDay = new Date();

                        var getExceptions = function () {
                            $http.get('exceptions', {
                                params: {
                                    pageId: $scope.selectPage._id,
                                    staticDay: new Date($scope.staticDay)
                                }
                            }).success(function(result){
                                if(result.data.exceptions.length >= 1){
                                    $scope.exceptionPie.series[0].data = result.data.pieData;
                                    $scope.exceptionBrowserBar.series[0].data = result.data.browserData;
                                    $scope.exceptions = result.data.exceptions;
                                    $scope.showData = true;
                                }else {
                                    $scope.showData = false;
                                }
                            });
                        };

                        $scope.exceptionBrowserBar = {
                            options: {
                                chart: {
                                    type: 'column',
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                legend: {
                                    enabled: false
                                },
                                tooltip: {
                                    formatter: function () {
                                        return '<h6>' + this.key + '下</h6><br/>' +
                                            '异常数目为：' + this.y;
                                    },
                                    style: {
                                        fontSize: '14px'
                                    }
                                },
                                plotOptions: {
                                    column: {
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function () {
                                                return this.y + '个异常';
                                            }
                                        }
                                    }
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                categories: ['Chrome', 'FireFox', 'Internet Explorer', 'Safari', 'Opera', '其它']
                            },
                            yAxis: {
                                title: {
                                    text: '异常数量'
                                }
                            },
                            series: [{
                                name: '异常量',
                                tooltip: {
                                    valueSuffix: ' 个'
                                },
                                data: []
                            }],
                            title: {
                                text: '异常浏览器分布概况'
                            }
                        };


                        //统计分布异常饼状图
                        $scope.exceptionPie = {
                            options: {
                                chart: {
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                tooltip: {
                                    pointFormat: '数量为:{point.y},{series.name}: <b>{point.percentage:.1f}%</b>',
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
                                text: '异常分布图'
                            },
                            series: [{
                                type: 'pie',
                                name: '占总异常比率',
                                data: []
                            }]
                        };

                        //刷新页面图表
                        $scope.refrashChart = getExceptions;
                        getExceptions();
                    } else {
                        $scope.showChart = false;
                    }
                });






        };









        //返回
        $scope.back = function () {
            window.history.back();
        };

    }
]);
