'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * App Schema
 */
var AppSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: '请填写您的应用名称',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	type: {
		type: String,
		enum: ['java', 'node.js', 'android', 'ios'],
		required: '请填写您的应用类型'
	},
	host: {
		type: String,
		required: '请填写您的应用所在域'
	},
	deadLinkInterval: {
		type: Number,
		default: 3600000
	},
	linkLastCheckTime: {
		type: Date,
		default: 0
	},
	alarmtype: {
		type: Array,
		default: [1, 2, 3, 4]
	}
});

mongoose.model('App', AppSchema);
