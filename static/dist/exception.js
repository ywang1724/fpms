function getPlatformInfo(){return{pathname:window.location.pathname,appHost:window.location.host,userAgent:window.navigator.userAgent,platform:window.navigator.platform}}window.reportException=function(a,b,c,d,e){var f={};f.occurTime=new Date,f.type=a,f.userPlatformInfo=getPlatformInfo(),f.message=b,f.errorurl=c,f.requrl=d,f.stack=e,console.log("sending......");var g=document.getElementById("feException"),h=g.src.split("/bookie.js/")[0],i=new Image(1,1);i.src=h+"/_fe.gif?"+encodeURIComponent(JSON.stringify(f))},function(a){var b=a.prototype.open,c=a.prototype.send;a.prototype.open=function(a,c,d,e,f){this._url=c,b.call(this,a,c,d,e,f)},a.prototype.send=function(a){function b(){if(4==e.readyState&&404==e.status){var a=document.getElementsByTagName("script"),b=a[a.length-1].src,c=e._url+"的请求"+e.statusText,f=e._url;reportException(2,c,b,f,"")}d&&d()}var d,e=this;this._url;this.noIntercept||(this.addEventListener?this.addEventListener("readystatechange",b,!1):(d=this.onreadystatechange,this.onreadystatechange=b)),c.call(this,a)}}(XMLHttpRequest),window.addEventListener("error",function(a,b){var c=["IMG","SCRIPT","LINK"],d={IMG:"图片",SCRIPT:"脚本文件",LINK:"样式文件"},e=a.target;if(c.indexOf(e.tagName)!=-1){var b="LINK"==e.tagName?e.href:e.src;console.log("地址为："+b+"的"+d[e.tagName]+"加载失败");var f=b.substring(b.lastIndexOf("/")+1)+"的"+d[e.tagName]+"加载失败",g=e.baseURI,h=b;return reportException(3,f,g,h,""),!0}},!0);var jsMemoryUsage=function(){var a=jsMemoryObj.usedJSHeapSize,b=jsMemoryObj.totalJSHeapSize;jsMemoryObj.jsHeapSizeLimit;a/b>=.85&&(console.log("内存使用过多"),clearInterval(jsMemoryUsageTimer),reportException(7,"内存使用过多，超过85%，请优化","","","内存使用过多，超过85%，请优化"))},jsMemoryObj=window.performance&&window.performance.memory,jsMemoryUsageTimer;jsMemoryObj?jsMemoryUsageTimer=setInterval(jsMemoryUsage,2e3):console.log("不支持内存检测");var DOMReplicateIDDect=function(){for(var a=document.querySelectorAll("[id]"),b={},c=a.length,d=0;d<c;d++){var e=a[d].id?a[d].id:"undefined";isNaN(b[e])&&(b[e]=0),b[e]++}var f=[];for(d in b)b[d]>1&&f.push(d);return 0===f.length?null:f};!function(){null!=document.doctype&&void 0!=document.doctype||reportException(6,"未声明DOCTYPE","","","");var a=DOMReplicateIDDect();null!=a&&void 0!=a&&reportException(6,"ID重复:"+a.toString(),"","","ID重复:"+a.toString())}(),function(){var a=Array.prototype.slice.call(document.querySelectorAll("a")),b=a.filter(function(a){return!/^[#|javascript:]/.test(a.getAttribute("href"))&&/^[http|https]/.test(a.href)&&""!==a.getAttribute("href")}),c=b.map(function(a){return a.href}),d=[];!function a(b,c){var d;-1==b.indexOf(d=b.shift())&&c.push(d),b.length&&a(b,c)}(c,d),reportException(4,"","","",d)}();