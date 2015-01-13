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

    var pathname = window.location.pathname;
    var lastIndex = pathname.lastIndexOf('/');
    rookie.page = pathname.substring(lastIndex + 1);

    /*利用工具包分析页面加载数据调用（beta）*/
    setTimeout(function () {
        //检测页面是否加载完成
        if (rookie.navTiming.loadEventEnd - rookie.navTiming.navigationStart < 0) {
            rookie.errs.push('页面还在加载，获取数据失败！');
        }
        if (rookie.errs.length > 0) {
            for (var item in rookie.errs) {
                alert(rookie.errs[item]);
            }
        } else {
            // send data to server todo
            /*var fp = document.createElement('script');
            fp.type = 'text/javascript';
            fp.async = true;
            fp.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.192.168.88.177:3000/rookie.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(fp, s);*/

            //通过Image对象请求后端脚本
            var img = new Image(1, 1);
            img.src = 'http://localhost:3000/_fp.gif?' + JSON.stringify(rookie);
        }
    }, 0);

};
