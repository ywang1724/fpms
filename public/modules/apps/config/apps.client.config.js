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

angular.module('apps').config(function($datepickerProvider) {
    angular.extend($datepickerProvider.defaults, {
        animation: 'am-flip-x',
        autoclose: true,
        dateType: 'number'
    });
});

angular.module('apps').config(function($selectProvider) {
    angular.extend($selectProvider.defaults, {
        animation: 'am-flip-x'
    });
});

angular.module('apps').config(function($tooltipProvider) {
    angular.extend($tooltipProvider.defaults, {
        animation: 'am-flip-x',
        trigger: 'hover',
        placement: 'bottom',
        type: 'success'
    });
});

angular.module('apps').config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath('lib/zeroclipboard/dist/ZeroClipboard.swf');
}]);
