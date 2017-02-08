/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 *
 * TODO
 * 1. 月、年的统计
 * 2. 列表显示
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorDashboardController', ['$scope', '$stateParams', '$location',
  'Authentication', 'Apps', 'DTOptionsBuilder', '$http', '$timeout', 'PageService',
  function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService) {
    $scope.authentication = Authentication;

    $scope.viewBehavior = function () {
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
          $scope.pages = [{'_id':ids, 'pathname': '全部'}].concat(data);
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
            {'name': 'chrome', 'id': 'chrome'}, {'name': 'opera', 'id': 'opera'},
            {'name': 'ie', 'id': 'ie'},{'name': 'gecko', 'id': 'gecko'},
            {'name': 'safari', 'id': 'safari'}, {'name': 'firefox', 'id': 'firefox'}
          ];
          $scope.selectBrowser = $scope.browsers[0];

          //日期范围初始化
          var now = new Date();
          $scope.nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
          $scope.fromDate = $scope.nowDate - 1296000000; //往前15天
          $scope.untilDate = $scope.nowDate;

          var getBehaviors = function() {
            $scope.details = [];
            var trueFromDate, trueUntilDate;
            switch ($scope.selectInterval.id) {
              case 'day':
                trueFromDate = $scope.fromDate;
                trueUntilDate = $scope.untilDate + 86400000;
                $scope.chartConfig.xAxis.tickInterval = 86400000; //1天
                $scope.chartConfig.xAxis.labels.formatter = function () {
                  return moment(this.value).format('MM-DD')
                };
                $scope.chartConfig.options.tooltip.xDateFormat = '%Y-%m-%d';
                break;
              case 'month':
                trueFromDate = Date.UTC((new Date($scope.fromDate)).getFullYear(), (new Date($scope.fromDate)).getMonth());
                trueUntilDate = Date.UTC((new Date($scope.untilDate)).getFullYear(), (new Date($scope.untilDate)).getMonth() + 1);
                $scope.chartConfig.xAxis.tickInterval = 2419200000; //28天
                $scope.chartConfig.xAxis.labels.formatter = function () {
                  return moment(this.value).format('YYYY-MM')
                };
                $scope.chartConfig.options.tooltip.xDateFormat = '%Y.%m';
                break;
              case 'year':
                trueFromDate = Date.UTC((new Date($scope.fromDate)).getFullYear(), 0);
                trueUntilDate = Date.UTC((new Date($scope.untilDate)).getFullYear() + 1, 0);
                $scope.chartConfig.xAxis.tickInterval = 31104000000; //360天
                $scope.chartConfig.xAxis.labels.formatter = function () {
                  return moment(this.value).format('YYYY')
                };
                $scope.chartConfig.options.tooltip.xDateFormat = '%Y';
                break;
            }
            $http.get('behaviors', {
              params: {
                pageId: $scope.selectPage._id,
                fromDate: +(new Date(trueFromDate)),
                untilDate: +(new Date(trueUntilDate)),
                interval: $scope.selectInterval.id,
                browser: $scope.selectBrowser.id
              }
            }).success(function (result) {
              PageService.setIdentifier(1);
              if (result.statisticData.sum > 0) {
                $scope.chartConfig.series[0].data = result.numData;
                $scope.statisticData = result.statisticData;
                $scope.showData = true;
              } else {
                $scope.showData = false;
              }
            })
          };

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
          }

          $scope.refrashChart = getBehaviors;
          getBehaviors();
        }
      })
    };

    $scope.removeErr = function () {
      $scope.error = false;
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
