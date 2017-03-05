/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorEventController', ['$scope', '$stateParams', '$window','$location',
  'Authentication', 'Apps', 'DTOptionsBuilder', '$http', '$timeout', 'PageService',
  function ($scope, $stateParams, $window, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService) {
    $scope.authentication = Authentication;

    $scope.info={};
    $scope.info.selectEvents = [{key:0,value:'tip'}];

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

    $scope.dtOptions_customEvents = DTOptionsBuilder
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
      .withOption('bAutoWidth', false);

    $scope.redirect = function()  {
      var img = new Image(1, 1);
      img.src = '/_ub.gif/send?' + JSON.stringify({isOpenBehavior: true});
      img.onload = function(){
        $window.open('http://' + $scope.app.host, '_blank');
      };
      img.onerror = function(err){
        SweetAlert.swal('跳转失败!', '服务器开了小差 :)', 'error');
      }
    };

    /**
     * highcharts的funnel图配置
     */
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
        data: []
      }]
    };

    /**
     * 重新调整highcharts图的宽度
     */
    $scope.$on('chartConfigEvent', function (e, args) {
      $scope.funnelConfig.options.chart.width = $('.panel-heading').width();
    });

    /**
     * 向后台取漏斗模型的数据
     */
    $scope.funnelData = [];
    $scope.getData = function ($index) {
      var eventObj = $scope.info.selectEvents[$index].value;
      $http.get('funnel'+'?following='+eventObj._id)
        .success(function (result) {
          $scope.funnelData[$index] =[eventObj.name, result];
        });
    };

    
    /**
     * 展示漏斗图
     */
    $scope.showFunnel = function () {
      $scope.funnelConfig.series[0].data = [];
      for (var i in $scope.funnelData) {
        $scope.funnelConfig.series[0].data.push($scope.funnelData[i]);
      }
    };

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
      $scope.funnelData.splice($index, 1);
    }

  }]);
