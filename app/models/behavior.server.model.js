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
var BehaviorSchema = new Schema({
  following: {
    type: String,
    default: '',
  }, // 隶属项目
  ip: {
    type: String,
    default: '',
  }, // ip地址
  keyword: {
    type: String,
    default: '',
  }, // 搜索关键字
  timestamp: {
    type: Number,
  }, // 时间戳
  address: {
    type: Schema.Types.Mixed,
    default: {},
  }, // 地理信息
  browser: {
    type: String,
    default: '',
  }, // 浏览器类别
  screen: {
    type: String,
    default: '',
  }, // 屏幕分辨率
  system: {
    type: String,
    default: '',
  }, // 系统
  title: {
    type: String,
    default: '',
  }, // html中title
  referer: {
    type: String,
    default: '',
  }, // 上一页跳转链接
  url: {
    type: String,
    default: '',
  }, // 当前页链接
  gu_id: {
    "type": String,
    default: '',
  } // 用户ID
});

/**
 * Methods
 */
BehaviorSchema.methods = {
  saveData: function (data) {
    this.keyword = data.keyword;
    this.system = data.system;
    this.browser = data.browser;
    this.ip = data.ip;
    this.address = data.address;
    return this.save();
  },
  getIPCount: function () {
    return this.find().distinct('ip').count();
  }
};

mongoose.model('Behavior', BehaviorSchema);
