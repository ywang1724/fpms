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
	name: {
		type: String,
		default: '',
		required: 'Please fill Timing name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Timing', TimingSchema);