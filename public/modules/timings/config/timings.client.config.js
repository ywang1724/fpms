'use strict';

// Configuring the Articles module
angular.module('timings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Timings', 'timings', 'dropdown', '/timings(/create)?');
		Menus.addSubMenuItem('topbar', 'timings', 'List Timings', 'timings');
		Menus.addSubMenuItem('topbar', 'timings', 'New Timing', 'timings/create');
	}
]);