/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/6
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Exception Schema
 */
var EventSchema = new Schema({
  timestamp:{
    type: Number
  },
  following: {
    type: String,
    default: '',
  } // 隶属项目
});

mongoose.model('Event', EventSchema);
