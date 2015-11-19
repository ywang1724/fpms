'use strict';

// Configuring the Articles module
angular.module('mails').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mails', 'mails', 'dropdown', '/mails(/create)?');
		Menus.addSubMenuItem('topbar', 'mails', 'List Mails', 'mails');
		Menus.addSubMenuItem('topbar', 'mails', 'New Mail', 'mails/create');
	}
]);