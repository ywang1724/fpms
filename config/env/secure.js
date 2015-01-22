'use strict';

module.exports = {
	port: 443,
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/fpms',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/datatables/media/css/jquery.dataTables.min.css'
			],
			js: [
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/datatables/media/js/jquery.dataTables.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-datatables/dist/angular-datatables.min.js',
                'public/lib/angular-strap/dist/angular-strap.min.js',
                'public/lib/angular-strap/dist/angular-strap.tpl.min.js',
                'public/lib/angular-i18n/angular-locale_zh-cn.js',
                'public/lib/highcharts/highcharts.js',
                'public/lib/highcharts-ng/dist/highcharts-ng.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	}
};
