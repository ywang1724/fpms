/**
 * Rookie.js v0.0.1
 * Copyright (c) 2014 wangyi
 */
window.onload = function () {
    'use strict';

    /*定义变量*/
    var rookie = {
        errors: []
    };

    /*浏览器支持检测*/

    //检测是否支持Navigation Timing API
    if (window.performance.timing) {
        rookie.timings = window.performance.timing;
    } else {
        rookie.errors.push("浏览器不支持Navigation Timing API！");
    }

    //检测是否支持Resource Timing API
    if (window.performance.getEntriesByType) {
        rookie.resources = window.performance.getEntriesByType("resource");
    } else {
        rookie.errors.push("浏览器不支持Resource Timing API！");
    }

    /*利用工具包分析页面加载数据调用（beta）*/
    setTimeout(function () {
        //检测页面是否加载完成
        if (rookie.timings.loadEventEnd - rookie.timings.navigationStart < 0) {
            rookie.errors.push("页面还在加载，获取数据失败！");
        }
        if (rookie.errors.length > 0) {
            for (var item in rookie.errors) {
                alert(rookie.errors[item]);
            }
        } else {
            // Ajax todo
            console.log(rookie.timings);
            /*var fp = document.createElement('script');
            fp.type = 'text/javascript';
            fp.async = true;
            fp.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(fp, s);*/
        }
    }, 0);

};
