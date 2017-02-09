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
     * 当改变查询参数时，将值更新到parent scope中
     */
    $scope.changeArgs = function() {
      $scope.parentObj.selectPage = $scope.selectPage;
      $scope.parentObj.selectBrowser = $scope.selectBrowser;
      $scope.parentObj.selectInterval = $scope.selectInterval;
      $scope.parentObj.fromDate = $scope.fromDate;
      $scope.parentObj.untilDate = $scope.untilDate;
    }

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

  }]);
