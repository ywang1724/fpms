'use strict';

// 初始化应用配置模块
var ApplicationConfiguration = (function() {
	// 初始化模块配置
	var applicationModuleName = 'fpms';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
		'ui.router', 'ui.bootstrap', 'ui.utils', 'datatables', 'datatables.bootstrap', 'datatables.scroller',
		'mgcrea.ngStrap', 'ngLocale', 'highcharts-ng', 'ngClipboard', 'angularModalService', 'oitozero.ngSweetAlert','angucomplete-alt'];

	// 添加一个新的垂直模块
	var registerModule = function(moduleName, dependencies) {
		// 添加angular模块
		angular.module(moduleName, dependencies || []);

		// 添加模块到AngularJS配置文件
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('apps');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('mails');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Apps module
angular.module('apps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '我的应用', 'apps', 'dropdown', '/apps(/create)?', 'false', ['user']);
		Menus.addSubMenuItem('topbar', 'apps', '应用列表', 'apps');
		Menus.addSubMenuItem('topbar', 'apps', '添加应用', 'apps/create');

		Menus.addMenuItem('topbar', '应用列表', 'apps', 'item', '/apps', 'false', ['admin']);
	}
]);

angular.module('apps').config(['$datepickerProvider', function($datepickerProvider) {
    angular.extend($datepickerProvider.defaults, {
        animation: 'am-flip-x',
        autoclose: true,
        dateType: 'number'
    });
}]);

angular.module('apps').config(['$selectProvider', function($selectProvider) {
    angular.extend($selectProvider.defaults, {
        animation: 'am-flip-x'
    });
}]);

angular.module('apps').config(['$tooltipProvider', function($tooltipProvider) {
    angular.extend($tooltipProvider.defaults, {
        animation: 'am-flip-x',
        trigger: 'hover',
        placement: 'bottom',
        type: 'success'
    });
}]);

angular.module('apps').config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath('lib/zeroclipboard/dist/ZeroClipboard.swf');
}]);

'use strict';

//Setting up route
angular.module('apps').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('listApps', {
			url: '/apps',
			templateUrl: 'modules/apps/views/app/list-apps.client.view.html'
		}).
		state('createApp', {
			url: '/apps/create',
			templateUrl: 'modules/apps/views/app/create-app.client.view.html'
		}).
		state('editApp', {
			url: '/apps/:appId/edit',
			templateUrl: 'modules/apps/views/app/edit-app.client.view.html'
		}).
		state('viewApp', {
			url: '/apps/:appId',
			templateUrl: 'modules/apps/views/app/view-app.client.view.html'
		}).
		state('viewAppPerformance', {
			url: '/apps/performance/:appId',
			templateUrl: 'modules/apps/views/performance/view-performance.client.view.html'
		}).
		state('viewAppException', {
			url: '/apps/exception/:appId',
			templateUrl: 'modules/apps/views/exception/view-exception.client.view.html'
		}).
        state('addUITask', {
            url: '/apps/:appId/ui/create',
            templateUrl: 'modules/apps/views/ui/add-task.client.view.html'
        }).
        state('viewUITask', {
            url: '/apps/:appId/ui/:taskId',
            templateUrl: 'modules/apps/views/ui/view-task.client.view.html'
        }).
        state('viewUIMon', {
            url: '/apps/:appId/ui/:taskId/mon/:monId',
            templateUrl: 'modules/apps/views/ui/view-mon.client.view.html'
        }).
		state('viewAppBehavior', {
			url: '/apps/behavior/:appId',
			templateUrl: 'modules/apps/views/behavior/view-behavior.client.view.html'
		});

	}
]);

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
      console.log($scope.searchStr);
    });

    /**
     * 当改变查询参数时，将值更新到parent scope中
     */
    $scope.changeArgs = function() {
      $scope.parentObj.selectInterval = $scope.selectInterval;
      $scope.parentObj.fromDate = $scope.fromDate;
      $scope.parentObj.untilDate = $scope.untilDate;
    };

    /**
     * 切换至异常监控页面
     */
    $scope.gotoException = function (){
      if($scope.selectPage.name === '全部'){
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
      if($scope.selectPage.name === '全部'){
        $location.path('apps/performance/' + $scope.app._id);
      } else {
        PageService.setCurrentPage({'_id': $scope.selectPage._id, 'pathname': $scope.selectPage.pathname});
        PageService.setIdentifier(2);
        $location.path('apps/performance/' + $scope.app._id);
      }
    };

  }]);

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
      console.log($scope.funnelData);
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

    $scope.nodesDetail = [];

    /**
     * 受访页面datatable配置
     * @type {any}
     */
    $scope.dtOptions_page = DTOptionsBuilder
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
        "value": 0
      },
      {
        "hc-key": "cn-zj",
        "value": 3
      },
      {
        "hc-key": "tw-lk",
        "value": 0
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
        "value": 0
      },
      {
        "hc-key": "tw-cs",
        "value": 0
      },
      {
        "hc-key": "cn-6657",
        "value": 1
      },
      {
        "hc-key": "cn-6663",
        "value": 2
      },
      {
        "hc-key": "cn-6665",
        "value": 1
      },
      {
        "hc-key": "cn-6666",
        "value": 1
      },
      {
        "hc-key": "cn-6667",
        "value": 1
      },
      {
        "hc-key": "cn-6669",
        "value": 1
      },
      {
        "hc-key": "cn-6670",
        "value": 1
      },
      {
        "hc-key": "cn-6671",
        "value": 0
      },
      {
        "hc-key": "tw-kh",
        "value": 0
      },
      {
        "hc-key": "tw-hs",
        "value": 0
      },
      {
        "hc-key": "cn-yn",
        "value": 0
      },
      {
        "hc-key": "cn-xz",
        "value": 0
      },
      {
        "hc-key": "tw-hh",
        "value": 0
      },
      {
        "hc-key": "tw-cl",
        "value": 0
      },
      {
        "hc-key": "tw-ml",
        "value": 0
      },
      {
        "hc-key": "cn-nx",
        "value": 0
      },
      {
        "hc-key": "cn-sa",
        "value": 0
      },
      {
        "hc-key": "tw-ty",
        "value":0
      },
      {
        "hc-key": "cn-3682",
        "value": 0
      },
      {
        "hc-key": "tw-cg",
        "value": 0
      },
      {
        "hc-key": "cn-6655",
        "value": 3
      },
      {
        "hc-key": "cn-ah",
        "value": 0
      },
      {
        "hc-key": "cn-hu",
        "value": 0
      },
      {
        "hc-key": "tw-hl",
        "value": 0
      },
      {
        "hc-key": "tw-th",
        "value": 0
      },
      {
        "hc-key": "cn-6656",
        "value": 6
      },
      {
        "hc-key": "tw-nt",
        "value": 0
      },
      {
        "hc-key": "cn-6658",
        "value": 3
      },
      {
        "hc-key": "cn-6659",
        "value": 3
      },
      {
        "hc-key": "cn-cq",
        "value": 0
      },
      {
        "hc-key": "cn-hn",
        "value": 4
      },
      {
        "hc-key": "tw-yl",
        "value": 0
      },
      {
        "hc-key": "cn-6660",
        "value": 3
      },
      {
        "hc-key": "cn-6661",
        "value": 4
      },
      {
        "hc-key": "cn-6662",
        "value": 5
      },
      {
        "hc-key": "cn-6664",
        "value": 6
      },
      {
        "hc-key": "cn-6668",
        "value": 7
      },
      {
        "hc-key": "tw-pt",
        "value": 0
      },
      {
        "hc-key": "tw-tt",
        "value": 0
      },
      {
        "hc-key": "tw-tn",
        "value": 0
      },
      {
        "hc-key": "cn-bj",
        "value": 34
      },
      {
        "hc-key": "cn-hb",
        "value": 2
      },
      {
        "hc-key": "tw-il",
        "value": 0
      },
      {
        "hc-key": "tw-tp",
        "value": 0
      },
      {
        "hc-key": "cn-sd",
        "value": 5
      },
      {
        "hc-key": "tw-ch",
        "value": 0
      },
      {
        "hc-key": "cn-tj",
        "value": 7
      },
      {
        "hc-key": "cn-ha",
        "value": 8
      },
      {
        "hc-key": "cn-jl",
        "value": 5
      },
      {
        "hc-key": "cn-qh",
        "value": 0
      },
      {
        "hc-key": "cn-xj",
        "value": 1
      },
      {
        "hc-key": "cn-nm",
        "value": 2
      },
      {
        "hc-key": "cn-hl",
        "value": 3
      },
      {
        "hc-key": "cn-sc",
        "value": 4
      },
      {
        "hc-key": "cn-gz",
        "value": 6
      },
      {
        "hc-key": "cn-gx",
        "value": 6
      },
      {
        "hc-key": "cn-ln",
        "value": 7
      },
      {
        "hc-key": "cn-js",
        "value": 8
      },
      {
        "hc-key": "cn-gs",
        "value": 6
      },
      {
        "hc-key": "cn-sx",
        "value": 3
      },
      {
        "hc-key": "cn-he",
        "value": 3
      },
      {
        "hc-key": "cn-jx",
        "value": 4
      }
    ];

    /**
     * 获取路径关系数据
     */
    $scope.getPathData = function () {
      // $http.get('pathAnalysis?appId=' + '12')
      //   .success(function (result) {
      //     drawPathNet(result);
      //   })
      var result = {
        "data": [
          [
            0,
            "",
            [
              [
                0,
                2,
                507
              ],
              [
                0,
                3,
                10
              ],
              [
                0,
                4,
                172
              ],
              [
                0,
                5,
                19
              ]
            ]
          ],
          [
            1,
            "others",
            [
              [
                1,
                2,
                467
              ],
              [
                1,
                3,
                3
              ],
              [
                1,
                4,
                54
              ]
            ]
          ],
          [
            2,
            "http://wenkechu.hust.edu.cn/toIndex",
            [
              [
                2,
                2,
                24
              ],
              [
                2,
                3,
                70
              ],
              [
                2,
                4,
                434
              ],
              [
                2,
                5,
                135
              ],
              [
                2,
                6,
                3
              ],
              [
                2,
                12,
                5
              ]
            ]
          ],
          [
            3,
            "http://wenkechu.hust.edu.cn/navigation/viewPage",
            [
              [
                3,
                2,
                17
              ],
              [
                3,
                3,
                51
              ],
              [
                3,
                4,
                8
              ],
              [
                3,
                5,
                11
              ]
            ]
          ],
          [
            4,
            "http://wenkechu.hust.edu.cn/article/viewPage",
            [
              [
                4,
                2,
                49
              ],
              [
                4,
                3,
                13
              ],
              [
                4,
                4,
                39
              ],
              [
                4,
                5,
                55
              ],
              [
                4,
                6,
                3
              ],
              [
                4,
                7,
                1
              ],
              [
                4,
                10,
                7
              ],
              [
                4,
                11,
                1
              ]
            ]
          ],
          [
            5,
            "http://wenkechu.hust.edu.cn/article/listPage",
            [
              [
                5,
                2,
                10
              ],
              [
                5,
                3,
                5
              ],
              [
                5,
                4,
                198
              ],
              [
                5,
                5,
                10
              ],
              [
                5,
                6,
                1
              ],
              [
                5,
                12,
                1
              ]
            ]
          ],
          [
            6,
            "http://wenkechu.hust.edu.cn/doLogin",
            [
              [
                6,
                7,
                8
              ]
            ]
          ],
          [
            7,
            "http://wenkechu.hust.edu.cn/block/managePage",
            [
              [
                7,
                8,
                14
              ]
            ]
          ],
          [
            8,
            "http://wenkechu.hust.edu.cn/block/toBlock",
            [
              [
                8,
                9,
                7
              ],
              [
                8,
                10,
                1
              ],
              [
                8,
                4,
                5
              ]
            ]
          ],
          [
            9,
            "http://wenkechu.hust.edu.cn/article/addPage",
            [
              [
                9,
                4,
                7
              ]
            ]
          ],
          [
            10,
            "http://wenkechu.hust.edu.cn/article/modifyPage",
            [
              [
                10,
                4,
                9
              ]
            ]
          ],
          [
            11,
            "http://wenkechu.hust.edu.cn/toManage",
            [
              [
                11,
                7,
                1
              ]
            ]
          ],
          [
            12,
            "http://wenkechu.hust.edu.cn/toSearch",
            [
              [
                12,
                2,
                4
              ],
              [
                12,
                12,
                2
              ]
            ]
          ],
          [
            13,
            "http://wenkechu.hust.edu.cn/",
            [
              [
                13,
                2,
                1
              ]
            ]
          ]
        ]
      }
      drawPathNet(result);
    };

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

    /**
     * highcharts搜索引擎配置
     */
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

    /**
     * highmaps地理位置配置
     */
    $scope.mapsConfig = {
      options: {
        chart:{},
        legend: {
          layout: 'horizontal',
          borderWidth: 0,
          backgroundColor: 'rgba(255,255,255,0.85)',
          floating: true,
          verticalAlign: 'top',
          y: 20
        },
        plotOptions: {
          map: {
            mapData: Highcharts.maps['countries/cn/custom/cn-all-sar-taiwan'],
            joinBy: ['hc-key'],
            name:'访问量',
            dataLabels: {
              enabled: true,
              format: '{point.name}'
            }
          }
        },
        colorAxis: {},
      },
      chartType: 'map',
      title: {
        text: '访问分布情况'
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

    /**
     * highcharts浏览器终端配置
     */
    $scope.browserConfig = {
      options:{
        chart: {
          type: 'pie'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,

            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%']
          }
        }
      },
      title: {
        text: '浏览器分类'
      },
      series: [{
        name: '占比',
        colorByPoint: true,
        innerSize: '50%',
        data: []
      }]
    };

    $scope.$on('chartConfigEvent', function (e, args) {
      $scope.originConfig.series[0].data = args.origin;
      $scope.originConfig.options.chart.width = $('.panel-heading').width();
      $scope.searchEngineConfig.series[0].data = args.searchEngine;
      $scope.searchEngineConfig.options.chart.width = $('.panel-heading').width();
      $scope.browserConfig.series[0].data=args.browser;
      $scope.browserConfig.options.chart.width = $('.panel-heading').width();
      $scope.mapsConfig.options.chart.width = $('.panel-heading').width();
    });

    /**
     * 绘制路径的网状图
     * @param result 从rpc取得的数据
     */
    function drawPathNet(result){
      var elementsData = {};
      var nodesData = [];
      var edgesData =[];
      for (var i=0; i<result.data.length; i++) {
        nodesData.push({
          data: {id:result.data[i][0],name:result.data[i][0],path:result.data[i][1]}
        });
        for (var j =0; j<result.data[i][2].length;j++) {
          edgesData.push({
            data: {source:result.data[i][2][j][0], target:result.data[i][2][j][1], label:result.data[i][2][j][2]},classes: 'autorotate'
          });
        }
      }
      elementsData.nodes = nodesData;
      elementsData.edges = edgesData;


      var cy = cytoscape({
        container: document.querySelector('#pathFigure'),

        boxSelectionEnabled: false,
        autounselectify: true,

        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(name)',
              'text-valign': 'center',
              'color': 'white',
              'text-outline-width': 2,
              'background-color': '#999',
              'text-outline-color': '#999'
            }
          },
          {
            selector: 'edge',
            style: {
              'label': 'data(label)',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#ccc',
              'line-color': '#ccc',
              'width': 1
            }
          },
          {
            selector: ':selected',
            style:{
              'background-color': '#0f0',
              'line-color': 'black',
              'target-arrow-color': 'black',
              'source-arrow-color': 'black'
            }
          },
          {
            selector: '.faded',
            style:{
              'opacity': 0.15,
              'text-opacity': 0
            }
          },
          {
            selector: '.autorotate',
            style: {
              'edge-text-rotation': 'autorotate'
            }
          },
        ],

        elements: elementsData,
        layout: {
          name: 'grid',
          padding: 10
        }
      });

      cy.on('tap', 'node', function(e){
        $scope.nodesDetail = [];
        var node = e.cyTarget;
        var neighborhood = node.neighborhood().add(node);

        var data = node.data();
        $scope.nodesDetail.push(data);
        for(var i=0; i<node.neighborhood().length;i++) {
          if(node.neighborhood()[i].data().path){
            $scope.nodesDetail.push(node.neighborhood()[i].data());
          }
        }
        $scope.$apply();

        cy.elements().addClass('faded');
        neighborhood.removeClass('faded');
      });

      cy.on('tap', function(e){
        if( e.cyTarget === cy ){
          cy.elements().removeClass('faded');
        }
      });
    }
  }]);

/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorController', ['$scope', '$stateParams', '$location',
  'Authentication', 'Apps', 'DTOptionsBuilder', '$http', '$timeout', 'PageService','SweetAlert',
  function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService,SweetAlert) {
    $scope.authentication = Authentication;

    $scope.initBehavior = function () {
      document.cookie = 'customEvent=false'; //置换customEvent，使得用户正常访问被监控网站时不会出现绑定组件
      $scope.showData = true;
      $scope.customEvents = [{'_id':1,'name':'请选择指定事件'}];
      $scope.customEventsListData = [];
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
                  searchEngine: result.searchEngine,
                  browser: result.browser
                });
                $scope.listData = result.listData;
                $scope.statisticData = result.statisticData;
                $scope.showData = true;
              } else {
                $scope.showData = false;
              }
            });

            $http.get('custom/' + $stateParams.appId)
              .success(function (data) {
                $scope.customEvents=[];
                $scope.customEventsListData=[];
                for (var i=0;i<data.length;i++) {
                  $scope.customEvents.push({'_id':data[i]._id,'name':data[i].name});
                  $scope.customEventsListData.push({
                    'id':data[i]._id,
                    'name': data[i].name,
                    'url':data[i].url,
                    'cssPath':data[i].cssPath,
                    'text':data[i].text,
                  });
                }
              })
          };

          $scope.refrashChart = getBehaviors;
          getBehaviors();

          /**
           * 删除用户自定义事件
           */
          $scope.deleteCustomEvent = function (e) {
            SweetAlert.swal({
                title: '确定删除该事件?',
                text: '删除后将丢失该事件监控数据!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定，删掉它!',
                cancelButtonText: '不删，考虑一下!',
                closeOnConfirm: false,
                closeOnCancel: false
              },
              function (isConfirm) {
                if (isConfirm) {
                  //删除应用代码
                  $http.delete('/customEvent?id='+e.target.id)
                    .success(function (result) {
                      if(result._id) {
                        SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                        getBehaviors();
                      }
                    })
                } else {
                  SweetAlert.swal('删除取消!', '该应用仍然存在 :)', 'error');
                }
              });

          }
        }
      });
    };

    $scope.back = function () {
      window.history.back();
    };
  }]);

'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps', 'Tasks',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService', 'SweetAlert',
    function ($scope, $stateParams, $location, Authentication, Apps, Tasks, DTOptionsBuilder, $http, $timeout, PageService, SweetAlert) {
        $scope.authentication = Authentication;

        //可从后台动态获取数据，以后有时间完成
        $scope.type = 'java';
        $scope.types = ['java', 'node.js', 'android', 'ios'];

        // 配置panel是否首期
        $scope.isPanelOpen ={
            performance: true,
            exception: true,
            ui: true,
            behavior: true
        };
        $scope.togglePanelOpen = function (type) {
            $scope.isPanelOpen[type] = !$scope.isPanelOpen[type];
        };

        // 配置功能绑定
        $scope.config = {
            performance: false,
            exception: false,
            ui: false,
            behavior: false
        };

        $scope.selectItems = [{
            label: '关闭',
            value: false
        },{
            label: '开启',
            value: true
        }];

        $scope.deadLinkInterval = 3600000;
        $scope.deadLinkIntervals = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
        $scope.alarmInterval = 900000;
        $scope.alarmIntervals = [
            {label: '5分钟',value: 300000},
            {label: '10分钟',value: 600000},
            {label: '15分钟',value: 900000},
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];

        $scope.alarmtype = [1, 2, 3, 4];
        $scope.alarmtypes = [
            {label: 'JavaScript异常', value: 1, checked: true},
            {label: 'Ajax请求异常', value: 2, checked: true},
            {label: '静态资源请求异常', value: 3, checked: true},
            {label: '死链接异常', value: 4, checked: true},
            {label: '页面加载异常', value: 5, checked: false},
            {label: 'DOM结构异常', value: 6, checked: false},
            {label: '内存异常', value: 7, checked: false}
        ];
        $scope.uiInterval = 3600000;
        $scope.uiIntervals = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
        $scope.toggleSelection = function (obj, i) {
            var objValue = parseInt(obj.target.value);
            if(obj.target.checked){
                if(i === 1){
                    $scope.typekind.push(objValue);
                }else {
                    $scope.app.alarmtype.push(objValue);
                }
            }else{
                if(i === 1){
                    $scope.alarmtype.splice($scope.alarmtype.indexOf(objValue), 1);
                }else {
                    $scope.app.alarmtype.splice($scope.app.alarmtype.indexOf(objValue), 1);
                }
            }
        };

        if (Authentication.user) {
            $scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;
        }

        /*
        $scope.script = '<script type="text/javascript">var fp = document.createElement("script");' +
                        'fp.type = "text/javascript";' +
                        'fp.async = true;' +
                        'fp.src = "http://' + $location.host() + ':' + $location.port() + '/rookie.js/' +
                            $stateParams.appId + '";' +
                        'var s = document.getElementsByTagName("script")[0];' +
                        's.parentNode.insertBefore(fp, s);</script>';
        */

        // 性能&异常监测脚本
        $scope.script = '<script type="text/javascript" ' + 'id="feException" ' + 'src="http://' + $location.host() + ':' +
                        $location.port() + '/bookie.js/' + $stateParams.appId + '"' + '></script>';

        // 用户行为监测脚本
        $scope.UBscript = '<script type="text/javascript" ' + 'id="feException" ' + 'src="http://' + $location.host() + ':' +
                        $location.port() + '/behavior.js/' + $stateParams.appId + '"' + '></script>';

        // Create new App
        $scope.create = function () {
            // Create new App object
            var app = new Apps({
                name: this.name,
                type: this.type,
                host: this.host,
                deadLinkInterval: this.deadLinkInterval,
                uiInterval: this.uiInterval,
                alarmtype: this.alarmtype,
                alarmInterval: this.alarmInterval,
                alarmEmail: this.alarmEmail,
                config: this.config
            });

            // Redirect after save
            app.$save(function (response) {
                $location.path('apps/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.type = 'java';
                $scope.host = '';
                $scope.alarmtype = [1, 2, 3, 4];
                $scope.deadLinkInterval = 3600000;
                $scope.deadLinkInterval = 3600000;
                $scope.alarmInterval = 900000;
                $scope.alarmEmail = '';
                $scope.toggleOpenUB = 0;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing App
        $scope.remove = function (app) {
            SweetAlert.swal({
                    title: '确定删除该应用?',
                    text: '应用删除后不可恢复哟!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定，删掉它!',
                    cancelButtonText: '不删，考虑一下!',
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        //删除应用代码
                        if (app) {
                            app.$remove();
                            for (var i in $scope.apps) {
                                if ($scope.apps [i] === app) {
                                    $scope.apps.splice(i, 1);
                                }
                            }
                            SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                        } else {
                            SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                            $scope.app.$remove(function () {
                                $location.path('apps');
                            });
                        }
                    } else {
                        SweetAlert.swal('删除取消!', '该应用仍然存在 :)', 'error');
                    }
                });
        };

        // Update existing App
        $scope.update = function () {
            var app = $scope.app;

            app.$update(function () {
                $location.path('apps/' + app._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Apps
        $scope.find = function () {
            $scope.apps = Apps.query();
        };

        // Find existing App
        $scope.intApp = function () {
            $scope.app = Apps.get({
                appId: $stateParams.appId
            });


            $http.get('pages/' + $stateParams.appId).
                success(function (data) {
                    $scope.pages = data;
                });

            $scope.tasks = Tasks.query({
                appId: $stateParams.appId
            });

            //修改APP配置初始化报警类型
            $scope.alarmtypes = [
                {label: 'JavaScript异常', value: 1, checked: false},
                {label: 'Ajax请求异常', value: 2, checked: false},
                {label: '静态资源请求异常', value: 3, checked: false},
                {label: '死链接异常', value: 4, checked: false},
                {label: '页面加载异常', value: 5, checked: false},
                {label: 'DOM结构异常', value: 6, checked: false},
                {label: '内存异常', value: 7, checked: false}
            ];

            //angularjs默认按需加载，因此将代码放入then中
            $scope.app.$promise.then(function(data){
                for(var i=0; i < $scope.app.alarmtype.length; i++){
                    var j = $scope.app.alarmtype[i];
                    if(j){
                        $scope.alarmtypes[j-1].checked = true;
                    }
                }
            });

        };

        //跳转至性能详情
        $scope.gotoPerformance = function(page){
            PageService.setCurrentPage({'_id': page._id, 'pathname': page.pathname});
            PageService.setIdentifier(2);
            $location.path('apps/performance/' + $scope.app._id);
        };

        //跳转至异常详情
        $scope.gotoException = function(page){
            PageService.setCurrentPage({'_id': page._id, 'pathname': page.pathname});
            PageService.setIdentifier(2);
            $location.path('apps/exception/' + $scope.app._id);
        };

        // 跳转至UI任务添加页面
        $scope.gotoAddTask= function(){
            $location.path('apps/' + $stateParams.appId + "/ui/create");
        };
        // 跳转至UI任务添加页面
        $scope.gotoTaskDetail= function(task){
            $location.path('apps/' + $stateParams.appId + "/ui/" + task._id);
        };

        //删除页面
        $scope.deletePage = function(page){
            SweetAlert.swal({
                    title: '确定删除该页面?',
                    text: '页面删除后不可恢复哟!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',confirmButtonText: '确定，删掉它!',
                    cancelButtonText: '不删，考虑一下!',
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                        $scope.pages = $scope.pages.filter(function(elem){
                            return elem._id !== page._id;
                        });
                        $http.delete('pages/' + $scope.app._id, {
                            params: {pageId: page._id}
                        });
                    } else {
                        SweetAlert.swal('删除取消!', '该页面仍然存在 :)', 'error');
                    }
                });
        };

        $scope.canUpdate = function () {
            return $scope.appForm.$valid;
        };

        $scope.removeErr = function () {
            $scope.error = false;
        };

        $scope.back = function () {
            window.history.back();
        };


        $scope.clip = function () {
            $scope.isClip = true;
            $timeout(function () {
                $scope.isClip = false;
            }, 3000);
        };

        //datatble配置
        $scope.dtPageOptions = DTOptionsBuilder
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
            // .withOption('responsive', true);

        //
        //$scope.pt = function () {
        //    $scope.showProgress = true;
        //    $http.get('/phantomjs/test').success(function (result) {
        //        $scope.ptResult = result;
        //        $scope.showProgress = false;
        //    });
        //};

    }
]);

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
                                categories: ['Chrome', 'FireFox', 'Internet Explorer', 'Safari', 'Opera', '其它'],
                                title: {
                                    text: '浏览器厂商',
                                    align: 'high'
                                }
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
         * TODO：弹出层手动报警
         */
        $scope.viewExceptionKindDetail = function (exceptionKind) {
            //异常种类详情查看
            console.log(exceptionKind);
            var exceptions = $scope.exceptionsAll.filter(function (elem){
                return elem._id === exceptionKind._id;
            });

            var app = $scope.app;//用以权限控制手动报警
            var authentication = $scope.authentication;
            var manualAlarm = $scope.manualAlarm;

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
                    dtOptions: dtOptions,
                    app: app,
                    authentication: authentication,
                    manualAlarm: manualAlarm
                },
                controller: function($scope, close, title, exceptions, dtOptions, app, authentication, manualAlarm){
                    $scope.title = title;
                    $scope.exceptions = exceptions;
                    $scope.dtOptions = dtOptions;
                    $scope.app = app;
                    $scope.authentication = authentication;
                    $scope.manualAlarm = manualAlarm;
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

        /**
         * 切换至用户行为监控页面
         */
        $scope.gotoBehavior = function (){
            if($scope.selectPage.pathname === '全部'){
                $location.path('apps/behavior/' + $scope.app._id);
            } else {
                PageService.setCurrentPage({'_id': $scope.selectPage._id, 'pathname': $scope.selectPage.pathname});
                PageService.setIdentifier(2);
                $location.path('apps/behavior/' + $scope.app._id);
            }
        };



        /**
         * 手动报警
         */
        $scope.manualAlarm = function (exception){
            //TODO 手动设置报警
            $http.put('mails/alarm/' + exception._id, {exception: exception, appObj: $scope.app}).then(function(result){
                SweetAlert.swal('报警成功！');
            }, function(err){
                SweetAlert.swal('报警失败!');
            });
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

'use strict';

// Apps controller
angular.module('apps').controller('AppsPerformanceController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout, PageService) {
        $scope.authentication = Authentication;

        //可从后台动态获取数据，以后有时间完成
        $scope.type = 'java';
        $scope.types = ['java', 'node.js', 'android', 'ios'];

        if (Authentication.user) {
            $scope.showName = Authentication.user.roles[0] === 'admin' ? true : false;
        }

        // Find existing App
        $scope.viewPerformance = function () {
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
                        $scope.pages = [{'_id':ids, 'pathname':'全部'}].concat(data);
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
                            {'name': 'Internet Explorer', 'id': 'Internet Explorer'}, {'name': 'Chrome', 'id': 'Chrome'},
                            {'name': 'Android Webkit Browser', 'id': 'Android Webkit Browser'},
                            {'name': 'Firefox', 'id': 'Firefox'}, {'name': 'Safari', 'id': 'Safari'}
                        ];
                        $scope.selectBrowser = $scope.browsers[0];
                        //统计量
                        $scope.statistics = [
                            {'name': '平均值', 'id': 'mean'}, {'name': '中位数', 'id': 'median'},
                            {'name': 'p90', 'id': 'quantile_90'}
                        ];
                        $scope.selectStatistic = $scope.statistics[0];
                        //日期范围初始化
                        var now = new Date();
                        $scope.nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
                        $scope.fromDate = $scope.nowDate - 1296000000; //往前15天
                        $scope.untilDate = $scope.nowDate;

                        var getTimings = function () {
                            $scope.details = [];
                            var trueFromDate, trueUntilDate;
                            switch ($scope.selectInterval.id) {
                                case 'day':
                                    trueFromDate = $scope.fromDate;
                                    trueUntilDate = $scope.untilDate + 86400000;
                                    $scope.chartConfig.xAxis.tickInterval = 86400000; //1天
                                    $scope.chartConfig.xAxis.dateTimeLabelFormats = {day: '%m.%d'};
                                    $scope.chartConfig.options.tooltip.xDateFormat = '%Y-%m-%d';
                                    break;
                                case 'month':
                                    trueFromDate = Date.UTC((new Date($scope.fromDate)).getFullYear(), (new Date($scope.fromDate)).getMonth());
                                    trueUntilDate = Date.UTC((new Date($scope.untilDate)).getFullYear(), (new Date($scope.untilDate)).getMonth() + 1);
                                    $scope.chartConfig.xAxis.tickInterval = 2419200000; //28天
                                    $scope.chartConfig.xAxis.dateTimeLabelFormats = {month: '%Y.%m'};
                                    $scope.chartConfig.options.tooltip.xDateFormat = '%Y.%m';
                                    break;
                                case 'year':
                                    trueFromDate = Date.UTC((new Date($scope.fromDate)).getFullYear(), 0);
                                    trueUntilDate = Date.UTC((new Date($scope.untilDate)).getFullYear() + 1, 0);
                                    $scope.chartConfig.xAxis.tickInterval = 31104000000; //360天
                                    $scope.chartConfig.xAxis.dateTimeLabelFormats = {day: '%Y'};
                                    $scope.chartConfig.options.tooltip.xDateFormat = '%Y';
                                    break;
                            }
                            switch ($scope.selectStatistic.id) {
                                case 'mean':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（平均值）';
                                    break;
                                case 'median':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（中位数）';
                                    break;
                                case 'quantile_90':
                                    $scope.chartConfig.title.text = '页面性能总体趋势图（p90）';
                                    break;
                            }
                            $http.get('timings', {
                                params: {
                                    pageId: $scope.selectPage._id,
                                    fromDate: new Date(trueFromDate),
                                    untilDate: new Date(trueUntilDate),
                                    interval: $scope.selectInterval.id,
                                    browser: $scope.selectBrowser.id,
                                    statistic: $scope.selectStatistic.id
                                }
                            }).success(function (result) {
                                PageService.setIdentifier(1);
                                if (result.statisticData.sum > 0) {
                                    $scope.chartConfig.series[0].data = result.numData;
                                    $scope.chartConfig.series[1].data = result.pageLoadData;
                                    $scope.chartConfig.series[2].data = result.networkData;
                                    $scope.chartConfig.series[3].data = result.backendData;
                                    $scope.chartConfig.series[4].data = result.frontendData;
                                    $scope.chartConfig.series[5].data = result.redirectData;
                                    $scope.chartConfig.series[6].data = result.dnsData;
                                    $scope.chartConfig.series[7].data = result.connectData;
                                    $scope.chartConfig.series[8].data = result.waitingData;
                                    $scope.chartConfig.series[9].data = result.receivingData;
                                    $scope.chartConfig.series[10].data = result.processingData;
                                    $scope.chartConfig.series[11].data = result.contentLoadedData;
                                    $scope.chartConfig.series[12].data = result.onLoadData;
                                    $scope.timingPie.series[0].data = [
                                        ['网络', (result.statisticData.network / result.statisticData.pageLoad) * 100],
                                        ['后端', (result.statisticData.backend / result.statisticData.pageLoad) * 100],
                                        {
                                            name: '前端',
                                            y: (result.statisticData.frontend / result.statisticData.pageLoad) *100,
                                            sliced: true,
                                            selected: true
                                        },
                                        ['其它', ((result.statisticData.pageLoad - result.statisticData.network -
                                        result.statisticData.backend - result.statisticData.frontend) /
                                        result.statisticData.pageLoad) * 100]];
                                    $scope.timingline.series[0].data = [
                                        [result.statisticData.dnsTime * 1, (result.statisticData.dnsTime * 1) + (result.statisticData.dns * 1)],
                                        [result.statisticData.connectTime * 1, (result.statisticData.connectTime * 1) + (result.statisticData.connect * 1)],
                                        [result.statisticData.requestTime * 1, (result.statisticData.requestTime * 1) + (result.statisticData.waiting * 1)],
                                        [result.statisticData.receiveTime * 1, (result.statisticData.receiveTime * 1) + (result.statisticData.receiving * 1)],
                                        [result.statisticData.processTime * 1, (result.statisticData.processTime * 1) + (result.statisticData.processing * 1)],
                                        [result.statisticData.contentLoadedTime * 1, (result.statisticData.contentLoadedTime * 1) + (result.statisticData.contentLoaded * 1)],
                                        [result.statisticData.onLoadTime * 1, (result.statisticData.onLoadTime * 1) + (result.statisticData.onLoad * 1)],
                                        [0, result.statisticData.pageLoadTime * 1]
                                    ];
                                    $scope.statisticData = result.statisticData;
                                    $scope.showData = true;
                                } else {
                                    $scope.showData = false;
                                }
                            });
                        };

                        $scope.chartConfig = {
                            options: {
                                chart: {
                                    width: $('.tabWidth').width()
                                },
                                tooltip: {
                                    xDateFormat: '%Y-%m-%d',
                                    shared: true,
                                    style: {
                                        fontSize: '14px'
                                    }
                                },
                                plotOptions: {
                                    series: {
                                        cursor: 'pointer',
                                        point: {
                                            events: {
                                                click: function () {
                                                    $http.get('timings', {
                                                        params: {
                                                            pageId: $scope.selectPage._id,
                                                            dateNumber: this.category,
                                                            interval: $scope.selectInterval.id,
                                                            browser: $scope.selectBrowser.id
                                                        }
                                                    }).success(function (result) {
                                                        $scope.details = result.data;
                                                        var pageLoad = [], redirect = [], dns = [], connect = [],
                                                            waiting = [], receiving = [], processing = [], contentLoaded = [],
                                                            onLoad = [];
                                                        for (var i = 0; i < result.data.length; i++) {
                                                            var dateNum = Date.parse(result.data[i].created);
                                                            pageLoad.push([dateNum, result.data[i].pageLoad]);
                                                            waiting.push([dateNum, result.data[i].waiting]);
                                                            receiving.push([dateNum, result.data[i].receiving]);
                                                            contentLoaded.push([dateNum, result.data[i].contentLoaded]);
                                                            redirect.push([dateNum, result.data[i].redirect]);
                                                            dns.push([dateNum, result.data[i].dns]);
                                                            connect.push([dateNum, result.data[i].connect]);
                                                            processing.push([dateNum, result.data[i].processing]);
                                                            onLoad.push([dateNum, result.data[i].onLoad]);
                                                        }
                                                        $scope.timingArea.series[0].data = pageLoad;
                                                        $scope.timingArea.series[1].data = redirect;
                                                        $scope.timingArea.series[2].data = dns;
                                                        $scope.timingArea.series[3].data = connect;
                                                        $scope.timingArea.series[4].data = waiting;
                                                        $scope.timingArea.series[5].data = receiving;
                                                        $scope.timingArea.series[6].data = processing;
                                                        $scope.timingArea.series[7].data = contentLoaded;
                                                        $scope.timingArea.series[8].data = onLoad;
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                title: {
                                    text: '日期',
                                    align: 'high'
                                },
                                type: 'datetime',
                                tickInterval: 86400000,
                                dateTimeLabelFormats: {
                                    day: '%m.%d',
                                    month: '%Y.%m',
                                    year: '%Y'
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: '耗时（ms）'
                                }
                            }, {
                                title: {
                                    text: '请求总数',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                labels: {
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                allowDecimals: false,
                                opposite: true
                            }],
                            series: [{
                                name: '请求总数',
                                type: 'column',
                                yAxis: 1,
                                data: []
                            }, {
                                name: '总耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '网络耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '后端耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '前端耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面跳转耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DNS查询耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '连接耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '等待响应耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '接收文档耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM处理耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM内容加载耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'load事件耗时',
                                type: 'spline',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: ''
                            }
                        };
                        $scope.timingPie = {
                            options: {
                                chart: {
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
                                text: '页面加载耗时分布图(平均值)'
                            },
                            series: [{
                                type: 'pie',
                                name: '占总耗时比率',
                                data: []
                            }]
                        };
                        $scope.timingArea = {
                            options: {
                                chart: {
                                    type: 'areaspline',
                                    zoomType: 'x',
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                plotOptions: {
                                    areaspline: {
                                        fillOpacity: 0.5,
                                        marker: {
                                            enabled: false
                                        }
                                    }
                                },
                                tooltip: {
                                    xDateFormat: '%Y-%m-%d %H:%M:%S',
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
                                title: {
                                    text: '日期',
                                    align: 'high'
                                },
                                type: 'datetime'
                            },
                            yAxis: {
                                title: {
                                    text: '耗时（ms）'
                                }
                            },
                            series: [{
                                name: '总耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '页面跳转耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DNS查询耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '连接耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '等待响应耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: '接收文档耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM处理耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'DOM内容加载耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }, {
                                name: 'load事件耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: '真实请求趋势图'
                            }
                        };
                        $scope.timingline = {
                            options: {
                                chart: {
                                    type: 'columnrange',
                                    inverted: true,
                                    marginTop: 50,
                                    width: $('.tabWidth').width()
                                },
                                legend: {
                                    enabled: false
                                },
                                tooltip: {
                                    formatter: function () {
                                        return '<h6>' + this.key + '</h6><br/><table><tr><td>耗时: </td><td><b>' +
                                            (this.point.high - this.point.low).toFixed(2) + ' ms' + '</b></td></tr></table>';
                                    },
                                    style: {
                                        fontSize: '14px'
                                    }
                                },
                                plotOptions: {
                                    columnrange: {
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function () {
                                                return this.y.toFixed(2) + 'ms';
                                            }
                                        }
                                    }
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                categories: ['DNS查询', '连接', '等待响应', '接收文档', 'DOM处理', 'DOM内容加载', 'load事件', '总耗时']
                            },
                            yAxis: {
                                title: {
                                    text: '时间线（ms）'
                                }
                            },
                            series: [{
                                name: '耗时',
                                tooltip: {
                                    valueSuffix: ' ms'
                                },
                                data: []
                            }],
                            title: {
                                text: '加载时间线'
                            }
                        };
                        $scope.refrashChart = getTimings;
                        getTimings();
                        //$scope.reflow = function () {
                        //    for (var i = 0; i < Highcharts.charts.length; i++) {
                        //        if (Highcharts.charts[i]) {
                        //            Highcharts.charts[i].reflow();
                        //        }
                        //    }
                        //};
                    } else {
                        $scope.showChart = false;
                    }
                });
        };

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


        $scope.removeErr = function () {
            $scope.error = false;
        };

        $scope.back = function () {
            window.history.back();
        };

        $scope.findTiming = function (timingId) {
            $http.get('timings/' + timingId).success(function (result) {
                $scope.timingData = result;
                $scope.resources = result.allResourcesCalc;
                $scope.timingErrs = result.errs;
            });
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
         * 切换至用户行为监控页面
         */
        $scope.gotoBehavior = function (){
            if($scope.selectPage.pathname === '全部'){
                $location.path('apps/behavior/' + $scope.app._id);
            } else {
                PageService.setCurrentPage({'_id': $scope.selectPage._id, 'pathname': $scope.selectPage.pathname});
                PageService.setIdentifier(2);
                $location.path('apps/behavior/' + $scope.app._id);
            }
        };

        $scope.httpNumTooltip = {
            'title': '包括HTML页面请求，CSS文件、JavaScript文件、图片等资源下载及其它网络请求。'
        };
        $scope.dnsTimeTooltip = {
            'title': '开始进行DNS查询的时间。'
        };
        $scope.connectTimeTooltip = {
            'title': '开始请求连接的时间。'
        };
        $scope.reqTimeTooltip = {
            'title': '浏览器开始请求文档时间。'
        };
        $scope.resTimeTooltip = {
            'title': '浏览器开始接收文档时间。'
        };
        $scope.parseTimeTooltip = {
            'title': '浏览器开始解析HTML文档第一批收到的字节。'
        };
        $scope.reactiveTimeTooltip = {
            'title': '浏览器完成解析并且所有HTML和DOM构建完毕的时间点。'
        };
        $scope.DOMReadyTimeTooltip = {
            'title': '浏览器触发DOMContentLoaded事件的时间。'
        };
        $scope.ResourcesLoadedTimeTooltip = {
            'title': '浏览器完成网页及其所有附属资源下载的时间。'
        };
        $scope.onLoadTimeTooltip = {
            'title': '浏览器开始触发load事件的时间。'
        };
        $scope.pageLoadTimeTooltip = {
            'title': '浏览器完成页面完全加载时间，包括所有onLoad事件以及相关的动态资源加载完成。'
        };
        $scope.pageLoadTooltip = {
            'title': '从页面请求到页面完全加载的时间。'
        };
        $scope.networkTooltip = {
            'title': '从发出请求到完成连接建立的时间。'
        };
        $scope.backendTooltip = {
            'title': '指收到请求后服务器逻辑处理的时间。'
        };
        $scope.frontendTooltip = {
            'title': '从开始解析文档到页面完全加载的时间。'
        };
        $scope.redirectTooltip = {
            'title': '页面请求后进行页面跳转所消耗的时间。'
        };
        $scope.dnsTooltip = {
            'title': 'DNS查询的时间。页面请求会产生一次寻找该页面资源所在主机的DNS查询。在同个域名进行页面切换不会造成新的DNS查询。'
        };
        $scope.connectTooltip = {
            'title': '指浏览器和服务器之间建立TCP/IP连接的时间，对于SSL连接包括握手的时间。'
        };
        $scope.waitingTooltip = {
            'title': '指从开始请求当前文档到开始接收响应的时间。'
        };
        $scope.receivingTooltip = {
            'title': '指开始接收响应到完成收到响应的时间。'
        };
        $scope.DOMProcessingTooltip = {
            'title': '指从完成收到响应到文档的readyState变为complete的时间。'
        };
        $scope.DOMContentLoadedTooltip = {
            'title': '指从文档的DOMContentLoaded事件被触发到文档的DOMContentLoaded事件完成的时间。'
        };
        $scope.onLoadTooltip = {
            'title': '指从文档的load事件被触发到文档的load事件完成的时间。'
        };
    }
]);

'use strict';

// Apps controller
angular.module('apps').filter("formatTime", function(){
    return function(inputData) {
        var standard = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
        for(var i = 0; i < standard.length; i++) {
            if(standard[i].value == inputData){
                return standard[i].label;
            }
        }
        return inputData + "毫秒";
    }
})
angular.module('apps').controller('UIController', ['$scope', '$stateParams', '$window', '$location', 'Authentication', 'Tasks', 'Mons',
    'DTOptionsBuilder', '$http', '$timeout', 'PageService', 'SweetAlert', 'ModalService',
    function ($scope, $stateParams, $window, $location, Authentication, Tasks, Mons, DTOptionsBuilder, $http, $timeout, PageService, SweetAlert, ModalService) {
        $scope.authentication = Authentication;
        $scope.uiType = {
            'add': '添加DOM节点',
            'remove': '删除DOM节点',
            'style': '样式变化',
            'text': '文本变化'
        };
        $scope.fileName = {
            'diffPic': '页面对比图片.jpeg',
            'screenShot': '页面截图.jpeg',
            'info': '页面信息.json',
            'tree': 'DOM树信息.json'
        };
        $scope.monitoringIntervals = [
            {label: '30分钟',value: 1800000},
            {label: '1个小时', value: 3600000},
            {label: '半天', value: 43200000},
            {label: '1天', value: 86400000},
            {label: '1周', value: 604800000},
            {label: '1个月', value: 2592000000}
        ];
        $scope.create = function () {
            // 创建新的任务
            var task = new Tasks({
                url: this.url,
                app: $stateParams.appId
            });
            task.$save(function (response) {
                $location.path('apps/' + $stateParams.appId + '/ui/' + response._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
        $scope.remove = function () {
            SweetAlert.swal({
                title: '确定删除该应用?',
                text: '应用删除后不可恢复哟!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定，删掉它!',
                cancelButtonText: '不删，考虑一下!',
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        //删除应用代码
                        SweetAlert.swal('删除成功!', '该页面已被成功删除.', 'success');
                        $scope.task.$remove(function () {
                            $location.path('apps/' + $stateParams.appId);
                        });
                    } else {
                        SweetAlert.swal('删除取消!', '该应用仍然存在 :)', 'error');
                    }
                });
        }
        $scope.removeErr = function () {
            $scope.error = false;
        };

        $scope.initTask = function () {
            $scope.task = Tasks.get({
                taskId: $stateParams.taskId
            })
            $scope.mons = Mons.query({
                taskId: $stateParams.taskId
            });
        };

        $scope.initMon = function () {
            $scope.mon = Mons.get({
                monId: $stateParams.monId
            })
        };

        $scope.back = function () {
            window.history.back();
        };

        $scope.addRule = function () {
            //通过Image对象请求发送数据
            var img = new Image(1, 1);
            img.src = '/_ui.gif/send?' + JSON.stringify({isOpenUI: true});
            img.onload = function(){
                $window.open($scope.task.url, '_blank');
            }
            img.onerror = function(err){
                SweetAlert.swal('跳转失败!', '服务器开了小差 :)', 'error');
            }
        };

        $scope.removeRule = function ($event, index, type) {
            if (type == 'dom') {
                $scope.task.domRules.splice(index, 1);
            } else if (type == 'diff') {
                $scope.task.diffRules.splice(index, 1);
            }

            $scope.task.$update(function () {
                SweetAlert.swal('删除成功!', '该规则已被成功删除.', 'success');
            }, function (errorResponse) {
                SweetAlert.swal('删除失败!', '服务器开了小差 :)', 'error');
            });

        };

        $scope.switchTaskStatus = function (status) {
            switch (status) {
                case 'off':
                    $scope.task.isRunning = false;
                    break;
                case 'on':
                    $scope.task.isRunning = true;
                    break;
            }
            $scope.task.$update(function () {
            }, function (errorResponse) {
                SweetAlert.swal('更新!', '服务器开了小差 :)', 'error');
            });
        };


        $scope.gotoMonDetail = function (mon) {
            $location.path('apps/' + $stateParams.appId + "/ui/" + $stateParams.taskId + "/mon/" + mon._id);
        };

        $scope.downloadFile = function (id) {
            $window.open("/mon/getFile?fileId=" + id, '_blank');
        }

        $scope.modifyInterval = function(monitoringIntervals, task){
            ModalService.showModal({
                templateUrl: 'modules/apps/views/ui/modify-interval.client.view.html',
                inputs: {
                    title: '修改监控时间间隔'
                },
                controller: function($scope, close){
                    var _monitoringInterval = task.monitoringInterval;
                    $scope.monitoringIntervals = monitoringIntervals;
                    $scope.task = task;
                    $scope.ok = function (result){
                        $scope.task.$update();
                        close(100);
                    };
                    $scope.cancel = function(){
                        task.monitoringInterval = _monitoringInterval;
                        close(100);
                    }
                }
            }).then(function (modal) {
                modal.element.show();
            });
        }
        //datatble配置
        $scope.dtPageOptions = DTOptionsBuilder
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
        // .withOption('responsive', true);
    }]);

'use strict';

// My Apps directive
angular.module('apps').directive('myConfirmClick', [
    function () {
        return {
            priority: -1,
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function (e) {
                    var message = attrs.myConfirmClick;
                    if (message && !confirm(message)) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        };
    }
]);

'use strict';

//Apps service used to communicate Apps REST endpoints
angular.module('apps').factory('Apps', ['$resource',
	function($resource) {
		return $resource('apps/:appId', { appId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Apps service used to communicate task REST endpoints
angular.module('apps').factory('Tasks', ['$resource',
    function($resource) {
        return $resource('ui/:taskId/', {
        	taskId: '@_id',
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

//Apps service used to communicate task REST endpoints
angular.module('apps').factory('Mons', ['$resource',
    function($resource) {
        return $resource('mon/:monId/', {
            monId: '@_id',
        });
    }
]);
//用于APP页面往具体页面跳转用
angular.module('apps').factory('PageService', [function() {

	var currentPage = null;
	var identifier = 1;//2表示从应用详情跳到页面异常（或性能）详情，1表示从应用列表跳转过去


	var setCurrentPage = function(page){
		currentPage = page;
	};
	var getCurrentPage = function(){
		return currentPage;
	};


	var setIdentifier = function(i){
		identifier = i;
	};
	var getIdentifier = function(){
		return identifier;
	};


	return {
		setCurrentPage: setCurrentPage,
		getCurrentPage: getCurrentPage,
		setIdentifier: setIdentifier,
		getIdentifier: getIdentifier
	};

}]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('mails').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '我的邮件', 'mails', 'dropdown', '/mails(/create)?');
		Menus.addSubMenuItem('topbar', 'mails', '邮件列表', 'mails');
	}
]);

'use strict';

//Setting up route
angular.module('mails').config(['$stateProvider',
	function($stateProvider) {
		// Mails state routing
		$stateProvider.
		state('listMails', {
			url: '/mails',
			templateUrl: 'modules/mails/views/list-mails.client.view.html'
		}).
		state('viewMail', {
			url: '/mails/:mailId',
			templateUrl: 'modules/mails/views/view-mail.client.view.html'
		});
	}
]);

'use strict';

// Mails controller
angular.module('mails').controller('MailsController', ['$scope', '$sce', '$stateParams', '$location', 'Authentication', 'Mails', 'DTOptionsBuilder', 'ModalService',
	function($scope, $sce,  $stateParams, $location, Authentication, Mails, DTOptionsBuilder, ModalService) {
		$scope.authentication = Authentication;



		// Remove existing Mail
		$scope.remove = function(mail) {
			if ( mail ) { 
				mail.$remove();

				for (var i in $scope.mails) {
					if ($scope.mails [i] === mail) {
						$scope.mails.splice(i, 1);
					}
				}
			} else {
				$scope.mail.$remove(function() {
					$location.path('mails');
				});
			}
		};

		// Update existing Mail
		$scope.update = function() {
			var mail = $scope.mail;

			mail.$update(function() {
				$location.path('mails/' + mail._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mails
		$scope.find = function() {
			$scope.mails = Mails.query();
		};

		// Find existing Mail
		$scope.findOne = function() {
			$scope.mail = Mails.get({ 
				mailId: $stateParams.mailId
			});
		};


		//查看邮件详情
		$scope.viewMail = function (mail){

			//查看本次异常详情
			ModalService.showModal({
				templateUrl: 'modules/mails/views/view-mail.client.view.html',
				inputs: {
					title: '邮件详情',
					mail: mail
				},
				controller: function($scope, close, title, mail){
					$scope.title = title;
					$scope.mail = mail;
					$scope.explicitlyTrustedEmailDetail = $sce.trustAsHtml(mail.content);
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

'use strict';

//Mails service used to communicate Mails REST endpoints
angular.module('mails').factory('Mails', ['$resource',
	function($resource) {
		return $resource('mails/:mailId', { mailId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

// Configuring the Users module
angular.module('users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '用户列表', 'users', 'item', '/users', 'false', ['admin']);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// 用户路由
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
		state('listUsers', {
			url: '/users',
			templateUrl: 'modules/users/views/settings/list-users.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				$scope.success = true;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

        $scope.removeErr = function () {
            $scope.error = false;
        };
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.back = function() {
			window.history.back();
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'DTOptionsBuilder',
    function ($scope, $http, $location, Users, Authentication, DTOptionsBuilder) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Update a user profile
        $scope.updateUserProfile = function (isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function (response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function (response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function () {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

        $scope.find = function () {
            $scope.users = Users.query();
        };

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
            .withBootstrap();

        $scope.change = function (user) {
            $scope.success = $scope.error = null;
            user.$update(function () {
                $scope.success = true;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.back = function() {
            window.history.back();
        };
    }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);