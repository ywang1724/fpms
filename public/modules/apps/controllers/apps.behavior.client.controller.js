/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorController', ['$scope', '$stateParams', '$location',
  'Authentication', 'Apps', 'DTOptionsBuilder', '$http', '$timeout', 'PageService',
  function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService) {
    $scope.authentication = Authentication;

    $scope.initBehavior = function () {
      $scope.showData = true;
      $scope.customEvents = [{'_id':1,'name':'请选择指定事件'}];
      $scope.selectEvent = $scope.customEvents[0];
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
      $http.get('pages/' + $stateParams.appId)
        .success(function (data) {
        $scope.pagesNum = data.length || 0;
        if (data.length) {
          $scope.showChart = true;
          $scope.parentObj = {}; //与child scope进行数据绑定的过渡对象

          //页面选择
          // var ids = [];
          // for (var i = 0; i < data.length; i++) {
          //   ids.push(data[i]._id);
          // }
          // $scope.pages = [{'_id':ids, 'name': '全部'}].concat(data);
          // if(PageService.getIdentifier() === 2){
          //   //表示从应用详情跳转过来
          //   $scope.selectPage = $scope.pages.filter(function(elem){
          //     return elem._id === PageService.getCurrentPage()._id;
          //   })[0];
          // }else{
          //   $scope.selectPage = $scope.pages[0];
          // }
          $scope.selectPageData = [];
          var ids=[];
          for (var i=0; i<data.length; i++) {
            $scope.selectPageData.push({name:data[i].pathname, id: data[i]._id});
            ids.push(data[i]._id);
          }
          $scope.selectPage = {'id': ids, 'name':'全部'};

          $scope.selectPageFunc = function (obj) {
            if (obj) {
              if (obj.description && obj.description == '') {
                $scope.selectPage = {'id': ids, 'name':'全部'}
              } else {
                $scope.selectPage = obj.description;
              }
            } else {
              $scope.selectPage.id = '';
            }
          };
          $scope.focusOutFunc = function () {
            if(!$('#ex1_val').val()) {
              $scope.selectPage = {'id': ids, 'name':'全部'};
            }
          };


          //统计间隔
          $scope.intervals = [
            {'name': '日', 'id': 'day'}, {'name': '月', 'id': 'month'}, {'name': '年', 'id': 'year'}
          ];
          $scope.selectInterval = $scope.intervals[0];

          //浏览器分类
          // $scope.browsers = [
          //   {'name': '全部', 'id': 'all'},
          //   {'name': 'Internet Explorer', 'id': 'Internet Explorer'}, {'name': 'Chrome', 'id': 'Chrome'},
          //   {'name': 'Android Webkit Browser', 'id': 'Android Webkit Browser'},
          //   {'name': 'Firefox', 'id': 'Firefox'}, {'name': 'Safari', 'id': 'Safari'}
          // ];
          // $scope.selectBrowser = $scope.browsers[0];

          //日期范围初始化
          var now = new Date();
          $scope.nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
          $scope.fromDate = $scope.nowDate - 1296000000; //往前15天
          $scope.untilDate = $scope.nowDate;

          $scope.parentObj.selectPage = $scope.selectPage;
          // $scope.parentObj.selectBrowser = $scope.selectBrowser;
          $scope.parentObj.selectInterval = $scope.selectInterval;
          $scope.parentObj.fromDate = $scope.fromDate;
          $scope.parentObj.untilDate = $scope.untilDate;

          var getBehaviors = function() {
            var trueFromDate, trueUntilDate;
            switch ($scope.parentObj.selectInterval.id) {
              case 'day':
                trueFromDate = $scope.parentObj.fromDate;
                trueUntilDate = $scope.parentObj.untilDate + 86400000;
                // $scope.chartConfig.xAxis.tickInterval = 86400000; //1天
                // $scope.chartConfig.xAxis.labels.formatter = function () {
                //   return moment(this.value).format('MM-DD')
                // };
                // $scope.chartConfig.options.tooltip.xDateFormat = '%Y-%m-%d';
                break;
              case 'month':
                trueFromDate = Date.UTC((new Date($scope.parentObj.fromDate)).getFullYear(), (new Date($scope.parentObj.fromDate)).getMonth());
                trueUntilDate = Date.UTC((new Date($scope.parentObj.untilDate)).getFullYear(), (new Date($scope.parentObj.untilDate)).getMonth() + 1);
                // $scope.chartConfig.xAxis.tickInterval = 2419200000; //28天
                // $scope.chartConfig.xAxis.labels.formatter = function () {
                //   return moment(this.value).format('YYYY-MM')
                // };
                // $scope.chartConfig.options.tooltip.xDateFormat = '%Y.%m';
                break;
              case 'year':
                trueFromDate = Date.UTC((new Date($scope.parentObj.parentObj.fromDate)).getFullYear(), 0);
                trueUntilDate = Date.UTC((new Date($scope.parentObj.untilDate)).getFullYear() + 1, 0);
                // $scope.chartConfig.xAxis.tickInterval = 31104000000; //360天
                // $scope.chartConfig.xAxis.labels.formatter = function () {
                //   return moment(this.value).format('YYYY')
                // };
                // $scope.chartConfig.options.tooltip.xDateFormat = '%Y';
                break;
            }

            $http.get('behaviors', {
              params: {
                pageId: $scope.selectPage.id,
                fromDate: +(new Date(trueFromDate)),
                untilDate: +(new Date(trueUntilDate)),
                interval: $scope.parentObj.selectInterval.id
                // browser: $scope.parentObj.selectBrowser.id
              }
            }).success(function (result) {
              PageService.setIdentifier(1);
              if (result.statisticData.sum > 0) {
                $scope.$broadcast('chartConfigEvent',{
                  numData:result.numData,
                  origin: result.origin,
                  browser: result.browser
                });
                $scope.listData = result.listData;
                $scope.statisticData = result.statisticData;
                $scope.showData = true;
              } else {
                $scope.showData = false;
              }
            })
          };

          $scope.refrashChart = getBehaviors;
          getBehaviors();
        }
      });

      $http.get('custom/' + $stateParams.appId)
        .success(function (data) {
          for (var i=0;i<data.length;i++) {
            $scope.customEvents.push({'_id':data[i]._id,'name':data[i].name});
          }

        })

    };



    $scope.back = function () {
      window.history.back();
    };
  }]);
