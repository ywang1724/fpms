'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Exception Schema
 */
var ExceptionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Exception name',
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

mongoose.model('Exception', ExceptionSchema);