'use strict';

var env = require('./../../env.json');

module.exports = {
	app: {
		title: 'FPMS',
		description: 'For test.',
		keywords: 'Front-end, Performance, Monitor, System'
	},
	port: process.env.PORT || 8088,
	templateEngine: 'swig',
	sessionSecret: 'FPMS',
	sessionCollection: 'sessions',
	sessionCookie: {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: null
	},
	sessionName: 'connect.sid',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/bootstrap-additions/dist/bootstrap-additions.css',
				'public/lib/angucomplete-alt/angucomplete-alt.css',
				'public/lib/angular-motion/dist/angular-motion.css',
				'public/lib/datatables/media/css/jquery.dataTables.css',
				'public/lib/datatables-responsive/css/dataTables.responsive.css',
				'public/lib/font-awesome/css/font-awesome.css',
				'public/lib/sweetalert/dist/sweetalert.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.js',
				'public/lib/datatables/media/js/jquery.dataTables.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-datatables/dist/angular-datatables.js',
				'public/lib/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.js',
				'public/lib/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.js',
                'public/lib/datatables-responsive/js/dataTables.responsive.js',
                'public/lib/angular-strap/dist/angular-strap.js',
                'public/lib/angular-strap/dist/angular-strap.tpl.js',
                'public/lib/angular-i18n/angular-locale_zh-cn.js',
                'public/lib/highcharts/highcharts.src.js',
                'public/lib/highcharts/highcharts-more.src.js',
								'public/lib/highcharts/modules/map.src.js',
				        'public/lib/highcharts/modules/funnel.src.js',
                'public/lib/highcharts/modules/exporting.src.js',
					      'public/js/cn-all-sar-taiwan.js',
                'public/lib/highcharts-ng/dist/highcharts-ng.js',
                'public/lib/ng-clip/src/ngClip.js',
                'public/lib/zeroclipboard/dist/ZeroClipboard.js',
				'public/lib/angular-modal-service/dst/angular-modal-service.js',
				'public/lib/cytoscape/dist/cytoscape.min.js',
				'public/lib/angucomplete-alt/dist/angucomplete-alt.min.js',
				'public/lib/sweetalert/dist/sweetalert.min.js',
				'public/lib/angular-sweetalert/SweetAlert.js',
				'public/lib/moment/min/moment.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	},
	mailer: {
		from: env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			},
			host: env.MAILER_HOST || 'MAILER_HOST',
			ignoreTLS: true
		}
	}
};
