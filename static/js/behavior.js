/**
 * Created by csdc on 2016/11/15.
 */
/**
 * @file
 * @author tommyzqfeng
 * @date 2016/11/15
 */
'use strict';

;(function () {
  var UID,ot;
  var expDays = 30;
  var exp = new Date();
  var isRefresh;
  exp.setTime(exp.getTime() + (expDays*24*60*60*1000));

  init();

  /**
   * 主函数
   * @param a
   */
  function init() {
    setUp();//启动cookies

    reportData();
  }

  /**
   * 上报数据
   * @param str
   */
  function reportData(str) {
    var elem =  document.getElementById("feException");
    var serverHost = elem.src.split('/bookie.js/')[0];
    var appId = elem.src.split('/bookie.js/')[1];
    //通过Image对象请求发送数据
    var img = new Image(1, 1);

    //获取当前的网址
    var url = window.location.href;
    //获取pathname
    var pathname = window.location.pathname;
    // 获取上页地址
    var oldlink = document.referrer;
    // 获取当前访问页的标题
    var titleName = document.title;
    // 屏幕分辨率
    var screen = window.screen.width + "*" + window.screen.height;
    // 异步请求发送
    str= '&url=' + encodeURIComponent(url) +
      '&pathname=' + encodeURIComponent(pathname) +
      '&referer=' + encodeURIComponent(oldlink) +
      '&title=' + encodeURIComponent(titleName) +
      '&userAgent=' + navigator.userAgent.toLowerCase() +
      '&screen=' + screen +
      '&gu_id=' + GetCookie('GUID') +
      '&wwc=' + GetCookie('WWHCount') +
      '&timestamp=' + GetCookie('WWhenH') +
      '&appId=' + appId;

    img.src = serverHost + '/_ub.gif?type=0' + str;
  };

  /**
   * 设置cookie
   */
  function setUp(){
    SetCookie ('GUID', Who(), {expires:exp});
    SetCookie ('WWHCount', Count(), {expires:exp});
    When();
    window.onbeforeunload = function() {
      alert('onbeforeunload')
    }
  }

  /**
   * 标示相同用户
   * @returns {*}
   * @constructor
   */
  function Who(){
    var GUID = GetCookie('GUID');
    if (GUID == null) {
      GUID = function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        }).toUpperCase();
      };
      SetCookie ('GUID', GUID(), {expires:exp});
      return GUID();
    }
    return GUID;
  }

  /**
   * 访问次数统计
   * @returns {*}
   * @constructor
   */
  function Count(){
    var WWHCount = GetCookie('WWHCount')
    if (WWHCount == null) {
      WWHCount = 0;
    }
    else{
      if(!isRefresh)
        WWHCount++;
    }
    SetCookie ('WWHCount', WWHCount, {expires:exp});
    return WWHCount;
  }

  /**
   * 读取访问时间
   * @returns {string}
   * @constructor
   */
  function When(){
    var rightNow = new Date();
    var WWHTime = 0;
    WWHTime = GetCookie('WWhenH');
    WWHTime = WWHTime * 1
    var lastHereFormatting = new Date(WWHTime);
    // 访问时间记录
    var intLastVisit = (lastHereFormatting.getYear() * 10000)+(lastHereFormatting.getMonth() * 100) + lastHereFormatting.getDate();
    var lastHereInDateFormat = "" + lastHereFormatting;
    var dayOfWeek = lastHereInDateFormat.substring(0,3);
    var dateMonth = lastHereInDateFormat.substring(4,11);
    var timeOfDay = lastHereInDateFormat.substring(11,16);
    var year = lastHereInDateFormat.substring(23,25);
    var WWHText = dayOfWeek + ", " + dateMonth + " at " + timeOfDay;
    SetCookie ("WWhenH", rightNow.getTime(), {expires:exp});
    return WWHText;
  }

  /**
   * 取cookie的值
   * @param offset
   * @returns {string}
   */
  function getCookieVal (offset) {
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1)
      endstr = document.cookie.length;
    return encodeURIComponent(document.cookie.substring(offset, endstr));
  }

  /**
   * 读取cookie
   * @param name
   * @returns {*}
   * @constructor
   */
  function GetCookie (name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
      var j = i + alen;
      if(document.cookie.substring(i, j) == arg)
        return getCookieVal (j);
      i = document.cookie.indexOf(" ", i) + 1;
      if (i == 0) break;
    }
    return null;
  }

  /**
   * 设置Cookie内容
   * @param name
   * @param value
   * @param expires 可选 过期时间
   * @param path 可选 设置路径
   * @param domain 可选 设置域名
   * @param secure 可选 设置是否采用ssl安全连接（是：true；否：false）
   * @constructor
   */
  function SetCookie (name, value, option) {
    document.cookie = name + "=" + encodeURIComponent(value) +
      ((option.expires == null) ? "" : ("; expires=" + option.expires.toGMTString())) +
      ((option.path == null) ? "" : ("; path=" + option.path)) +
      ((option.domain == null) ? "" : ("; domain=" + option.domain)) +
      ((option.secure == true) ? "; secure" : "");
  }
}());
