/**
 * Rookie.js v0.0.2
 * Copyright (c) 2015 wangyi xujiangwei
 */


/**
 * 性能采集脚本
 */
(function() {
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
        var elem =  document.getElementById("feException");
        var serverHost =elem.src.split('/bookie.js/')[0];
        //通过Image对象请求发送数据
        var img = new Image(1, 1);
        img.src = serverHost + '/_fp.gif?' + encodeURIComponent(JSON.stringify(rookie));
    }, 0);

})();

/**
 * DOM ID重复检测
 */
var DOMReplicateIDDect = function (){
    var nodes = document.querySelectorAll('[id]');
    var ids = {};
    var totalNodes = nodes.length;

    for(var i=0; i<totalNodes; i++) {
        var currentId = nodes[i].id ? nodes[i].id : "undefined";
        if(isNaN(ids[currentId])) {
            ids[currentId] = 0;
        }
        ids[currentId]++;
    }
    var duplicateIDs = [];
    for(i in ids){
        if(ids[i] >1){
            duplicateIDs.push(i);
        }
    }

    if(duplicateIDs.length === 0){
        return null;
    }else {
        return duplicateIDs;
    }
};

/**
 * DOM异常捕获-6
 */
(function DOMException (){
    if(document.doctype == null || document.doctype == undefined){
        reportException(6, '未声明DOCTYPE', '', '', '');
    }
    var ids = DOMReplicateIDDect();
    if(ids != null && ids != undefined){
        reportException(6, 'ID重复:' + ids.toString(), '', '', 'ID重复:' + ids.toString());
    }
})();

/**
 * Link收集并上传，异常类型为4
 */
(function (){
    var linkNodes = Array.prototype.slice.call(document.querySelectorAll("a"));
    //过滤掉功能性、锚、空的链接
    var valideLinkNodes = linkNodes.filter(function(ele){
        return !/^[#|javascript:]/.test(ele.getAttribute("href")) &&  /^[http|https]/.test(ele.href) && '' !== ele.getAttribute('href');
    });
    //返回链接数组并去重
    var linkArray = valideLinkNodes.map(function(ele){return ele.href});
    var linkArray2 = [];
    (function unique(arr, newArr) {
        var num;

        if (-1 == arr.indexOf(num = arr.shift())) newArr.push(num);

        arr.length && unique(arr, newArr);
    })(linkArray, linkArray2);
    reportException(4, '', '', '', linkArray2);
})();
