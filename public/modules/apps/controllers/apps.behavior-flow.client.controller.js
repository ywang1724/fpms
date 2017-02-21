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
    $scope.pathAnalysisData = {};

    $scope.viewFlow = function () {

    };

    $scope.getPathData = function () {
      // $http.get('pathAnalysis?appId=' + '12')
      //   .success(function (result) {
      //     for(var i=0; i<result.data.length; i++) {
      //       var ref = [];
      //       for(var j=0; j<result.data[i][2].length; j++) {
      //         var temp = {
      //           'from': result.data[i][2][j][0],
      //           'to': result.data[i][2][j][1],
      //           'edge_width': result.data[i][2][j][2]/1000
      //         };
      //         ref.push(temp);
      //       }
      //       $scope.pathAnalysisData[result.data[i][0]] = {
      //         'id': result.data[i][0],
      //         'confusionmatrix': [[result.data[i][1]]],
      //         'name': '节点' + i,
      //         'ref':ref
      //       }
      //     }
      //
      //
      //   })
      var myGraph = new Graph(d3);
      init_page(myGraph, $scope.pathAnalysisData);
    }

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
          enabled: false
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

    // D3路径配置
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

      $scope.mapsConfig.options.chart.width = $('.panel-heading').width();

      $scope.browserConfig.options.chart.width = $('.panel-heading').width();

    });



    function Graph(d3) {
      //step 0, new graph() ,import "http://d3js.org/d3.v3.min.js" to get d3

      //step 1, custom the config
      this.config = {
        bg_size: {
          width: 800,
          height: 600
        },
        edge_def_width: 5,
        edge_show_arrow: true,
        node_draggable: true,
        show_performance_bar: false
      }

      var self = this;
      var cluster = d3.layout.cluster().size([self.config.bg_size.height, self.config.bg_size.width - 160]);


      /// step 2, custom the actions
      var showTitleAction;
      var showSubheadAction;
      var showPathDesc;

      this.showTitle = function (f) {
        showTitleAction = f;
      }

      this.showSubhead = function (f) {
        showSubheadAction = f;
      }

      this.showPathDesc = function (f) {
        showPathDesc = f;
      }


      /// final step , bind some data

      this.bind = function (data) {

        /**
         忽略连通图中的回路，产生一棵树。
         这棵树符合cluster.nodes(tree)的调用要求（参见：https://github.com/mbostock/d3/wiki/Cluster-Layout）
         */
        var conv2tree = function (data) {
          var root = self.getRoot(data);
          var hasParentFlag = {}; //保证每个节点只有一个父节点，以便形成树状结构
          hasParentFlag[root.id] = true; //根节点不允许作为子节点
          self.traverseEdge(data, function (source, target) { //遍历每条边，即所有节点间关系
            if (!hasParentFlag[target.id] && source.id != target.id) { //首次被遍历到的target，作为source的子节点，后续将不被其它节点作为子节点
              if (!source.children) {
                source.children = [];
              }
              source.children.push(target);
              hasParentFlag[target.id] = true;
            }
          });
          return root;
        }


        /**
         通过cluster.nodes(tree)，为tree的每个节点计算x，y，depth等属性以便定位
         */
        var buildNodes = function (tree) {
          return cluster.nodes(tree);
        }

        /**
         建立节点之间各条边。
         如果直接调用cluster.links(nodes)，其只支持树状结构，回路会被丢弃，借此把所有边补充完整。
         */
        var buildLinks = function (data) {
          var result = [];
          self.traverseEdge(data, function (source, target, ref) {
            result.push({
              'source': source,
              'target': target,
              'ref': ref
            });
          });
          return result;
        }

        /**
         更新数据时保留原有节点的位置信息
         */
        var merge = function (nodes, links) {

          var oldData = [];
          if (self.nodes) { //原nodes存在，输出oldData
            self.nodes.forEach(function (d) {
              oldData[d.id] = d;
            });
          }
          if (oldData) { //用oldData里的数据覆盖现nodes里的数据
            nodes.forEach(function (d) {
              if (oldData[d.id]) {
                d.x = oldData[d.id].x;
                d.y = oldData[d.id].y;
              }
            });
          }


          self.nodes = nodes;
          self.links = links;

        }

        //1)连通图->树 参见：https://github.com/mbostock/d3/wiki/Cluster-Layout)
        //1)temporarily convert a connectivity to a tree
        var tree = conv2tree(data);
        //2)根据树状结构计算节点位置.
        //2)caculate for nodes' coords with <code>cluster.nodes(tree);</code>
        var nodes = buildNodes(tree);
        //3)因为连通图是网状而非树状，将所有边补充完整
        //3)fill in all the edges(links) of the connectivity
        var links = buildLinks(data);
        //4)与原有的数据做一次merge，保留位置等信息
        //4)do merge to keep info like node's position
        merge(nodes, links);
        //5)重绘
        //5)redraw
        self.redraw();
      }


      /// call redraw() if necessary (reconfig,recostom the actions, etc. )
      this.redraw = function () {
        var fontSize = 8
        var lineSpace = 2
        var boxHeight = 50
        var boxWidth = 85
        var svg

        var width = self.config.bg_size.width;
        var height = self.config.bg_size.height;

        var yscale_performancebar = d3.scale.linear()
          .domain([0, 1])
          .rangeRound([boxHeight / 2, -boxHeight / 2])


        var diagonal = d3.svg.diagonal()
          .projection(function (d) {
            return [d.y - boxWidth / 2, d.x];
          });


        var _clear = function () {
          d3.select("#pathFigure svg").remove();

          svg = d3.select("#pathFigure").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(80,0)");

          svg.append("svg:defs").selectAll("marker")
            .data(["suit"])
            .enter().append("svg:marker")
            .attr("id", "idArrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
        }

        var _redrawEdges = function () {
          var linksWithArrow = self.links;

          //to show arrow at the end of the path with fixed size, we have to copy each path with .stroke-width=1
          if (self.config.edge_show_arrow) {
            linksWithArrow = [];
            self.links.forEach(function (d) {

              var fake = {};

              for (var prop in d) {
                fake[prop] = d[prop];
              }

              fake.faked = true; //copy each path with .faked=true as flag

              linksWithArrow.push(fake);
              linksWithArrow.push(d);


            })
          }

          var path = svg.selectAll(".link").data(linksWithArrow);


          // when new path arrives
          path.enter().insert("path", ":first-child")
            .attr("marker-end", function (d) {
              if (d.faked) return "url(#idArrow)";
            })
            .attr("id", function (d) {
              if (!d.faked) return "link" + d.ref.from + "-" + d.ref.to;
            })
            .attr("class", function (d) {
              return "link" + " link-" + d.ref.from + " link-" + d.ref.to;
            })
            .attr("d", diagonal)
            .transition()
            .duration(3000)
            .style("stroke-width", function (d) {
              if (d.faked) {
                return 1;
              }
              if (d.ref.edge_width) return d.ref.edge_width; //won't become invisible if too thin
              else return self.config.edge_def_width; //default value
            });

          // when path changes
          path.attr("d", diagonal);

          // when path's removed
          path.exit().remove();

        }


        _clear();

        _redrawEdges();

        ///show description on each path(edge)
        if (showPathDesc) {
          svg.selectAll(".abc").data(self.links).enter().append("text").append("textPath")
            .attr("xlink:xlink:href", function (d) {
              return "#link" + d.ref.from + "-" + d.ref.to;
            }) //why not .attr("xlink:href",...)? this's a hack, see https://groups.google.com/forum/?fromgroups=#!topic/d3-js/vLgbiM4ki1g
            .attr("startOffset", "50%")
            .text(showPathDesc)
        }

        ///show each node with text

        var existingNodes = svg.selectAll(".node").data(self.nodes); //选中所有节点

        //矩形
        //draw rectangle
        var newNodes = existingNodes.enter().append("g");

        newNodes.attr("class", "node")
          .attr("id", function (d) {
            return "node-" + d.id
          })
          .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
          })
          //.append("rect") //make nodes as rectangles OR:
          .append("circle").attr('r',50) //make nodes as circles
          .attr('class', 'nodebox')
          .attr("x", -boxWidth / 2)
          .attr("y", -boxHeight / 2)
          .attr("width", boxWidth)
          .attr("height", boxHeight)





        if (self.config.node_draggable) {
          newNodes.call(d3.behavior.drag().origin(Object).on("drag", function (d) {
            //拖动时移动节点
            //translate the node
            function translate(x, y) {
              return {
                'x': x,
                'y': y
              }
            }
            var coord = eval(d3.select(this).attr("transform"));
            d3.select(this)
              .attr("transform", "translate(" + (coord.x + d3.event.dx) + "," + (coord.y + d3.event.dy) + ")")


            //拖动时重绘边
            //update node's coord ,then redraw affected edges
            d.x = d.x + d3.event.dy;
            d.y = d.y + d3.event.dx;

            _redrawEdges();

          }));
        }



        //红色柱状性能指示图
        //show performance bar
        if (self.config.show_performance_bar) {
          newNodes.append("rect")
            .attr('class', 'performancebar')
            .attr("x", boxWidth / 2 * 1.05)
            .attr("width", boxWidth / 10)
            .style("fill", "red")
            .style("stroke", "red")
            .attr("y", boxHeight / 2)
            .attr("height", 0)

          //计算柱状图高度
          existingNodes.select('.performancebar')
            .transition()
            .duration(1000)
            .attr("y", function (d) {
              return yscale_performancebar(d.load)
            })
            .attr("height", function (d) {
              return boxHeight / 2 - yscale_performancebar(d.load)
            })
        }

        ///构造文案容器
        ///text constructors

        //标题
        //node titles
        newNodes.append("text")
          .attr("class", "nodeTitle")
          .attr("y", -boxHeight / 2 + fontSize + 2 * lineSpace)
          .attr("text-anchor", "middle")

        //副标题
        //node subhead
        newNodes.append("text")
          .attr("text-anchor", "middle")
          .attr("class", "nodeText f1Text")
          .attr("y", -boxHeight / 2 + 2 * fontSize + 3 * lineSpace)

        //详情矩阵
        //node body text
        newNodes.append("g")
          .attr("class", "confusionmatrix")
          .selectAll("g").data(function (d) {
          return d.confusionmatrix ? d.confusionmatrix : []
        })
          .enter().append("g")
          .attr("class", "rows")
          .attr("transform", function (d, i) {
            return "translate(" + (-15) + "," + (-boxHeight / 2 + (i + 3) * fontSize + (i + 4) * lineSpace) + ")";
          })
          .selectAll("g").data(function (d) {
          return d
        })
          .enter().append("g")
          .attr("class", "columns")
          .attr("transform", function (d, i) {
            return "translate(" + i * 30 + ",0)";
          })
          .append("text")
          .attr("text-anchor", "middle")
          .attr("class", "nodeText")




        ///显示文案
        ///show text

        existingNodes.select(".nodeTitle").text(showTitleAction ? showTitleAction : function (d) {
          return d.id + ")" + d.name
        }); //标题
        existingNodes.select(".f1Text").text(showSubheadAction ? showSubheadAction : function (d) {
          return Math.round(d.load * 100) + "%"
        }); //副标题


        existingNodes.select(".confusionmatrix") //详情矩阵
          .selectAll(".rows")
          .data(function (d) {
            return d.confusionmatrix ? d.confusionmatrix : []
          })
          .selectAll(".columns") //rows
          .data(function (d) {
            return d
          })
          .select("text")
          .text(function (d) {
            return d
          })
      }


      /**
       返回根节点
       return the root node
       */
      this.getRoot = function (data) {
        return data['0'];
      };

      /**
       遍历所有节点
       traverse all nodes
       callback(node)
       */
      this.traverse = function (data, callback) {
        if (!data) console.error('data is null')

        function _init() {
          var i;
          for (i in data) {
            data[i].visited = false;
          }
        }

        function _traverse(pt, callback) {
          if (!pt) {
            return;
          }
          pt.visited = true;
          console.debug("traverse node:" + pt.id);
          callback(pt);
          if (pt.ref) {
            pt.ref.forEach(function (ref) {
              var childNode = data[ref.to.toString()];
              if (childNode && !childNode.visited) {
                _traverse(childNode, callback);
              }
            })
          }



        }

        _init();
        _traverse(self.getRoot(data), callback);
      };

      /**
       遍历所有边
       traverse all edges
       callback(sourceNode,targetNode,ref)
       */
      this.traverseEdge = function (data, callback) {
        if (!data) console.error('data is null')

        self.traverse(data, function (node) {
          if (node.ref) {
            node.ref.forEach(function (ref) {
              var childNode = data[ref.to.toString()];
              if (childNode) {
                console.debug("traverse edge:" + node.id + "-" + childNode.id);
                callback(node, childNode, ref);
              }
            });
          }
        });
      };



    }
    function init_page(myGraph,data){
      // request data here
      var data = {
        "0": {
          id: 0,
          name: "root",
          confusionmatrix: [
            ['/']
          ],
          ref: [{
            from: 0,
            to: 1,
            edge_width: 12,
          }]
        },
        "1": {
          id: 1,
          name: "systemA",
          confusionmatrix: [
            ['/signup'],
          ],
          ref: [{
            from: 1,
            to: 2,
            edge_width: 23,
          } ]
        },
        "2": {
          id: 2,
          name: "systemB",
          confusionmatrix: [
            ['/signin']
          ],
          ref: [{
            from: 2,
            to: 0,
            edge_width: 45,
          }, ]
        }
      };

//customize anything here
      myGraph.showTitle(function (d) {
        return d.name;
      });

      myGraph.showSubhead(function (d) {
        return "p0";
      });

      myGraph.showPathDesc(function (d) {
        return '-[' + d.ref.edge_width + ']->';
      });

      myGraph.bind(data);

    }

/////////function(class) Graph end////////////////

  }]);
