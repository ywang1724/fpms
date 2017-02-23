/**
 * @file
 * @author tommyzqfeng
 * @date 2016/12/26
 */
'use strict';

(function (document) {
  var css = document.createElement("link");
  var elem = document.getElementById("feException");
  css.href = elem.src.replace(/bookie\.js\/.*/, 'css/behavior.custom.css');
  css.rel = "stylesheet";
  document.head.appendChild(css);
})(document);

(function(document) {
  var mode = 1; // 模式： 1:绑定；2:正常
  var last;

  insertDOMHTML();
  inspectorInit();

  var tooltip = document.getElementById('ubas-menu');
  var toggleMode = document.getElementById('ubas-menu-toggleMode');
  if (document.addEventListener) {
    tooltip.addEventListener("mouseover", inspectorCancel, true);
    tooltip.addEventListener("mouseout", inspectorInit, true);
    toggleMode.addEventListener("change", toggleModeFunc, true);
    document.getElementById('ubas-tooltip-close').addEventListener('click', removeOnClink, true);
    document.getElementById('ubas-tooltip-submit').addEventListener('click', submitListenerInfo, true);
    document.getElementById('ubas-exit-custom').addEventListener('click', exitCustom, true);
  }else if ( document.attachEvent ) {
    tooltip.attachEvent("onmouseover", inspectorCancel);
    tooltip.attachEvent("onmouseout", inspectorInit);
    toggleMode.attachEvent("onchange", toggleModeFunc);
    document.getElementById('ubas-tooltip-close').attachEvent('onclick', removeOnClink);
    document.getElementById('ubas-tooltip-submit').attachEvent('onclick', submitListenerInfo);
    document.getElementById('ubas-exit-custom').attachEvent('onclick', exitCustom);
  }


  /**
   * 返回元素css路径
   *
   * Returns a jQuery-style CSS path, with IDs, classes and ':nth-child' pseudo-selectors.
   *
   * Can either build a full CSS path, from 'html' all the way to ':nth-child()', or a
   * more optimised short path, stopping at the first parent with a specific ID,
   * eg. "#content .top p" instead of "html body #main #content .top p:nth-child(3)"
   */
  function cssPath(el) {
    var fullPath    = 0,  // Set to 1 to build ultra-specific full CSS-path, or 0 for optimised selector
      useNthChild = 0,  // Set to 1 to use ":nth-child()" pseudo-selectors to match the given element
      cssPathStr = '',
      testPath = '',
      parents = [],
      parentSelectors = [],
      tagName,
      cssId,
      cssClass,
      tagSelector,
      vagueMatch,
      nth,
      i,
      c;

    // Go up the list of parent nodes and build unique identifier for each:
    while ( el ) {
      vagueMatch = 0;

      // Get the node's HTML tag name in lowercase:
      tagName = el.nodeName.toLowerCase();

      // Get node's ID attribute, adding a '#':
      cssId = ( el.id ) ? ( '#' + el.id ) : false;

      // Get node's CSS classes, replacing spaces with '.':
      cssClass = ( el.className ) ? ( '.' + el.className.replace(/\s+/g,".") ) : '';

      // Build a unique identifier for this parent node:
      if ( cssId ) {
        // Matched by ID:
        tagSelector = tagName + cssId + cssClass;
      } else if ( cssClass ) {
        // Matched by class (will be checked for multiples afterwards):
        tagSelector = tagName + cssClass;
      } else {
        // Couldn't match by ID or class, so use ":nth-child()" instead:
        vagueMatch = 1;
        tagSelector = tagName;
      }

      // Add this full tag selector to the parentSelectors array:
      parentSelectors.unshift( tagSelector )

      // If doing short/optimised CSS paths and this element has an ID, stop here:
      if ( cssId && !fullPath )
        break;

      // Go up to the next parent node:
      el = el.parentNode !== document ? el.parentNode : false;

    } // endwhile


    // Build the CSS path string from the parent tag selectors:
    for ( i = 0; i < parentSelectors.length; i++ ) {
      cssPathStr += ' ' + parentSelectors[i];// + ' ' + cssPathStr;

      // If using ":nth-child()" selectors and this selector has no ID / isn't the html or body tag:
      if ( useNthChild && !parentSelectors[i].match(/#/) && !parentSelectors[i].match(/^(html|body)$/) ) {

        // If there's no CSS class, or if the semi-complete CSS selector path matches multiple elements:
        if ( !parentSelectors[i].match(/\./) || $( cssPathStr ).length > 1 ) {

          // Count element's previous siblings for ":nth-child" pseudo-selector:
          for ( nth = 1, c = el; c.previousElementSibling; c = c.previousElementSibling, nth++ );

          // Append ":nth-child()" to CSS path:
          cssPathStr += ":nth-child(" + nth + ")";
        }
      }

    }

    // Return trimmed full CSS path:
    return cssPathStr.replace(/^[ \t]+|[ \t]+$/, '');
  }

  /**
   * 获取元素的text信息
   * @param e
   * @returns {string}
   */
  function nodeText(e) {
    return (e.innerText.length>25)?e.innerText.substr(0,25)+'...':e.innerText;
  }

  /**
   * Mouseover事件效果
   */
  function inspectorMouseOver(e) {
    var element = e.target?e.target:e.srcElement;

    // Set outline:
    element.style.outline = '2px solid #E80C68';

    // Set last selected element so it can be 'deselected' on cancel.
    last = element;
  }

  /**
   * Mouseout事件效果
   */
  function inspectorMouseOut(e) {
    var element = e.target?e.target:e.srcElement;
    element.style.outline = '';

  }

  /**
   * 当按下按键时，hover效果消失
   * @param e
   */
  function inspectorKeydown(e) {
    if (e === null && event.keyCode === 27 || e.which === 27) { //IE
      inspectorCancel();
      last.style.outlineStyle = 'none';
    }
  }

  /**
   * 打开tooltip弹层
   */
  function inspectorOnClick(e) {
    var element = e.target?e.target:e.srcElement;
    var xPoint = parseInt(e.pageX);
    var yPoint = parseInt(e.pageY);

    (e.preventDefault) ? e.preventDefault() : e.returnValue = false;

    //element.style.outline = '2px solid #E80C68';
    inspectorCancel();

    var tooltip = document.getElementById('ubas-tooltip');
    var modal = document.getElementById('ubas-modal');
    tooltip.style.display = 'inline';
    modal.style.display = 'block';
    modal.style.width = document.body.scrollWidth  + 'px';
    modal.style.height = document.body.scrollHeight + 'px';


    var ttHeight = tooltip.offsetHeight;
    var ttWidth = tooltip.offsetWidth;


    if (xPoint+ttWidth < document.body.offsetWidth) {
      tooltip.style.left =(xPoint) + 'px';
    } else {
      tooltip.style.left =(xPoint-ttWidth) + 'px';
    }

    if (yPoint+ttHeight < document.body.offsetHeight) {
      tooltip.style.top = (yPoint + 20) + 'px';
    } else {
      tooltip.style.top = (yPoint-ttHeight-20) + 'px';
    }

    document.getElementById('ubas-content-cssPath').innerHTML= cssPath(element);
    document.getElementById('ubas-content-text').innerHTML = nodeText(element);
    console.log(cssPath(element));
    console.log(nodeText(element));

    if(e && e.preventDefault) {
      //阻止默认浏览器动作(W3C)
      e.stopPropagation();
    } else {
      //IE中阻止函数器默认动作的方式
      window.event.returnValue = false;
    }
    //removeElmentEvent(e);
    return false;
  }

  /**
   * 取消tooltip弹层
   */
  function removeOnClink() {
    var tooltip = document.getElementById('ubas-tooltip');
    var modal = document.getElementById('ubas-modal');
    tooltip.style.display = 'none';
    modal.style.display = 'none';
    last.style.outlineStyle = 'none';
    inspectorInit();
  }

  /**
   * 页面初始化，绑定监控事件
   */
  function inspectorInit() {
    if ( document.addEventListener && mode == 1) {
      document.addEventListener("mouseover", inspectorMouseOver, true);
      document.addEventListener("mouseout", inspectorMouseOut, true);
      document.addEventListener("click", inspectorOnClick, true);
      document.addEventListener("keydown", inspectorKeydown, true);
    } else if ( document.attachEvent && mode == 1 ) {
      document.attachEvent("onmouseover", inspectorMouseOver);
      document.attachEvent("onmouseout", inspectorMouseOut);
      document.attachEvent("onclick", inspectorOnClick);
      document.attachEvent("onkeydown", inspectorKeydown);
    }
  }

  /**
   *  解绑页面初始化监控事件:
   */
  function inspectorCancel() {
    if (document.removeEventListener) {
      document.removeEventListener("mouseover", inspectorMouseOver, true);
      document.removeEventListener("mouseout", inspectorMouseOut, true);
      document.removeEventListener("click", inspectorOnClick, true);
      document.removeEventListener("keydown", inspectorKeydown, true);
    } else if (document.detachEvent) {
      document.detachEvent("onmouseover", inspectorMouseOver);
      document.detachEvent("onmouseout", inspectorMouseOut);
      document.detachEvent("onclick", inspectorOnClick);
      document.detachEvent("onkeydown", inspectorKeydown);
    }
    last.style.outlineStyle = 'none';
  }

  /**
   * 切换页面模式，默认为绑定模式
   * 1:绑定模式；2:正常模式；
   * @param e Event事件对象
   */
  function toggleModeFunc(e) {
    if (e.target.value == 1) {
      mode = 1;
    } else {
      mode = 2;
    };
    inspectorCancel();
  }

  /**
   * 移除页面元素绑定的自身事件
   * @param e Event事件对象
   */
  function removeElmentEvent(e) {
    var element = e.target?e.target:e.srcElement;
    var clone = element.cloneNode();
    while (element.firstChild) {
      clone.appendChild(element.lastChild);
    }
    element.parentNode.replaceChild(clone, element);
    clone.style.outline = '2px solid #E80C68';
    last = clone;
  }

  /**
   * 插入Dom节点，绑定定制事件
   */
  function insertDOMHTML() {
    var body = document.body;
    var divMenu = document.createElement('div'); //导航菜单
    var divNode = document.createElement('div'); //事件绑定弹层
    var divModal = document.createElement('div'); //遮罩层

    divMenu.id = 'ubas-menu';
    divNode.id = 'ubas-tooltip';
    divModal.id = 'ubas-modal';
    divMenu.style.cssText = 'display:block;';
    divNode.style.cssText = 'display: none;';
    divModal.style.cssText = 'display: none;';

    divMenu.innerHTML = '<span class="ubas-menu-toggleMode">' +
      '<span class="ubas-menu-logo ubas-menu-toggleMode-span">UBAS</span>' +
      '<span class="ubas-menu-toggleMode-span"> 模式选择：' +
      '<select id="ubas-menu-toggleMode" class="ubas-menu-toggleMode-select"  name="" id="">' +
      '<option value="1">绑定模式</option>' +
      '<option value="2">正常模式</option>' +
      '</select>' +
      '</span>' +
      '</span>' +
      '<span class="ubas-menu-buttons">' +
      '<span id="ubas-exit-custom" class="ubas-buttons-span">退出</span>' +
      '</span>';
    divNode.innerHTML = '<div class="ubas-tooltip-header">' +
      '<span class="tooltip-span tooltip-span-left">UBAS</span> ' +
      '<span id="ubas-tooltip-close" class="tooltip-span tooltip-span-right"><img width="10px" height="10px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQffAQYWGA89uCg8AAABGUlEQVQoz2XQu0pjcRTF4c9zLNRuSguNF4QZYw4GjLdO0HmEqaY0AxKxEK18A1u7eHsAiVZaiDdQDI6l7eBYzagg5BEszt9jorva+7cWm712289Z6745t+SP9xq1oeS35TipKWo35KsrjSCPqJrWLicXyQf4XVVfkLdNBJpELrK1c6py8raNZ+wkTm4MGwjjoJIfxjK5ZiVOXlwp6A+oV3cm71v0P8K9sjMfa1/FIxG4N6/eIh9Z8MibgS4dLYZOnWmTGgp2FVsMM7bSu+KEETtKn24YkHepESdFm025j/wL70ot9TipmWzK/cuhQtNfeqKm5TUVzx6UnWZsKnIb2j0VT+CvspNAr+PkTk6XA6tpbtBQ1+OLY2uvBr88oJoHMKIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDktMTdUMTU6MjE6MjkrMDg6MDCJE0F/AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTAxLTA2VDIyOjI0OjE1KzA4OjAwT02WhAAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAAyNTLuroAAAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADI1Mn1f0F0AAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQyMDU1NDI1NXcKDagAAAASdEVYdFRodW1iOjpTaXplADUuMDJLQkctzZ8AAABfdEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvc2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzExODM0LzExODM0NjgucG5nnoiZ3wAAAABJRU5ErkJggg==" alt=""></span> ' +
      '</div>' +
      '<div class="ubas-tooltip-body">' +
      '<div class="body-top">' +
      '路径：<span id="ubas-content-cssPath" class="color-grey"></span><br>' +
      '文本：<span id="ubas-content-text" class="color-grey"></span>' +
      '</div>' +
      '<div class="body-center">' +
      '<div class="body-center-input">' +
      '<label>名称</label>' +
      '<input id="ubas-tooltip-listenerName" type="text" placeholder="输入自定义事件名称">' +
      '</div>' +
      '<div class="body-center-checkbox">' +
      '<input id="ubas-tooltip-limitPage" type="checkbox" checked>限制当前页面' +
      '</div>' +
      '</div>' +
      '<div class="body-bottom"></div>' +
      '</div>' +
      '<div class="ubas-tooltip-footer">' +
      '<button id="ubas-tooltip-submit" type="button">确定</button>' +
      '</div>';

    body.appendChild(divMenu);
    body.appendChild(divNode);
    body.appendChild(divModal);
  }

  /**
   * 向服务端发送数据
   */
  function submitListenerInfo() {
    var name = document.getElementById('ubas-tooltip-listenerName').value;
    var limitPage = document.getElementById('ubas-tooltip-limitPage');
    var url = window.location.href;
    var cssPath = document.getElementById('ubas-content-cssPath').innerHTML;
    var text = document.getElementById('ubas-content-text').innerHTML;
    var str = '&name=' + encodeURIComponent(name) + '&url='+ encodeURIComponent(url) + '&cssPath=' + encodeURIComponent(cssPath)+'&text='+encodeURIComponent(text);

    var elem =  document.getElementById("feException");
    var serverHost =elem.src.split('/bookie.js/')[0];

    //通过Image对象请求发送数据
    var img = new Image(1, 1);
    img.src = serverHost + '/_ub.gif?type=2' + str;
    removeOnClink();
  }

  function exitCustom() {
    window.location.href= document.getElementById("feException").src.replace('bookie.js','#!/apps/behavior');
  }

})(document);


