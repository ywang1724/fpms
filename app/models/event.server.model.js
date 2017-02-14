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
  cssPath: {
    type: String,
    default: '',
  }, // css路径
  text: {
    type: String,
    default: ''
  }, // 文本
  url: {
    type: String,
    default: ''
  }, //所在页面url
  following: {
    type: String,
    default: '',
  }, // 隶属项目
});

mongoose.model('EventSchema', EventSchema);
