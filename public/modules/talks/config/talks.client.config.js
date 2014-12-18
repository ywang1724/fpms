'use strict';

// Configuring the Articles module
angular.module('talks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Talks', 'talks', 'dropdown', '/talks(/create)?');
		Menus.addSubMenuItem('topbar', 'talks', 'List Talks', 'talks');
		Menus.addSubMenuItem('topbar', 'talks', 'New Talk', 'talks/create');
	}
]);