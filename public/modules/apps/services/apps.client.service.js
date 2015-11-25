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
