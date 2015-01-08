'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * NavTiming Schema
 */
var NavTimingSchema = new Schema({
	navigationStart: {
		type: Number
	},
	unloadEventStart: {
		type: Number
	},
	unloadEventEnd: {
		type: Number
	},
	redirectStart: {
		type: Number
	},
	redirectEnd: {
		type: Number
	},
	fetchStart: {
		type: Number
	},
	domainLookupStart: {
		type: Number
	},
	domainLookupEnd: {
		type: Number
	},
	connectStart: {
		type: Number
	},
	connectEnd: {
		type: Number
	},
	secureConnectionStart: {
		type: Number
	},
	requestStart: {
		type: Number
	},
	responseStart: {
		type: Number
	},
	responseEnd: {
		type: Number
	},
	domLoading: {
		type: Number
	},
	domInteractive: {
		type: Number
	},
	domContentLoadedEventStart: {
		type: Number
	},
	domContentLoadedEventEnd: {
		type: Number
	},
	domComplete: {
		type: Number
	},
	loadEventStart: {
		type: Number
	},
	loadEventEnd: {
		type: Number
	}
});

mongoose.model('NavTiming', NavTimingSchema);
