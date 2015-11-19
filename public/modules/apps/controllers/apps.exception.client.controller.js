'use strict';

// Apps controller
angular.module('apps').controller('AppsExceptionController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apps',
    'DTOptionsBuilder', '$http', '$timeout',
    function ($scope, $stateParams, $location, Authentication, Apps, DTOptionsBuilder, $http, $timeout) {
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
                        $scope.selectPage = $scope.pages[0];
                        //统计间隔
                        $scope.intervals = [
                            {'name': '日', 'id': 'day'}, {'name': '月', 'id': 'month'}, {'name': '年', 'id': 'year'}
                        ];
                        $scope.selectInterval = $scope.intervals[0];


                        //日期范围初始化
                        var now = new Date();
                        $scope.nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
                        $scope.fromDate = $scope.nowDate - 1296000000; //往前15天
                        $scope.untilDate = $scope.nowDate;


                    } else {

                    }
                });






        };









        //返回
        $scope.back = function () {
            window.history.back();
        };

    }
]);
