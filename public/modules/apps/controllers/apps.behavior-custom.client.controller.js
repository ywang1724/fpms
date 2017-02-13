/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/7
 */
'use strict';

//Apps controller
angular.module('apps').controller('AppsBehaviorCustomController', ['$scope', '$stateParams', '$location',
  'Authentication',
  function ($scope, $stateParams, $location, Authentication) {
    $scope.authentication = Authentication;

    $scope.redirect = function () {
      location.href = $scope.redirectURL;
    }

  }]);
