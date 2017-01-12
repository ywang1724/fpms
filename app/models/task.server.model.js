'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Task Schema
 */
var Task = new Schema({
    appId: Schema.ObjectId,
    url: String,
    diffRules: [String],
    domRules: [{
        selector: String,
        expect: String
    }],
    base: Date
});

mongoose.model('Task', Task);
