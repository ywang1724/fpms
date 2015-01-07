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
		enum: ['java', 'node.js'],
		required: '请填写您的应用类型'
	},
	server: {
		type: String,
		required: '请填写您的应用所在服务器地址IPv4',
		match: [/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/, '请填写一个有效的IPv4地址，如127.0.0.1']
	}
});

mongoose.model('App', AppSchema);
