'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ResTiming Schema
 */
var ResTimingSchema = new Schema({
	initiatorType: {
		type: String
	},
	nextHopProtocol: {
		type: String
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
	transferSize: {
		type: Number
	},
	encodedBodySize: {
		type: Number
	},
	decodedBodySize: {
		type: Number
	},

	// Chrome
	duration: {
		type: Number
	},
	entryType: {
		type: String
	},
	name: {
		type: String
	},
	startTime: {
		type: Number
	}
});

mongoose.model('ResTiming', ResTimingSchema);
