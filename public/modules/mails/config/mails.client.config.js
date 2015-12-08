'use strict';

// Configuring the Articles module
angular.module('mails').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '我的邮件', 'mails', 'dropdown', '/mails(/create)?');
		Menus.addSubMenuItem('topbar', 'mails', '邮件列表', 'mails');
	}
]);
