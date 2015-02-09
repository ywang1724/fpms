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
	},
	created: {
		type: Date,
		default: Date.now
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
    }
});

mongoose.model('Timing', TimingSchema);
