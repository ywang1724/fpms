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

    $scope.authentication = Authentication;

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
                enabled: false
              },
              showInLegend: true
            }
          }
        },
        title: {
          text: '访问来源分类'
        },
        series: [{
          name: '占比',
          colorByPoint: true,
          data: []
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
          name: '占比',
          colorByPoint: true,
          data: []
        }]

      };

    $scope.$on('chartConfigEvent', function (e, args) {
      $scope.originConfig.series[0].data = args.origin;
      $scope.searchEngineConfig.series[0].data = args.browser;
    });

  }]);
