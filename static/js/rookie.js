/**
 * Rookie.js v0.0.1
 * Copyright (c) 2014 wangyi
 */
window.onload = function () {
    'use strict';

    /*定义变量*/
    var rookie = {
        errs: []
    };

    /*浏览器支持检测*/

    //检测是否支持Navigation Timing API
    if (window.performance.timing) {
        rookie.navTiming = window.performance.timing;
    } else {
        rookie.errs.push('浏览器不支持Navigation Timing API！');
    }

    //检测是否支持Resource Timing API
    if (window.performance.getEntriesByType) {
        rookie.resTimings = window.performance.getEntriesByType('resource');
    } else {
        rookie.errs.push('浏览器不支持Resource Timing API！');
    }

    //获取用户相关信息
    rookie.pathname = window.location.pathname;
    rookie.appHost = window.location.host;
    rookie.userAgent = window.navigator.userAgent;
    rookie.platform = window.navigator.platform;

    /*向监测平台发送采集数据*/
    setTimeout(function () {
        //检测页面是否加载完成
        if (rookie.navTiming.loadEventEnd - rookie.navTiming.navigationStart < 0) {
            rookie.errs.push('页面还在加载，获取数据失败！');
        }
        //通过埋点脚本变量获取监测平台地址
        var serverHost = fp.src.split('/rookie.js/')[0];
        //通过Image对象请求发送数据
        var img = new Image(1, 1);
        img.src = serverHost + '/_fp.gif?' + JSON.stringify(rookie);
    }, 0);

};
