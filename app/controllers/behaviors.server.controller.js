/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/6
 */
'use strict';

var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Behavior = mongoose.model('Behavior');
var App = mongoose.model('App');
var rqt = require('request');

/**
 * Create a behavior
 */
exports.create = function (req, res) {
  if(req.session.appId) {
    App.findById(req.session.appId).exec(function (err, app) {
      if(err) {
        console.log(errorHandler.getErrorMessage(err));
      } else {
        var behaviorData = req.query;
        if (~parseInt(behaviorData.url.indexOf(app.host))) {
          var behavior = new Behavior(behaviorData);
          var regex = /^\:\:ffff\:/;

          var keyword = getKeyword(behaviorData.referer);
          var system = getSysInfo(behaviorData.userAgent);
          var browser = getBrowserType(behaviorData.userAgent);
          var ip='', address = {};

          if (req.headers['x-real-ip']) {
            ip = req.headers['x-real-ip'];
          } else {
            if(regex.test(req.connection.remoteAddress.trim())) {
              ip = req.connection.remoteAddress.split('::ffff:')[1];
            } else {
              ip = req.connection.remoteAddress;
            }
          }

          var checkIpURL = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip;
          rqt(checkIpURL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              body = JSON.parse(body);
              address = body.data;
            }
            behavior.saveData({
              keyword: keyword,
              system: system,
              browser: browser,
              ip: ip,
              address: address
            });
          });

          res.sendStatus(200);
        }
      }
    })
  }

  var options = {
      root: 'static/img/',
      dotfiles: 'allow',
      headers: {
        'Content-Type': 'image/gif',
        'Pragma': 'no-cache',
        'Cache-Control': 'private, no-cache, no-cache=Set-Cookie, proxy-revalidate'
      }
    },
    fileName = '_ub.gif';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      if (err.code === 'ECONNABORT' && res.statusCode === 304) {
        console.log(new Date() + '304 cache hit for ' + fileName);
        return;
      }
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log(new Date() + 'Sent:', fileName);
    }
  });
}

/**
 * behavior middleware
 */
exports.behaviorByID = function(req, res, next, id) {
  Behavior.findById(id).populate('user', 'displayName').exec(function(err, behavior) {
    if (err) return next(err);
    if (! behavior) return next(new Error('Failed to load Exception ' + id));
    req.behavior = behavior ;
    next();
  });
};

/**
 * 获取behavior.js
 */
exports.behavior = function (req, res) {
  //配置文件参数
  var options = {
      root: process.env.NODE_ENV === 'production' ? 'static/dist/' : 'static/js/',
      dotfiles: 'allow',
      headers: {
        'Content-Type': 'text/javascript; charset=UTF-8',
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    },
    fileName = 'behavior.js';
  //存储appId到session
  req.session.appId = req.app._id;
  //发送文件
  res.sendFile(fileName, options, function (err) {
    if (err) {
      if (err.code === 'ECONNABORT' && res.statusCode === 304) {
        console.log(new Date() + '304 cache hit for ' + fileName);
        return;
      }
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log(new Date() + 'Sent:', fileName);
    }
  });
};

/**
 * 获取来自搜索引擎的关键词
 * @param url
 * @returns {*}
 * @constructor
 */
function getKeyword(url) {
  if (url.toString().indexOf("baidu") > 0) {
    return request(url, "wd");
  }
  else if (url.toString().indexOf("google") > 0) {
    return request(url, "q");
  }
  else if (url.toString().indexOf("sogou") > 0) {
    return request(url, "query");
  }
  else if (url.toString().indexOf("soso") > 0) {
    return request(url, "w");
  }
  else {
    return "";
  }
}

/**
 * 获取链接地址中某个参数的值
 * @param url
 * @param paras
 * @returns {*}
 */
function request(url, paras) {
  var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
  var paraObj = {};
  var i,j;
  for (i = 0;j = paraString[i]; i++) {
    paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
  }
  var returnValue = paraObj[paras.toLowerCase()];
  if (typeof (returnValue) == "undefined") {
    return "";
  } else {
    return returnValue;
  }
}

/**
 * 获取系统信息
 * @returns {string|string|string|string|string|string|*}
 */
function getSysInfo(ua) {
  var isWin10 = ua.indexOf('nt 10.0') > -1;
  var isWin8 = ua.indexOf('nt 6.2') >-1;
  var isWin7 = ua.indexOf("nt 6.1") > -1;
  var isVista = ua.indexOf("nt 6.0") > -1;
  var isWin2003 = ua.indexOf("nt 5.2") > -1;
  var isWinXp = ua.indexOf("nt 5.1") > -1;
  var isWin2000 = ua.indexOf("nt 5.0") > -1;
  var isWindows = (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1);
  var isMac = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1);
  var isAir = (ua.indexOf("adobeair") != -1);
  var isLinux = (ua.indexOf("linux") != -1);
  var broser = "",sys;
  if (isWin10) {
    sys = "Windows 10";
  } else if (isWin8) {
    sys = "Windows 8";
  } else if (isWin7) {
    sys = "Windows 7";
  } else if (isVista) {
    sys = "Vista";
  } else if (isWinXp) {
    sys = "Windows xp";
  } else if (isWin2003) {
    sys = "Windows 2003";
  } else if (isWin2000) {
    sys = "Windows 2000";
  } else if (isWindows) {
    sys = "Windows";
  } else if (isMac) {
    sys = "Macintosh";
  } else if (isAir) {
    sys = "Adobeair";
  } else if (isLinux) {
    sys = "Linux";
  } else {
    sys = "Unknow";
  }
  return sys;
}

/**
 * 获取浏览器类型
 * @returns {*}
 * @constructor
 */
function getBrowserType(ua) {
  if (ua == null) return "ie";
  else if (ua.indexOf('chrome') != -1) return "chrome";
  else if (ua.indexOf('opera') != -1) return "opera";
  else if (ua.indexOf('msie') != -1) return "ie";
  else if (ua.indexOf('safari') != -1) return "safari";
  else if (ua.indexOf('firefox') != -1) return "firefox";
  else if (ua.indexOf('gecko') != -1) return "gecko";
  else return "ie";
}
