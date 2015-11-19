'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var validateEmail = function(email) {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};


/**
 * Mail Schema
 * status:1-已发送、2-发送失败、3-未发送
 */
var MailSchema = new Schema({
	theme: {
		type: String,
		default: '',
		required: '请输入邮件主题',
		trim: true
	},
	content: {
		type: String,
		default: '',
		required: '请输入邮件内容',
		trim: true
	},
	status: {
		type: Number,
		default: 3
	},
	sendTime: {
		type: Date,
		default: Date.now
	},
	createTime: {
		type: Date,
		default: Date.now
	},
	receiver: {
		type: String,
		trim: true,
		required: '邮件地址',
		validate: [validateEmail, 'Please fill a valid email address'],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Mail', MailSchema);
