/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorEventController', ['$scope', '$stateParams', '$location',
  'Authentication', 'Apps', 'DTOptionsBuilder', '$http', '$timeout', 'PageService',
  function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService) {
    $scope.authentication = Authentication;

    $scope.viewEvent = function () {
      $scope.showData = true;
      $scope.showChart = true;
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
    };

    $scope.redirect = function()  {
      location.href = $('#redirectURL').val();
      document.cookie = 'customEvent=true';
    };

    $scope.funnelConfig = {
      options: {
        chart: {
          type: 'funnel',
          marginRight: 100
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b> ({point.y:,.0f})',
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              softConnector: true
            },
            neckWidth: '30%',
            neckHeight: '25%'

            //-- Other available options
            // height: pixels or percent
            // width: pixels or percent
          }
        },
      },
      title: {
        text: '',
      },

      legend: {
        enabled: false
      },
      series: [{
        name: 'Unique users',
        data: [
          ['Website visits', 15654],
          ['Downloads', 4064],
          ['Requested price list', 1987],
          ['Invoice sent', 976],
          ['Finalized', 846]
        ]
      }]
    };

    $scope.$on('chartConfigEvent', function (e, args) {
      $scope.funnelConfig.options.chart.width = $('.panel-heading').width();
    });

    // $scope.events = [{'_id':1,'name':'请选择指定事件'},{'_id':2,'name':'请选择指定aa'}];
    // $scope.selectEvent = $scope.events[0];

    $scope.info={};
    $scope.info.selectEvents = [{key:0,value:'tip'}];

    /**
     * 添加漏斗事件节点
     */
    $scope.info.add = function ($index) {
      $scope.info.selectEvents.splice($index + 1, 0, {key: $index + 1, value: ''});
    };
    /**
     * 删除漏斗事件节点
     */
    $scope.info.delete = function ($index) {
      $scope.info.selectEvents.splice($index, 1);
    }

  }]);
