!function(){"use strict";var a={errs:[]};window.performance&&window.performance.timing?a.navTiming=window.performance.timing:a.errs.push("浏览器不支持Navigation Timing API！"),window.performance&&window.performance.getEntriesByType?(a.resTimings=window.performance.getEntriesByType("resource"),a.pathname=window.location.pathname,a.appHost=window.location.host,a.userAgent=window.navigator.userAgent,a.platform=window.navigator.platform,setTimeout(function(){a.navTiming.loadEventEnd-a.navTiming.navigationStart<0&&a.errs.push("页面还在加载，获取数据失败！");var b=document.getElementById("feException"),c=b.src.split("/bookie.js/")[0],d=new Image(1,1);d.src=c+"/_fp.gif?"+encodeURIComponent(JSON.stringify(a))},0)):a.errs.push("浏览器不支持Resource Timing API！")}();