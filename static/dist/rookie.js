window.onload=function(){"use strict";var a={errs:[]};window.performance.timing?a.navTiming=window.performance.timing:a.errs.push("浏览器不支持Navigation Timing API！"),window.performance.getEntriesByType?a.resTimings=window.performance.getEntriesByType("resource"):a.errs.push("浏览器不支持Resource Timing API！");var b=window.location.pathname,c=b.lastIndexOf("/");a.page=b.substring(c+1),setTimeout(function(){if(a.navTiming.loadEventEnd-a.navTiming.navigationStart<0&&a.errs.push("页面还在加载，获取数据失败！"),a.errs.length>0)for(var b in a.errs)alert(a.errs[b]);else{var c=new Image(1,1);c.src="http://192.168.88.8:3000/_fp.gif?"+JSON.stringify(a)}},0)};