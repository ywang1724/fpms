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
	createTime: {
		type: Date,
		default: Date.now
	},
	lastAlarmTime: {
		type: Date,
		default: Date.now,
		required: '请添加异常种类上次报警时间'
	},
	isAlarm: {
		type: Number,
		default: 1
	},
	occurTime: [Date],
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
	errorurl: {
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
