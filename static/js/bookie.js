/**
 * Bookie.js v0.0.1
 * Copyright (c) 2015 xujiangwei
 */


/**
 * TODO
 * 1. 链接获取向后端传输，应该放在页面底部；
 * 2. 与性能脚本rookie.js合并的问题；
 * 3. DOM结构异常检测，应该放在页面底部；
 * 4. Virtual DOM
 * 5. XSS Attack
 */


"use strict";

(function(){

    {{'exception'}}
    ;
    /**
     * 插入性能监控脚本函数&插入用户行为监测脚本 & 添加UI监控自定义规则录入脚本
     *
     */
    var addOtherJS = (function (document){
        var script   = document.createElement("script");
        script.type  = "text/javascript";
        script.async = 'true';
        var elem =  document.getElementById("feException");
        script.src   = elem.src.replace('bookie', 'rookie');

        //添加用户监测脚本
        var UBscript   = document.createElement("script");
        UBscript.type  = "text/javascript";
        UBscript.async = 'true';
        UBscript.src  = elem.src.replace('bookie', 'behavior');
        UBscript.src = elem.src + (document.referrer?("?referrer=" + document.referrer):'');

        // 添加UI监控自定义规则录入脚本
        var uiScript   = document.createElement("script");
        uiScript.type  = "text/javascript";
        uiScript.async = 'true';
        uiScript.src   = elem.src.replace('bookie', 'uookie');
        return function (){
            document.body.appendChild(script);
            document.body.appendChild(UBscript);
            document.body.appendChild(uiScript);
        };
    })(document);

    //兼容不同版本浏览器，并插入性能脚本
    var addFunctionOnWindowLoad = function(callback){
        if(window.addEventListener){
            window.addEventListener('load',callback,false);
        }else{
            window.attachEvent('onload',callback);
        }
    };

    addFunctionOnWindowLoad(addOtherJS);
})(window);


