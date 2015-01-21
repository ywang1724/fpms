'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Page Schema
 */
var PageSchema = new Schema({
	pathname: {
		type: String,
		default: '',
		required: '请填写页面名称',
		trim: true
	},
	app: {
		type: Schema.ObjectId,
		ref: 'App',
		required: '请添加您的应用名称'
	}
});

mongoose.model('Page', PageSchema);
