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

    var data = [
      {
        "hc-key": "tw-ph",
        "value": 0
      },
      {
        "hc-key": "cn-sh",
        "value": 1
      },
      {
        "hc-key": "tw-km",
        "value": 2
      },
      {
        "hc-key": "cn-zj",
        "value": 3
      },
      {
        "hc-key": "tw-lk",
        "value": 4
      },
      {
        "hc-key": "cn-3664",
        "value": 5
      },
      {
        "hc-key": "cn-3681",
        "value": 6
      },
      {
        "hc-key": "cn-fj",
        "value": 7
      },
      {
        "hc-key": "cn-gd",
        "value": 8
      },
      {
        "hc-key": "tw-tw",
        "value": 9
      },
      {
        "hc-key": "tw-cs",
        "value": 10
      },
      {
        "hc-key": "cn-6657",
        "value": 11
      },
      {
        "hc-key": "cn-6663",
        "value": 12
      },
      {
        "hc-key": "cn-6665",
        "value": 13
      },
      {
        "hc-key": "cn-6666",
        "value": 14
      },
      {
        "hc-key": "cn-6667",
        "value": 15
      },
      {
        "hc-key": "cn-6669",
        "value": 16
      },
      {
        "hc-key": "cn-6670",
        "value": 17
      },
      {
        "hc-key": "cn-6671",
        "value": 18
      },
      {
        "hc-key": "tw-kh",
        "value": 19
      },
      {
        "hc-key": "tw-hs",
        "value": 20
      },
      {
        "hc-key": "cn-yn",
        "value": 21
      },
      {
        "hc-key": "cn-xz",
        "value": 22
      },
      {
        "hc-key": "tw-hh",
        "value": 23
      },
      {
        "hc-key": "tw-cl",
        "value": 24
      },
      {
        "hc-key": "tw-ml",
        "value": 25
      },
      {
        "hc-key": "cn-nx",
        "value": 26
      },
      {
        "hc-key": "cn-sa",
        "value": 27
      },
      {
        "hc-key": "tw-ty",
        "value": 28
      },
      {
        "hc-key": "cn-3682",
        "value": 29
      },
      {
        "hc-key": "tw-cg",
        "value": 30
      },
      {
        "hc-key": "cn-6655",
        "value": 31
      },
      {
        "hc-key": "cn-ah",
        "value": 32
      },
      {
        "hc-key": "cn-hu",
        "value": 33
      },
      {
        "hc-key": "tw-hl",
        "value": 34
      },
      {
        "hc-key": "tw-th",
        "value": 35
      },
      {
        "hc-key": "cn-6656",
        "value": 36
      },
      {
        "hc-key": "tw-nt",
        "value": 37
      },
      {
        "hc-key": "cn-6658",
        "value": 38
      },
      {
        "hc-key": "cn-6659",
        "value": 39
      },
      {
        "hc-key": "cn-cq",
        "value": 40
      },
      {
        "hc-key": "cn-hn",
        "value": 41
      },
      {
        "hc-key": "tw-yl",
        "value": 42
      },
      {
        "hc-key": "cn-6660",
        "value": 43
      },
      {
        "hc-key": "cn-6661",
        "value": 44
      },
      {
        "hc-key": "cn-6662",
        "value": 45
      },
      {
        "hc-key": "cn-6664",
        "value": 46
      },
      {
        "hc-key": "cn-6668",
        "value": 47
      },
      {
        "hc-key": "tw-pt",
        "value": 48
      },
      {
        "hc-key": "tw-tt",
        "value": 49
      },
      {
        "hc-key": "tw-tn",
        "value": 50
      },
      {
        "hc-key": "cn-bj",
        "value": 51
      },
      {
        "hc-key": "cn-hb",
        "value": 52
      },
      {
        "hc-key": "tw-il",
        "value": 53
      },
      {
        "hc-key": "tw-tp",
        "value": 54
      },
      {
        "hc-key": "cn-sd",
        "value": 55
      },
      {
        "hc-key": "tw-ch",
        "value": 56
      },
      {
        "hc-key": "cn-tj",
        "value": 57
      },
      {
        "hc-key": "cn-ha",
        "value": 58
      },
      {
        "hc-key": "cn-jl",
        "value": 59
      },
      {
        "hc-key": "cn-qh",
        "value": 60
      },
      {
        "hc-key": "cn-xj",
        "value": 61
      },
      {
        "hc-key": "cn-nm",
        "value": 62
      },
      {
        "hc-key": "cn-hl",
        "value": 63
      },
      {
        "hc-key": "cn-sc",
        "value": 64
      },
      {
        "hc-key": "cn-gz",
        "value": 65
      },
      {
        "hc-key": "cn-gx",
        "value": 66
      },
      {
        "hc-key": "cn-ln",
        "value": 67
      },
      {
        "hc-key": "cn-js",
        "value": 68
      },
      {
        "hc-key": "cn-gs",
        "value": 69
      },
      {
        "hc-key": "cn-sx",
        "value": 70
      },
      {
        "hc-key": "cn-he",
        "value": 71
      },
      {
        "hc-key": "cn-jx",
        "value": 72
      }
    ];

    //highmaps配置
    $scope.mapsConfig = {
      options: {
        legend: {
          enabled: false
        },
        plotOptions: {
          map: {
            mapData: Highcharts.maps['countries/cn/custom/cn-all-sar-taiwan'],
            joinBy: ['hc-key'],
            name:'你好',
            dataLabels: {
              enabled: true,
              format: '{point.name}'
            }
          }
        },
      },
      chartType: 'map',
      title: {
        text: 'Highcharts-ng map example'
      },
      series: [{
        data: data,
        states: {
          hover: {
            color: '#BADA55'
          }
        }
      }
      ]
    }

    $scope.pathOptions = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.4f')(d);
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 30
        }
      }
    };

    $scope.pathData = [{
      key: "Cumulative Return",
      values: [
        { "label" : "A" , "value" : -29.765957771107 },
        { "label" : "B" , "value" : 0 },
        { "label" : "C" , "value" : 32.807804682612 },
        { "label" : "D" , "value" : 196.45946739256 },
        { "label" : "E" , "value" : 0.19434030906893 },
        { "label" : "F" , "value" : -98.079782601442 },
        { "label" : "G" , "value" : -13.925743130903 },
        { "label" : "H" , "value" : -5.1387322875705 }
      ]
    }];

    $scope.$on('chartConfigEvent', function (e, args) {
      $scope.originConfig.series[0].data = args.origin;
      $scope.originConfig.options.chart.width = $('.panel-heading').width();
      $scope.searchEngineConfig.series[0].data = args.browser;
      $scope.searchEngineConfig.options.chart.width = $('.panel-heading').width();
    });

  }]);
