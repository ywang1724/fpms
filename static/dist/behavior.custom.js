"use strict";!function(a){var b=a.createElement("link"),c=a.getElementById("feException");b.href=c.src.replace(/bookie\.js\/.*/,"css/behavior.custom.css"),b.rel="stylesheet",a.head.appendChild(b)}(document),function(a){function b(b){for(var c,d,e,f,g,h,i,j,k=0,l=0,m="",n=[];b&&(g=0,c=b.nodeName.toLowerCase(),d=!!b.id&&"#"+b.id,e=b.className?"."+b.className.replace(/\s+/g,"."):"",d?f=c+d+e:e?f=c+e:(g=1,f=c),n.unshift(f),!d||k);)b=b.parentNode!==a&&b.parentNode;for(i=0;i<n.length;i++)if(m+=" "+n[i],l&&!n[i].match(/#/)&&!n[i].match(/^(html|body)$/)&&(!n[i].match(/\./)||$(m).length>1)){for(h=1,j=b;j.previousElementSibling;j=j.previousElementSibling,h++);m+=":nth-child("+h+")"}return m.replace(/^[ \t]+|[ \t]+$/,"")}function c(a){return a.innerText.length>25?a.innerText.substr(0,25)+"...":a.innerText}function d(a){var b=a.target?a.target:a.srcElement;b.style.outline="2px solid #E80C68",o=b}function e(a){var b=a.target?a.target:a.srcElement;b.style.outline=""}function f(a){(null===a&&27===event.keyCode||27===a.which)&&(j(),o.style.outlineStyle="none")}function g(d){var e=d.target?d.target:d.srcElement,f=parseInt(d.pageX),g=parseInt(d.pageY);d.preventDefault?d.preventDefault():d.returnValue=!1,j();var h=a.getElementById("ubas-tooltip"),i=a.getElementById("ubas-modal");h.style.display="inline",i.style.display="block",i.style.width=a.body.scrollWidth+"px",i.style.height=a.body.scrollHeight+"px";var k=h.offsetHeight,l=h.offsetWidth;return f+l<a.body.offsetWidth?h.style.left=f+"px":h.style.left=f-l+"px",g+k<a.body.offsetHeight?h.style.top=g+20+"px":h.style.top=g-k-20+"px",a.getElementById("ubas-content-cssPath").innerHTML=b(e),a.getElementById("ubas-content-text").innerHTML=c(e),console.log(b(e)),console.log(c(e)),d&&d.preventDefault?d.stopPropagation():window.event.returnValue=!1,!1}function h(){var b=a.getElementById("ubas-tooltip"),c=a.getElementById("ubas-modal");b.style.display="none",c.style.display="none",o.style.outlineStyle="none",i()}function i(){a.addEventListener&&1==p?(a.addEventListener("mouseover",d,!0),a.addEventListener("mouseout",e,!0),a.addEventListener("click",g,!0),a.addEventListener("keydown",f,!0)):a.attachEvent&&1==p&&(a.attachEvent("onmouseover",d),a.attachEvent("onmouseout",e),a.attachEvent("onclick",g),a.attachEvent("onkeydown",f))}function j(){a.removeEventListener?(a.removeEventListener("mouseover",d,!0),a.removeEventListener("mouseout",e,!0),a.removeEventListener("click",g,!0),a.removeEventListener("keydown",f,!0)):a.detachEvent&&(a.detachEvent("onmouseover",d),a.detachEvent("onmouseout",e),a.detachEvent("onclick",g),a.detachEvent("onkeydown",f)),o.style.outlineStyle="none"}function k(a){p=1==a.target.value?1:2,j()}function l(){var b=a.body,c=a.createElement("div"),d=a.createElement("div"),e=a.createElement("div");c.id="ubas-menu",d.id="ubas-tooltip",e.id="ubas-modal",c.style.cssText="display:block;",d.style.cssText="display: none;",e.style.cssText="display: none;",c.innerHTML='<span class="ubas-menu-toggleMode"><span class="ubas-menu-logo ubas-menu-toggleMode-span">UBAS</span><span class="ubas-menu-toggleMode-span"> 模式选择：<select id="ubas-menu-toggleMode" class="ubas-menu-toggleMode-select"  name="" id=""><option value="1">绑定模式</option><option value="2">正常模式</option></select></span></span><span class="ubas-menu-buttons"><span id="ubas-exit-custom" class="ubas-buttons-span">退出</span></span>',d.innerHTML='<div class="ubas-tooltip-header"><span class="tooltip-span tooltip-span-left">UBAS</span> <span id="ubas-tooltip-close" class="tooltip-span tooltip-span-right"><img width="10px" height="10px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQffAQYWGA89uCg8AAABGUlEQVQoz2XQu0pjcRTF4c9zLNRuSguNF4QZYw4GjLdO0HmEqaY0AxKxEK18A1u7eHsAiVZaiDdQDI6l7eBYzagg5BEszt9jorva+7cWm712289Z6745t+SP9xq1oeS35TipKWo35KsrjSCPqJrWLicXyQf4XVVfkLdNBJpELrK1c6py8raNZ+wkTm4MGwjjoJIfxjK5ZiVOXlwp6A+oV3cm71v0P8K9sjMfa1/FIxG4N6/eIh9Z8MibgS4dLYZOnWmTGgp2FVsMM7bSu+KEETtKn24YkHepESdFm025j/wL70ot9TipmWzK/cuhQtNfeqKm5TUVzx6UnWZsKnIb2j0VT+CvspNAr+PkTk6XA6tpbtBQ1+OLY2uvBr88oJoHMKIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDktMTdUMTU6MjE6MjkrMDg6MDCJE0F/AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTAxLTA2VDIyOjI0OjE1KzA4OjAwT02WhAAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAAyNTLuroAAAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADI1Mn1f0F0AAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQyMDU1NDI1NXcKDagAAAASdEVYdFRodW1iOjpTaXplADUuMDJLQkctzZ8AAABfdEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvc2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzExODM0LzExODM0NjgucG5nnoiZ3wAAAABJRU5ErkJggg==" alt=""></span> </div><div class="ubas-tooltip-body"><div class="body-top">路径：<span id="ubas-content-cssPath" class="color-grey"></span><br>文本：<span id="ubas-content-text" class="color-grey"></span></div><div class="body-center"><div class="body-center-input"><label>名称</label><input id="ubas-tooltip-listenerName" type="text" placeholder="输入自定义事件名称"></div><div class="body-center-checkbox"><input id="ubas-tooltip-limitPage" type="checkbox" checked>限制当前页面</div></div><div class="body-bottom"></div></div><div class="ubas-tooltip-footer"><button id="ubas-tooltip-submit" type="button">确定</button></div>',b.appendChild(c),b.appendChild(d),b.appendChild(e)}function m(){var b=a.getElementById("ubas-tooltip-listenerName").value,c=(a.getElementById("ubas-tooltip-limitPage"),window.location.href),d=a.getElementById("ubas-content-cssPath").innerHTML,e=a.getElementById("ubas-content-text").innerHTML,f="&name="+encodeURIComponent(b)+"&url="+encodeURIComponent(c)+"&cssPath="+encodeURIComponent(d)+"&text="+encodeURIComponent(e),g=a.getElementById("feException"),i=g.src.split("/bookie.js/")[0],j=new Image(1,1);j.src=i+"/_ub.gif?type=2"+f,h()}function n(){var b=a.getElementById("feException"),c=b.src.split("/bookie.js/")[0],d=new Image(1,1);d.src=c+"/_ub.gif/send?"+JSON.stringify({isOpenBehavior:!1}),d.onload=function(){window.location.reload()},d.onerror=function(a){alert("服务器发生异常，退出中..."),window.location.reload()}}var o,p=1;l(),i();var q=a.getElementById("ubas-menu"),r=a.getElementById("ubas-menu-toggleMode");a.addEventListener?(q.addEventListener("mouseover",j,!0),q.addEventListener("mouseout",i,!0),r.addEventListener("change",k,!0),a.getElementById("ubas-tooltip-close").addEventListener("click",h,!0),a.getElementById("ubas-tooltip-submit").addEventListener("click",m,!0),a.getElementById("ubas-exit-custom").addEventListener("click",n,!0)):a.attachEvent&&(q.attachEvent("onmouseover",j),q.attachEvent("onmouseout",i),r.attachEvent("onchange",k),a.getElementById("ubas-tooltip-close").attachEvent("onclick",h),a.getElementById("ubas-tooltip-submit").attachEvent("onclick",m),a.getElementById("ubas-exit-custom").attachEvent("onclick",n))}(document);