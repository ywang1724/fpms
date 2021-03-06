/**
 * Uookie.js v0.0.1
 * Copyright (c) 2017 liujia
 */

/**
 * 添加jQuery支持
 */
require("./jquery");

/**
 *  添加artDialog.js 弹出层
 */
require("./dialog");

/**
 * 引入CSS
 */
(function () {
    var css = document.createElement("link");
    var elem = document.getElementById("feException");
    css.href = elem.src.replace('bookie.js', 'uookie.css');
    css.rel = "stylesheet";
    document.head.appendChild(css);
})(document);

/**
 * 自定义监控规则录入脚本
 */

(function (document) {

    /**
     * 格式化URL
     * @param url
     * @returns {{Obj}}
     */
    function parseURL(url) {
        var r = {
            protocol: /([^\/]+:)\/\/(.*)/i,
            host: /(^[^\:\/]+)((?:\/|:|$)?.*)/,
            port: /\:?([^\/]*)(\/?.*)/,
            pathname: /([^\?#]+)(\??[^#]*)(#?.*)/
        };
        var tmp, res = {};
        res["href"] = url;
        for (p in r) {
            tmp = r[p].exec(url);
            res[p] = tmp[1];
            url = tmp[2];
            if (url === "") {
                url = "/";
            }
            if (p === "pathname") {
                res["pathname"] = tmp[1];
                res["search"] = tmp[2];
                res["hash"] = tmp[3];
            }
        }
        return res;
    };

/**
 * 获取一个DOM元素的CSS选择路径
 */
function cssPath(el) {
    var fullPath = 0, // 设置为1表示获取完整路径，0表示获取优化后的路径
        useNthChild = 0, // 设置为1表示使用:nth-child() 伪类选择器
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

    // 遍历所有的父元素，并获取其唯一选择符
    while (el) {
        vagueMatch = 0;

        // 获取元素的标签名
        tagName = el.nodeName.toLowerCase();

        // 获取元素的Id，并加上#:
        cssId = (el.id) ? ('#' + el.id) : false;

        // 获取元素的class，并加上".":
        cssClass = (el.className) ? ('.' + el.className.trim().replace(/\s+/g, ".")) : '';

        // 构造唯一选择符:
        if (cssId) {
            // 用ID匹配
            tagSelector = tagName + cssId + cssClass;
        } else if (cssClass) {
            // 用class匹配:
            tagSelector = tagName + cssClass;
        } else {
            // 对于不能用Id 或class匹配的，用:nth-child()替代
            vagueMatch = 1;
            tagSelector = tagName;
        }

        // 将选择符添加到栈中
        parentSelectors.unshift(tagSelector)

        // 如果需要优化选择路径，则代码停止时向下执行:
        if (cssId && !fullPath)
            break;

        // 向上遍历:
        el = el.parentNode !== document ? el.parentNode : false;

    }


    // 根据栈中的选择符，构造完整CSS选择路径
    for (i = 0; i < parentSelectors.length; i++) {
        cssPathStr += ' ' + parentSelectors[i];

        // If using ":nth-child()" selectors and this selector has no ID / isn't the html or body tag:
        if (useNthChild && !parentSelectors[i].match(/#/) && !parentSelectors[i].match(/^(html|body)$/)) {

            // If there's no CSS class, or if the semi-complete CSS selector path matches multiple elements:
            if (!parentSelectors[i].match(/\./) || $(cssPathStr).length > 1) {

                // Count element's previous siblings for ":nth-child" pseudo-selector:
                for (nth = 1, c = el; c.previousElementSibling; c = c.previousElementSibling, nth++);

                // Append ":nth-child()" to CSS path:
                cssPathStr += ":nth-child(" + nth + ")";
            }
        }

    }

    // Return trimmed full CSS path:
    return cssPathStr.replace(/^[ \t]+|[ \t]+$/, '');
}

    /**
     * 创建导航栏
     */
    function createNavBar() {
        var fpmsScriptUrl = parseURL(document.getElementById("feException").src);
        var LogoUrl = fpmsScriptUrl.protocol + "//" +
            fpmsScriptUrl.host +
            (fpmsScriptUrl.port ? ":" + fpmsScriptUrl.port : "") +
            "/modules/core/img/brand/logo.png";
        var navBar =
            '<div class="fpms-nav">' +
            '<div class="fpms-logo"> <img src="' + LogoUrl + '" alt=""></div>' +
            '<div class="fpms-mode-switch">' +
            '<a href="javascript:void" class="fpms-mode fpms-mode-active" data-mode="diff">页面Diff规则</a>' +
            '<a href="javascript:void" class="fpms-mode" data-mode="dom">DOM检测规则</a>' +
            '</div>' +
            '<a href="javascript:void" class="fpms-exit" data-mode="dom">退出</a>' +
            '</div>';

        $(navBar).appendTo(document.body);
        $(".fpms-nav").on("click mouseover mouseout", function (e) {
            e.stopPropagation();
        })
        $(".fpms-mode").click(function () {
            $(".fpms-mode").removeClass("fpms-mode-active");
            $(this).addClass("fpms-mode-active");
        });
        $(".fpms-exit").click(function () {
            var elem =  document.getElementById("feException");
            var serverHost =elem.src.split('/bookie.js/')[0];
            //通过Image对象请求发送数据
            var img = new Image(1, 1);
            img.src = serverHost + '/_ui.gif/send?' + JSON.stringify({isOpenUI: false});
            img.onload = function(){
                window.location.reload();
            }
            img.onerror = function(err){
                alert("服务器发生异常，退出中...");
                window.location.reload();
            }
        });

    }


    /**
     * 鼠标悬浮响应事件处理程序
     */
    function inspectorMouseOver(e) {
        var element = e.target;
        element.style.outline = '2px solid #ed495f';
        // 设置上次选择的元素，用于取消操作
        last = element;
    }


    /**
     * 鼠标移除DOM元素处理事件处理程序
     */
    function inspectorMouseOut(e) {
        // 移除边框
        e.target.style.outline = '';
    }

    /**
     * 上报规则数据
     */
    window.__addRule__ = function (pageUrl, selector, type, callback){
        var elem =  document.getElementById("feException");
        var serverHost =elem.src.split('/bookie.js/')[0];

        var data = {}; // 发送的数据
        data.rule = selector,
        data.pageUrl = pageUrl,
        data.type = type
        data.appId = elem.src.split("/").reverse()[0];

        console.log('add rules:', pageUrl, selector, type);

        //通过Image对象请求发送数据
        var img = new Image(1, 1);
        img.src = serverHost + '/_ui.gif/addRule?' + encodeURIComponent(JSON.stringify(data));
        img.onload = function(){
            callback(null);
        }
        img.onerror = function(err){
            callback(err);
        }

    };


    /**
     * 点击选取DOM元素
     */
    function inspectorOnClick(e) {
        e.preventDefault(); // 阻止默认行为
        e.target.style.outline = '';
        var selector = cssPath(e.target), // 获取CSS 选择路径
            newSelector; // 用户编辑过的CSS 选择路径
        $(selector).each(function () {
            masks.push($("<div>").addClass("outline-shadow").css({
                "top": $(this).offset().top,
                "left": $(this).offset().left,
                "width": $(this).width(),
                "height": $(this).height()
            }).appendTo($("body")));
        });

        // 解绑事件处理程序
        $(document).off("mouseover", inspectorMouseOver);
        $(document).off("mouseout", inspectorMouseOut);
        $(document).off("click", inspectorOnClick);

        var title, // 弹出层的标题
            template; // 弹出层内容

        window.__cssSelectRule__ = selector; // 将规则暂存，方便上报。

        if($(".fpms-mode-active").data('mode') == 'diff') { // 页面差异性对比规则
            title = "排除不需进行差异性监测的区域";

            var moreOptionsList = '';

            for(var i =0 ; i < e.target.attributes.length; i ++) { // 添加DOM元素额外的CSS选择项
                if(e.target.attributes[i].name !== 'id' && e.target.attributes[i].name !== 'class' &&  e.target.attributes[i].value) {
                    moreOptionsList += 
                     '<div class="option">' +
                        '<span class="more-option-label">' + e.target.attributes[i].name + '</span>'+
                        '<input type="checkbox" name="moreOption" value="' + e.target.attributes[i].value + '" key="' + e.target.attributes[i].name + '">' +
                        '<code>' + e.target.attributes[i].value + '</code>' +
                    '</div>';
                }
            }

            if(['IMG'].indexOf(e.target.nodeName.toUpperCase()) == -1 && e.target.innerText) { // 如果是文本节点，则添加进额外的CSS选择项
                moreOptionsList += 
                '<div class="option">' +
                    '<span class="more-option-label">Text</span>'+
                    '<input type="checkbox" name="moreOption" value="' + e.target.innerText + '" key="text">' +
                    '<code>' + (e.target.innerText.length > 30 ?  e.target.innerText.substring(0,30) + '...' : e.target.innerText)+ '</code>' +
                '</div>';
            }

            template = // 弹出层显示内容
                '<div class="popup-section popup-rules-name">' +
                    '<span class="popup-label">CSS选择器</span>' +
                    '<code id="cssSelector">' + selector + '</code>' +
                '</div>' +
                '<div class="section">' + 
                    '<div class="popup-more"> 更多选项+ </div>' +
                    '<div class="popup-more-option" style="display:none">' +
                        moreOptionsList + 
                    '</div>' +
                '</div>' + 
                '<div class="btn-bar"><button class="btn btn-primary btn-block add-diff-rule">添加</button></div>';

            
        } else { // 添加DOM检测规则
            title = "添加DOM检测规则";

            var htmlAttrs = '', cssAttrs = '', computedCSS;

            for(var i =0 ; i < e.target.attributes.length; i ++) { // 添加DOM元素额外的CSS选择项
                if(e.target.attributes[i].name !== 'id' && e.target.attributes[i].name !== 'class' && e.target.attributes[i].value) {
                    htmlAttrs += 
                    '<div class="option">' +
                            '<input type="checkbox" name="moreOption" value="' + e.target.attributes[i].value + '" key="' + e.target.attributes[i].name + '">' +
                            '<span class="more-option-label"> ' + e.target.attributes[i].name  + '</span> ' + 
                            '<span class="equal"></span> <code>'+ e.target.attributes[i].value + '</code>' +
                    '</div>';
                }
            }

            if(['IMG'].indexOf(e.target.nodeName.toUpperCase()) == -1 && e.target.innerText) { // 如果是文本节点，则添加进额外的CSS选择项
                htmlAttrs += 
                '<div class="option">' +
                    '<input type="checkbox" name="moreOption" value="' +  e.target.innerText + '" key="text">' +
                    '<span class="more-option-label">Text</span> ' + 
                    '<span class="equal"></span> <code>'+ (e.target.innerText.length > 30 ?  e.target.innerText.substring(0,30) + '...' : e.target.innerText)+ '</code>' +
                '</div>';
            }

            computedCSS = window.getComputedStyle(e.target);
            for(var i =0 ; i < computedCSS.length; i ++) { // 添加DOM元素额外的CSS选择项
                cssAttrs += '<option value="' + computedCSS[computedCSS[i]]+  '">' +computedCSS[i]+ '</option>';
            }

            template = 
                '<div class="popup-section popup-rules-name">' +
                    '<span class="popup-label">DOM元素选择器</span>' +
                    '<code id="cssSelector">' + selector + '</code>' +
                '</div>' +
                '<div class="section">' + 
                    '<div class="popup-more"> 辅助选择- </div>' +
                    '<div class="popup-more-option">' +
                        htmlAttrs + 
                    '</div>' +
                '</div>' + 
                '<div class="section css-section">' + 
                    '<div class="popup-more"> CSS属性检查+ </div>' +
                    '<div class="popup-more-option" style="display:none">' +
                        '<p class="css-warning">由于监测时屏幕分辨率与当前不同，某些属性(比如width)容易造成误报，请请慎重填写。</p>' + 
                        '<div style="margin-bottom:10px"><select class="select-css-rule"> ' + cssAttrs + '</select> <button class="btn btn-primary btn-sm add-css-rule" style="float:right">添加</button></div>' + 
                    '</div>' +
                '</div>' + 
                '<div class="divider"></div>' +
                '<div class="section">' + 
                    '<div class="popup-more"> 自定义检测表达式+ </div>' +
                    '<div class="popup-more-option" style="display:none">' +
                        '<input type="checkbox" name="isCustomRuleActived" style="margin-right:10px">' + 
                        '<input name="customCSSRule" class="form-control"  style="margin-right:20px;width:220px">' + 
                        '<span class="equal" style="margin-right:20px"></span> <code></code>' + 
                    '</div>' +
                '</div>' + 
                '<div class="btn-bar"><button class="btn btn-primary btn-block add-dom-rule">添加</button></div>';
        }
        window.__selectDialog__ = dialog({
            title: title, // 设置弹出层标题
            content: template, // 设置弹出层内容
            width: 400, // 弹出层宽度
            onshow: function () { // 弹出层显示之前的回调函数
                $(".ui-popup").on("mouseout mouseover", function (e) { //阻止鼠标移动事件在弹出层上传播
                    e.stopPropagation();
                    return false;
                })

                $('.ui-dialog-content .option input[name="moreOption"]').change(function(){ // 展开更多选项
                    var newSelector = selector.trim();
                    $('.ui-dialog-content .option input[name="moreOption"]:checked').each(function(index, elem){
                        if($(this).attr("key")!= "text") {
                            newSelector += '[' + $(this).attr("key") + '="' + $(this).val() + '"]'; // 根据用户的选择组装新的CSS选择路径
                        } else {
                            newSelector += ':contains(\'' + $(this).val() + '\')';
                        }
                        
                    });
                    while (masks.length) {
                        masks.pop().remove(); // 移除old selector选中的元素
                    }
                     $(newSelector).each(function () { // 为new selector设置选中，添加边框
                        masks.push($("<div>").addClass("outline-shadow").css({
                            "top": $(this).offset().top,
                            "left": $(this).offset().left,
                            "width": $(this).width(),
                            "height": $(this).height()
                        }).appendTo($("body")));
                    });
                   window.__cssSelectRule__ = newSelector;
                   $("#cssSelector").text(newSelector); // 显示新的选选择器
                });
            },
            onclose: function () {// 弹出层关闭回掉函数
                while (masks.length) {
                    masks.pop().remove();// 移除selector选中的元素
                }
                window.__cssSelectRule__ = null; // 清空暂存的数据
                init(); // 重新初始化
            },
            onremove: function () {
                $(".ui-popup").off("mouseout mouseover")
            }
        }).showModal();

        return false;
    }

    /**
     * 取消元素选择函数
     */
    function inspectorCancel(e) {
        // 用户按esc键，退出
        if (e.which === 27) {
            $(document).off("mouseover", inspectorMouseOver);
            $(document).off("mouseout", inspectorMouseOut);
            $(document).off("click", inspectorOnClick);
            $(document).off("keydown", inspectorCancel);
            // 移除最新选择元素的边框
            last.style.outline = 'none';
        }
    }

    function init() {// 绑定事件处理程序
        $(document).on("mouseover", inspectorMouseOver);
        $(document).on("mouseout", inspectorMouseOut);
        $(document).on("click", inspectorOnClick);
        $(document).on("keydown", inspectorCancel);
    }


    var last, // 上一次选中的元素
        masks = []; // 选择器选中的所有元素

    createNavBar(); // 创建导航栏

    // 弹出层相关事件绑定
    $(document).on("click", ".popup-more", function () {
        $(this).parent().find(".popup-more-option").toggle();
        var self = this;
        $(this).html(function () {
            if ($(self).html().trim().indexOf("+") != -1) return $(self).html().trim().replace("+", "-");
            else return $(self).html().trim().replace("-", "+");
        })
    })

    // 添加页面差异性对比规则
    $(document).on("click", ".add-diff-rule", function () {
        var pageUrl = window.location.href; // 获取当前页面的url
        window.__addRule__(pageUrl, window.__cssSelectRule__, 'diff', function(err){ // 上报规则
            if(err){ // 上报出错
                alert("添加失败，目标服务器无响应。");
            } else {
                alert("添加成功。");
            }
            window.__selectDialog__.close().remove(); // 关闭对话框。
            window.__selectDialog__ = null;
        });
    })

    // 添加DOM 检测规则
    $(document).on("click", ".add-dom-rule", function () {
       var pageUrl = window.location.href;// 获取当前页面的url
       var rules = []; // 规则集合
       $(".ui-dialog-content input[name='cssAttr']").each(function(index, elem){ // 获取css规则
            rules.push({
                selector: "window.getComputedStyle($('" + window.__cssSelectRule__ + "')[0])['" + $(elem).attr("key") + "']",
                expect: $(elem).val()
            })
       });
       if($(".ui-dialog-content input[name='isCustomRuleActived']")[0].checked) { // 获取自定义规则
            var result;
            try {
                result = eval($(".ui-dialog-content input[name='customCSSRule']").val());
            } catch(e) {
               alert("自定义表达式出错了，请更正。");
               return;
            }
            if(typeof result =='string' || typeof result == 'number' || typeof result == 'boolean') { // 判断自定义表达式是否合法
                rules.push({
                    selector: $(".ui-dialog-content input[name='customCSSRule']").val(),
                    expect: result
                });
            } else {
                 alert("自定义表达式的结果只能为基本数据类型(number, boolean, string)，暂不支持复合数据类型，请调整。");
                 return;
            }
       }

       window.__addRule__(pageUrl, rules, 'dom', function(err){ // 上报规则
            if(err){ // 上报出错
                alert("添加失败，目标服务器无响应。");
            } else {
                alert("添加成功。");
            }
            window.__selectDialog__.close().remove(); // 关闭对话框。
            window.__selectDialog__ = null;
        });
    });

    // 添加CSS 规则
    $(document).on("click", ".add-css-rule", function () {
        if(!$('input[name="cssAttr"][key="' + $(".select-css-rule option:selected").text().trim() + '"]').length) { // 防止重复
            var option = 
            '<div class="option">' +
                '<input type="hidden" name="cssAttr" value="'+ $(".select-css-rule").val() + '" key="'+ $(".select-css-rule option:selected").text() + '">' + 
                '<span class="more-option-label">' + $(".select-css-rule option:selected").text() + '</span>' + 
                '<span class="equal"></span><code>' + $(".select-css-rule").val() + '</code> <button class="btn btn-danger btn-sm remove-css-rule" style="float:right">移除</button>' +
            '</div>';
            $(option).appendTo($(this).parent()); // 将CSS规则选项添加到select中
        }
        
    });

    //移除css规则
    $(document).on("click", ".remove-css-rule", function () {
       $(this).parent().remove();
    });

    //  立即反馈编写的自定表达式
    $(document).on("input propertychange", "input[name='customCSSRule']", function () {
        var result;
        try {
            result = eval(this.value);
        } catch(e) {
            $(this).parent().find("code").text(e.toString());
        }
        $(this).parent().find("code").text(result);
    });


    init(); // 初始化事件绑定

})(document);
