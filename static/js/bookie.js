/**
 * Bookie.js v0.0.1
 * Copyright (c) 2015 xujiangwei
 */


/**
 * TODO
 * 1. 链接获取向后端传输，应该放在页面底部；（可考虑与3做在一起，单独后台设置一个接收的接口）
 * 2. 与性能脚本rookie.js合并的问题；
 * 3. DOM结构异常检测，应该放在页面底部；
 * 4. 捕获JS异常；
 * 5. 捕获Ajax异常；
 * 6. 捕获静态资源请求异常；
 * 7. 用户平台信息收集；
 * 8. 上报函数捕获；
 */


"use strict";


/**
 * XMLHttprequest异常捕获
 *
 */
(function(XHR) {

    var open = XHR.prototype.open;
    var send = XHR.prototype.send;

    XHR.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        open.call(this, method, url, async, user, pass);
    };

    XHR.prototype.send = function(data) {
        var self = this;
        var oldOnReadyStateChange;
        var url = this._url;

        function onReadyStateChange() {
            if(self.readyState == 4 /* complete */) {
                /* This is where you can put code that you want to execute post-complete*/
                /* URL is kept in this._url */
                console.log(self);
            }

            if(oldOnReadyStateChange) {
                oldOnReadyStateChange();
            }
        }

        /* Set xhr.noIntercept to true to disable the interceptor for a particular call */
        if(!this.noIntercept) {
            if(this.addEventListener) {
                this.addEventListener("readystatechange", onReadyStateChange, false);
            } else {
                oldOnReadyStateChange = this.onreadystatechange;
                this.onreadystatechange = onReadyStateChange;
            }
        }

        send.call(this, data);
    }
})(XMLHttpRequest);


/**
 * 捕获JavaScript异常
 *
 */
window.onerror = function () {
    return true;
};

/**
 * 捕获静态资源请求异常
 *
 */
window.addEventListener("error", function (e) {
    var eleArray = ["IMG", "SCRIPT", "LINK"];
    var resourceMap = {
        "IMG": "图片",
        "SCRIPT": "脚本文件",
        "LINK": "样式文件"
    };
    var ele = e.target;
    if(eleArray.indexOf(ele.tagName) != -1){
        var url = ele.tagName == "LINK" ? ele.href: ele.src;
        console.log("地址为：" + url + "的" + resourceMap[ele.tagName] + "加载失败");
    }
    return true;
}, true);



/**
 * 获取用户客户端平台信息
 *
 */
function getUserInfo (){
    return {
        pathname : window.location.pathname,
        appHost : window.location.host,
        userAgent : window.navigator.userAgent,
        platform : window.navigator.platform
    };
};

/**
 * 异常上报函数
 *
 */
function reportException (){
    var bookie = {};

};
