/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorController', ['$scope', '$stateParams', '$location',
  'Authentication', 'Apps',
  function ($scope, $stateParams, $location, Authentication, Apps) {
    $scope.authentication = Authentication;

    $scope.initBehavior = function () {
      $scope.app = Apps.get({
        appId: $stateParams.appId
      });
    };

    $scope.back = function () {
      window.history.back();
    };
  }]);
