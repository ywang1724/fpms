/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 *
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorDashboardController', ['$scope', '$location',
  'Authentication',
  function ($scope, $location, Authentication) {
    $scope.authentication = Authentication;

    /**
     * highcharts配置
     */
    $scope.chartConfig = {
      options:{
        chart: {
          type: 'area'
        },
        tooltip: {
          xDateFormat: '%Y-%m-%d',
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
        type: 'datetime',
        tickInterval: 2419200000,
        labels: {
          formatter: function () {
            return moment(this.value).format('MM-DD')
          }
        },
        tickPositioner: function(min, max) {
          return this.series[0].xData.slice();
        }
      },
      yAxis: [{
        title: {
          text: '访问量'
        }
      }],
      series: [{
        name: '页面访问量',
        data: []
      }],
      title: {
        text: '页面访问趋势'
      }
    };

    /**
     * 接收图表数据
     */
    $scope.$on('chartConfigEvent', function (e, args) {
      $scope.chartConfig.series[0].data = args.numData;
    });

    /**
     * 当改变查询参数时，将值更新到parent scope中
     */
    $scope.changeArgs = function() {
      $scope.parentObj.selectPage = $scope.selectPage;
      // $scope.parentObj.selectBrowser = $scope.selectBrowser;
      $scope.parentObj.selectInterval = $scope.selectInterval;
      $scope.parentObj.fromDate = $scope.fromDate;
      $scope.parentObj.untilDate = $scope.untilDate;
    }

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

  }]);
