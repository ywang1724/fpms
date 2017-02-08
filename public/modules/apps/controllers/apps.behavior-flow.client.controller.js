/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorFlowController', ['$scope', '$stateParams', '$location',
  'Authentication', 'Apps', 'DTOptionsBuilder', '$http', '$timeout', 'PageService',
  function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService) {
    $scope.authentication = Authentication;

    $scope.viewFlow = function () {
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

      //highcharts来源分类配置
      $scope.originConfig = {
        options:{
          chart: {
            type: 'pie'
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
        title: {
          text: '访问来源分类'
        },
        series: [{
          name: '来源',
          colorByPoint: true,
          data: [{
            name: '直接输入网址或书签',
            y: 12,
            sliced: true,
            selected: true
          }, {
            name: '站内来源',
            y: 123
          }, {
            name: '其他外部链接',
            y: 124
          }, {
            name: '搜索引擎',
            y: 345
          }]
        }]
      };

      //highcharts搜索引擎配置
      $scope.searchEngineConfig = {
        options:{
          chart: {
            type: 'pie'
            },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
          }
        },
        title: {
          text: '搜索引擎'
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: [{
            name: '谷歌',
            y: 56.33
          }, {
            name: '百度',
            y: 24.03,
            sliced: true,
            selected: true
          }, {
            name: '360搜索',
            y: 10.38
          }, {
            name: '搜狗',
            y: 10.38
          }, {
            name: '神马',
            y: 4.77
          }, {
            name: '其它',
            y: 0.91
          }]
        }]

      };
    };

  }]);
