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
	uiInterval: {
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
	},
	alarmInterval: {
		type: Number,
		default:900000
	},
	alarmEmail: {
		type: String,
		trim: true,
		default: '',
		match: [/.+\@.+\..+/, '请填写一个有效的邮箱地址']
	}
});

mongoose.model('App', AppSchema);
