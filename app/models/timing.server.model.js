'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Timing Schema
 */
var TimingSchema = new Schema({
	app: {
		type: Schema.ObjectId,
		ref: 'App',
		required: '请添加您的应用名称'
	},
	navTiming: {
		type: Schema.ObjectId,
		ref: 'NavTiming'
	},
	resTimings: {
		type: [{
			type: Schema.ObjectId,
			ref: 'ResTiming'
		}]
	}
});

mongoose.model('Timing', TimingSchema);
