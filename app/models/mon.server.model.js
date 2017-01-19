'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Monitor Schema
 */
var MonSchema = new Schema({
    taskId:{
        type: Schema.ObjectId,
        ref: "Task"
    },
    timestamp: Number,
    hasException: {
        type: Boolean,
        default: false
    },
    data: {
        info: Schema.ObjectId,
        tree: Schema.ObjectId,
        screenShot: Schema.ObjectId,
        diffPic: Schema.ObjectId
    },
    uiExceptions: {
        add: Number,
        remove: Number,
        text: Number,
        style: Number
    },
    domException: [Schema.Types.Mixed]
});

mongoose.model('Mon', MonSchema);
