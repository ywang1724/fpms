'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var customValidator = function (property) {
    return !this.needLogin || this.needLogin && property.length > 0;
}
var captchaSelectorValidator = function (property) {
    return !(this.needLogin && this.auth.useCaptcha) ||
        this.needLogin && this.auth.useCaptcha && property.length > 0;
}
/**
 * App Schema
 */
var AppSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: '请填写您的应用名称',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['java', 'node.js', 'android', 'ios'],
        required: '请填写您的应用类型'
    },
    host: {
        type: String,
        required: '请填写您的应用所在域'
    },
    deadLinkInterval: {
        type: Number,
        default: 3600000
    },
    uiInterval: {
        type: Number,
        default: 3600000
    },
    linkLastCheckTime: {
        type: Date,
        default: 0
    },
    alarmtype: {
        type: Array,
        default: [1, 2, 3, 4]
    },
    alarmInterval: {
        type: Number,
        default: 900000
    },
    alarmEmail: {
        type: String,
        trim: true,
        default: '',
        match: [/.+\@.+\..+/, '请填写一个有效的邮箱地址']
    },
    config: {
        exception: {
            type: Boolean,
            default: true
        },
        performance: {
            type: Boolean,
            default: true
        },
        behavior: {
            type: Boolean,
            default: false
        },
        ui: {
            type: Boolean,
            default: false
        }
    },
    needLogin: {
        type: Boolean,
        default: false
    },
    auth: {
        url: {
            type: String,
            default: '',
            validate: [customValidator, '请填写登陆页面'],
            trim: true
        },
        username: {
            type: String,
            default: '',
            validate: [customValidator, '请填写监测页面用户名'],
            trim: true
        },
        password: {
            type: String,
            default: '',
            validate: [customValidator, '请填写监测页面密码'],
            trim: true
        },
        useCaptcha: {
            type: Boolean,
            default: false
        },
        captchaSelector: {
            type: String,
            default: '',
            validate: [captchaSelectorValidator, '请填写监测页面验证码选择器'],
            trim: true
        },
        usernameSelector: {
            type: String,
            default: '',
            validate: [customValidator, '请填写监测页面用户名输入框选择器'],
            trim: true
        },
        passwordSelector: {
            type: String,
            default: '',
            validate: [customValidator, '请填写监测页面密码输入框选择器'],
            trim: true
        },
        loginFormSelector: {
            type: String,
            default: '',
            validate: [customValidator, '请填写监测页面登陆表单选择器'],
            trim: true
        }
    }
});

mongoose.model('App', AppSchema);
