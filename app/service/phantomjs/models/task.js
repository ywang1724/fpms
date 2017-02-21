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
    app: {
        type:Schema.ObjectId,
        ref: "App"
    },
    url: {
        type:String,
        required: "请填写监控页面的URL"
    },
    diffRules: [String],
    domRules: [{
        selector: String,
        expect: String,
        _id: false
    }],
    base: {
        type: Date,
        default: null
    },
    monitoringInterval: {
        type: Number,
        default: 1800000
    },
    createTime: {
        type: Date,
        default: new Date()
    },
    lastRunTime:{
        type: Date,
        default: null
    },
    isRunning: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Task', Task);
