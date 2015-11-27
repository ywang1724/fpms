'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * ExceptionKind Schema
 */
var ExceptionKindSchema = new Schema({
    count: {
        type: Number,
        required: '请添加异常发生次数',
        default: 1
    },
    lastAlarmTime: {
        type: Date,
        required: '请添加异常种类上次报警时间'
    },
    type: {
        type: Number,
        required: '请添加异常类型'
    },
    errorurl: {
        type: String,
        default: ''
    },
    requrl: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    stack: {
        type: String,
        default: ''
    },
    page: {
        type: Schema.ObjectId,
        ref: 'Page'
    },
    isAlarm: {
        type: Number
    }
});

mongoose.model('ExceptionKind', ExceptionKindSchema);
