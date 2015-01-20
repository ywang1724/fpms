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
	navTiming: {
		type: Schema.ObjectId,
		ref: 'NavTiming'
	},
	resTimings: {
		type: [{
			type: Schema.ObjectId,
			ref: 'ResTiming'
		}]
	},
	page: {
		type: Schema.ObjectId,
		ref: 'Page',
		required: '请添加您的采集数据所属页面'
	},
	errs: {
		type: [{
			type: String
		}]
	}
});

mongoose.model('Timing', TimingSchema);
