'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Exception Schema
 */
var ExceptionSchema = new Schema({
	time: {
		type: Date,
		default: Date.now
	},
	type: {
		type: Number,
		required: '请添加异常类型'
	},
	ui: {
		browser: {
			type: String,
			default: ''
		},
		version: {
			type: String,
			default: ''
		},
		mobile: {
			type: String,
			default: ''
		},
		os: {
			type: String,
			default: ''
		},
		osversion: {
			type: String,
			default: ''
		},
		bit: {
			type: String,
			default: ''
		},
		ip: {
			type: String,
			default: ''
		}
	},
	errorrl: {
		type: String,
		default: ''
	},
	requrl: {
		type: String,
		default: ''
	},
	message: {
		type: String,
		default: ''
	},
	stack: {
		type: String,
		default: ''
	},
	page: {
		type: Schema.ObjectId,
		ref: 'Page'
	}
});

mongoose.model('Exception', ExceptionSchema);
