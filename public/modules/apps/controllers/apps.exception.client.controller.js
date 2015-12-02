'use strict';

// Apps controller
angular.module('apps').controller('AppsExceptionController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService', 'ModalService', 'SweetAlert',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService, ModalService, SweetAlert) {
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
                        if(PageService.getIdentifier() === 2){
                            //表示从应用详情跳转过来
                            $scope.selectPage = $scope.pages.filter(function(elem){
                                return elem._id === PageService.getCurrentPage()._id;
                            })[0];
                        }else{
                            $scope.selectPage = $scope.pages[0];
                        }

                        $scope.staticDay = new Date();

                        var getExceptions = function () {
                            $http.get('exceptions', {
                                params: {
                                    pageId: $scope.selectPage._id,
                                    staticDay: new Date($scope.staticDay)
                                }
                            }).success(function(result){
                                PageService.setIdentifier(1);
                                if(result.data.exceptions.length >= 1){
                                    $scope.exceptionPie.series[0].data = result.data.pieData;
                                    $scope.exceptionBrowserBar.series[0].data = result.data.browserData;
                                    $scope.exceptionTrendLine.series[0].data = result.data.trendData[0];
                                    $scope.exceptionTrendLine.series[1].data = result.data.trendData[1];
                                    $scope.exceptions = result.data.exceptions;
                                    $scope.exceptionsAll = result.data.exceptionsAll;
                                    $scope.exceptionKinds = result.data.exceptionKinds;
                                    //创建os数据临时存放对象和os数组
                                    $scope.osDataObj = {};
                                    $scope.osData = [];
                                    for(var i=0; i<$scope.exceptions.length; i++){
                                        if($scope.osDataObj[$scope.exceptions[i].occurTimeAndUi.ui.os] === undefined){
                                            $scope.osDataObj[$scope.exceptions[i].occurTimeAndUi.ui.os] = 0;
                                        }
                                        $scope.osDataObj[$scope.exceptions[i].occurTimeAndUi.ui.os]++;
                                    }
                                    //将os数据对象转换为数组
                                    $scope.osData = Object.keys($scope.osDataObj).map(function (key) {return [key,$scope.osDataObj[key]];});
                                    $scope.exceptionOsBar.series[0].data = $scope.osData;
                                    $scope.showData = true;
                                }else {
                                    $scope.showData = false;
                                }
                            });
                        };

                        //异常趋势
                        $scope.exceptionTrendLine = {
                            options: {
                                chart: {
                                    type: 'area',
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                legend: {
                                    enabled: true
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
                                    area: {
                                        dataLabels: {
                                            enabled: false
                                        }
                                    }
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00',
                                             '6:00', '7:00', '8:00', '9:00', '10:00', '11:00',
                                             '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                                             '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                            },
                            yAxis: {
                                title: {
                                    text: '异常数量'
                                }
                            },
                            series: [{
                                name: '当前异常发生趋势',
                                tooltip: {
                                    valueSuffix: ' 个'
                                },
                                data: []
                            },{
                                name: '历史异常情况平均值',
                                tooltip: {
                                    valueSuffix: ' 个'
                                },
                                data: []
                            }],
                            title: {
                                text: '异常发生趋势'
                            }
                        };


                        //异常浏览器统计概况柱状图
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
                                text: '异常浏览器统计概况'
                            }
                        };

                        //异常发生平台统计概况柱状图
                        $scope.exceptionOsBar = {
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
                            yAxis: {
                                title: {
                                    text: '异常数量'
                                }
                            },
                            xAxis: {
                                type: 'category',
                                title: {
                                    text: '平台',
                                    align: 'high'
                                }
                            },
                            series: [{
                                name: '异常量',
                                tooltip: {
                                    valueSuffix: ' 个'
                                },
                                color: '#8085E9',
                                data: []
                            }],
                            title: {
                                text: '异常发生平台统计概况'
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


        /**
         * 异常详细信息查看
         * TODO：弹出层查看异常详情信息
         */
        $scope.viewExceptionDetail = function (exception) {
            console.log(exception);
            var page = $scope.pages.filter(function (elem){
                return elem._id === exception.page;
            })[0];
            //查看本次异常详情
            ModalService.showModal({
                templateUrl: 'modules/apps/views/exception/view-exceptionModal.client.view.html',
                inputs: {
                    title: '异常详情',
                    exception: exception,
                    page: page
                },
                controller: function($scope, close, title, exception, page){
                    $scope.title = title;
                    $scope.exception = exception;
                    $scope.page = page;
                    $scope.close = function (result){
                        close(result, 200);
                    };
                }
            }).then(function (modal) {
                modal.element.show();
                modal.close.then(function (result) {
                    console.log(result);
                });
            });


        };

        /**
         * 异常种类详情查看
         * TODO：弹出层查看异常种类信息
         */
        $scope.viewExceptionKindDetail = function (exceptionKind) {
            //异常种类详情查看
            console.log(exceptionKind);
            var exceptions = $scope.exceptionsAll.filter(function (elem){
                return elem._id === exceptionKind._id;
            });

            var dtOptions = DTOptionsBuilder
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
                .withOption('responsive', true)
                .withOption('scrollY', 220);
            //查看本次异常详情
            ModalService.showModal({
                templateUrl: 'modules/apps/views/exception/view-exceptionKindModal.client.view.html',
                inputs: {
                    title: '该异常种类发生情况',
                    exceptions: exceptions,
                    dtOptions: dtOptions
                },
                controller: function($scope, close, title, exceptions, dtOptions){
                    $scope.title = title;
                    $scope.exceptions = exceptions;
                    $scope.dtOptions = dtOptions;
                    $scope.close = function (result){
                        close(result, 200);
                    };
                }
            }).then(function (modal) {
                modal.element.show();
                modal.close.then(function (result) {
                    console.log(result);
                });
            });
        };

        /**
         * 切换异常种类报警与否
         * @param exceptionKind
         */
        $scope.changeIsAlarm = function (exceptionKind) {
            exceptionKind.isAlarm = exceptionKind.isAlarm === 1 ? 2: 1;
            $http.put('exceptions/' + exceptionKind._id, {exception: exceptionKind}).then(function(result){
                $scope.exceptionKinds.splice($scope.exceptionKinds.indexOf(exceptionKind), 1, result.data);
                SweetAlert.swal('切换成功！');
            }, function(err){
                SweetAlert.swal('切换失败!');
            });
        };

        /**
         * 切换至性能监控页面
         */
        $scope.gotoPerformance = function (){
            if($scope.selectPage.pathname === '全部'){
                $location.path('apps/performance/' + $scope.app._id);
            } else {
                PageService.setCurrentPage({'_id': $scope.selectPage._id, 'pathname': $scope.selectPage.pathname});
                PageService.setIdentifier(2);
                $location.path('apps/performance/' + $scope.app._id);
            }
        };

        //返回
        $scope.back = function () {
            window.history.back();
        };

        //datatble配置
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

    }
]);
