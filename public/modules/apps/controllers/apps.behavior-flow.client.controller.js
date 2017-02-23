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

    $scope.dtOptions_path = DTOptionsBuilder
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

    //highmaps配置
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

    // highcharts浏览器终端配置
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
        data: [
          ['Firefox',   10.38],
          ['IE',       56.33],
          ['Chrome', 24.03],
          ['Safari',    4.77],
          ['Opera',     0.91],
        ]
      }]
    };

    $scope.$on('chartConfigEvent', function (e, args) {
      $scope.originConfig.series[0].data = args.origin;
      $scope.originConfig.options.chart.width = $('.panel-heading').width();
      $scope.searchEngineConfig.series[0].data = args.browser;
      $scope.searchEngineConfig.options.chart.width = $('.panel-heading').width();

      $scope.mapsConfig.options.chart.width = $('.panel-heading').width();

      $scope.browserConfig.options.chart.width = $('.panel-heading').width();

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
