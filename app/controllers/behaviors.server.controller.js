/**
 * @file
 * @author tommyzqfeng
 * @date 2017/2/6
 */
'use strict';

var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Behavior = mongoose.model('Behavior');
var CustomEvent = mongoose.model('CustomEvent');
var Event = mongoose.model('Event');
var App = mongoose.model('App');
var Page = mongoose.model('Page');
var Q = require('q');
var rqt = require('request');
var xmlrpc=require('xmlrpc');

/**
 * 配置rpc链接
 * @type {Client}
 */
var client = xmlrpc.createClient({
  port: 8888,
  host: '192.168.88.64'
});

/**
 * Create a behavior
 */
exports.create = function (req, res) {
  if(req.session.appId) {
    App.findById(req.session.appId).exec(function (err, app) {
      if(err) {
        console.log(errorHandler.getErrorMessage(err));
      } else {
        switch (req.query.type) {
          case '0':addBehavior(req, res, app);break;
          case '1':addEventData(req, res, app);break;
          case '2':addCustomEvent(req, res, app);break;
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
 * List of Behavior
 * @param req
 * @param res
 */
exports.statisticList = function (req, res) {
  /**
   * 参数：
   * pageId 页面id
   *
   */
  var reqData = req.query;
  var pages = (typeof reqData.pageId === 'string') ? [reqData.pageId] : reqData.pageId;
  // var browsers = (reqData.browser === 'all') ? [new RegExp('.*', 'i'), null] : [reqData.browser];
  var dataCounts = parseInt((reqData.untilDate - reqData.fromDate)/(3600*24*1000));
  if(req.param('dateNumber')) {
    console.log('dateNumber')
  } else {
    var result = {
      numData:[],
      origin:[],
      searchEngine:[],
      listData:[],
      mapData:[],
      browser:[]
    };

    /**
     * 访问量
     * @type {any}
     */
    var promise1 = Behavior.find({
      following: {$in: pages},
      timestamp: {$gte: reqData.fromDate, $lt: reqData.untilDate}
    }).sort('timestamp').exec(function (err, behaviors) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      } else {
        result.statisticData= {sum: behaviors.length};

        for (var i = 0; i<dataCounts; i++) {
          var temp=0;
          for(var j=0; j<behaviors.length; j++) {
            if(behaviors[j].timestamp>(parseInt(reqData.fromDate)+i*3600*24*1000) && behaviors[j].timestamp<parseInt(reqData.fromDate)+(i+1)*3600*24*1000) {
              temp++;
            }
          }
          result.numData.push([parseInt(reqData.fromDate)+i*3600*24*1000, temp]);
          temp = 0;
        }
      }
    });

    /**
     * 搜索引擎
     * @type {any}
     */
    var promise2 = Behavior.find({
      following: {$in: pages},
      timestamp: {$gte: reqData.fromDate, $lt: reqData.untilDate}
    }).exec(function (err, behaviors) {
      if(err) {
        console.log(errorHandler.getErrorMessage(err));
      } else {
        var num1=0, num2=0,num3=0,num4=0,num5=0;
        var googlePattern = /www\.google\./;
        var baiduPattern = /www\.baidu\./;
        var qihuPattern = /www\.so\./;
        var sogouPattern = /www\.sogou\./;
        var smaPattern = /sma\.so/;
        for(var i=0;i<behaviors.length; i++) {
          var referStr = behaviors[i].referer;
          if(referStr) {
            if(~referStr.search(googlePattern)){
              num1++;
            } else if (~referStr.search(baiduPattern)){k
              num2++;
            } else if (~referStr.search(qihuPattern)) {
              num3++;
            } else if (~referStr.search(sogouPattern)) {
              num4++;
            } else if (~referStr.search(smaPattern)) {
              num5++;
            }
          }
        }
        result.searchEngine.push(['谷歌', num1],['百度', num2],['360搜索', num3],['搜狗搜索', num4],['神马搜索', num5]);
      }
    });

    /**
     * 访问来源
     */
    var promise3 = Behavior.find({
      following: {$in: pages},
      timestamp: {$gte: reqData.fromDate, $lt: reqData.untilDate}
    }).exec(function (err,behaviors) {
          if(err) {
            console.log(errorHandler.getErrorMessage(err));
          } else {
            var num1=0,num2=0,num3=0,num4=0; //num1:直接输入网址或书签;num2:站内来源;num3:搜索引擎;num4:其他外部链接
            var pattern1 = /^(?:(\w+):\/\/)?(?:(\w+):?(\w+)?@)?([^:\/\?#]+)(?::(\d+))?(\/[^\?#]+)?(?:\?([^#]+))?(?:#(\w+))?/;
            var pattern2 = /(www\.google\.)|(www\.baidu\.)|(www\.so\.)|(www\.sogou\.)|(sma\.so)/;

            for (var i=0; i<behaviors.length; i++) {
              if(!behaviors[i].referer) {
                num1++;
              } else if(~behaviors[i].referer.indexOf(pattern1.exec(behaviors[i].url)[4])) {
                num2++;
              } else if(~behaviors[i].referer.search(pattern2)) {
                num3++;
              } else{
                num4++;
              }
            }
            result.origin.push(['直接输入网址或书签', num1],['站内来源', num2],['搜索引擎', num3],['其他外部链接', num4]);
          }
        });

    /**
     * 关键字
     * 未使用
     */
    var promise4 = Behavior.find({
      following: {$in: pages},
      timestamp: {$gte: reqData.fromDate, $lt: reqData.untilDate},
      keyword: /\S/i
    }).exec(function (err, behaviors) {
      var keywords = '';
      if(err) {
        console.log(errorHandler.getErrorMessage(err));
      } else {
        for(var i=0; i<behaviors.length; i++) {
          keywords+=behaviors[i]+'';
        }
      }
    });

    /**
     * 受访页面
     */
    var promise5 = Behavior.find({
      following: {$in: pages},
      timestamp: {$gte: reqData.fromDate, $lt: reqData.untilDate}
    }).exec(function (err, behaviors) {
      if(err) {
        console.log(errorHandler.getErrorMessage(err));
      } else {
        for(var i=0; i<behaviors.length; i++) {
          result.listData.push(behaviors[i]);
        }
      }
    });

    /**
     * 终端详情
     */
    var promise6 = Behavior.find({
      following: {$in: pages},
      timestamp: {$gte: reqData.fromDate, $lt: reqData.untilDate}
      }).exec(function (err, behaviors) {
          if(err) {
            console.log(errorHandler.getErrorMessage(err));
          } else {
            var chromeNum = 0,operaNum=0,ieNum=0,safariNum=0,firefoxNum=0;
            for(var i=0; i<behaviors.length;i++) {
              switch (behaviors[i].browser) {
                case 'chrome': chromeNum++;break;
                case 'opera': operaNum++;break;
                case 'ie': ieNum++;break;
                case 'safari': safariNum++;break;
                case 'firefox': firefoxNum++;break;
              }
            }
            result.browser.push(['Chrome', chromeNum],['Opera', operaNum],['IE', ieNum],['Safari', safariNum],['Firefox',firefoxNum]);
          }
        });


    Q.all([promise1, promise2, promise3,promise4,promise5,promise6]).then(function () {
      res.json(result);
    })
  }

}

/**
 * 删除用户自定义事件
 * @param req 请求
 * @param res 响应
 */
exports.deleteCustomEvent = function (req, res) {
  CustomEvent.findByIdAndRemove(req.query.id)
    .exec(function (err,customEvent) {
      if(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      } else {
        res.jsonp(customEvent);
      }

  })
}

/**
 * 获取用户自定义规则
 * @param req 请求
 * @param res 响应
 */
exports.customList = function (req, res) {
  CustomEvent.find({following: req.app.id}).exec(function (err, customEvent) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customEvent);
    }
  });
};

/**
 * 请求事件分析漏斗图数据
 * @param req 请求
 * @param res 响应
 */
exports.funnel = function (req, res) {
  Event.count({
    following: req.query.following
  }).exec(function (err, result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  })
}

/**
 * behavior middleware
 * @param req 请求
 * @param res 响应
 * @param next
 * @param id 应用id
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
 * @param req 请求
 * @param res 响应
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
    };

  if (req.session.isOpenBehavior) {
    var fileName = 'behavior.custom.js';
  } else {
    var fileName = 'behavior.js';
  }

  //存储appId到session
  req.session.appId = req.app._id;
  //发送文件
  App.findById(req.app._id, function (err,app) {
    if(app.config.behavior) {
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
    } else {
      res.type('text/javascipt');
      res.send('');
    }
  })

};

/**
 * 返回自定义事件的css
 * @param req 请求
 * @param res 响应
 */
exports.returnStyle = function (req, res) {
  //配置文件参数
  var options = {
    root: 'static/css/',
    dotfiles: 'allow',
    headers: {
      'Content-Type': 'text/javascript; charset=UTF-8',
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  var fileName = 'behavior.custom.css';


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
 * 请求路径分析的数据
 * @param req 请求
 * @param res 响应
 */
exports.pathAnalysis = function (req, res) {
  client.methodCall('geturlDatas', ['811756202','http://wenkechu.hust.edu.cn'], function (err,result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  });
};

/**
 * 切换被监测网站是否带有绑定工具条
 * @param req 请求
 * @param res 响应
 */
exports.switchBehaviorBar = function (req, res) {
  if (req.session.appId) {
    App.findById(req.session.appId).exec(function (err, app) {
      if (err) {
        console.log(errorHandler.getErrorMessage(err));
      } else {
        var data = JSON.parse(decodeURIComponent(req.url.substring(req.url.indexOf('?') + 1)));
        req.session.isOpenBehavior = data.isOpenBehavior;
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
 * 添加一条用户访问数据
 * @param req 请求
 * @param res 响应
 * @param app app对象
 */
function addBehavior(req, res, app) {
  var behaviorData = req.query;
  if (~parseInt(behaviorData.url.indexOf(app.host))) {
    var page = {};
    //查找Web应用对应页面，如果存在则返回，如果不存在则新建
    Page.findOneAndUpdate({app:app, pathname: behaviorData.pathname}, page, {upsert: true})
      .exec(function (err, obj) {
        if(err) {
          console.log(errorHandler.getErrorMessage(err));
        } else {
          page = obj;

          var behavior = new Behavior(behaviorData);
          var regex = /^\:\:ffff\:/;

          var keyword = getKeyword(behaviorData.referer);
          var system = getSysInfo(behaviorData.userAgent);
          var browser = getBrowserType(behaviorData.userAgent);
          var following = page._id.toString();
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
              address: address,
              following: following
            });
          });

          res.sendStatus(200);
        }
      })

  }
}

/**
 * 添加一条用户点击数据
 * @param req 请求
 * @param res 响应
 * @param app app对象
 */
function addEventData(req, res, app) {
  var eventData = req.query;
  CustomEvent.find({
    cssPath:eventData.cssPath,
    text:eventData.text,
    url:eventData.url,
    following: app._id.toString()
  }).exec(function (err, result) {
    if(err) {
      console.log(errorHandler.getErrorMessage(err));
    } else {
      for(var i=0;i<result.length;i++) {
        var event = new Event({
          timestamp:+(new Date()),
          following: result[i]._id.toString()
        });
        event.save();
      }

      res.sendStatus(200);
    }
  })
}

/**
 * 添加一条用户自定义点击数据
 * @param req 请求
 * @param res 响应
 * @param app app对象
 */
function addCustomEvent(req, res, app) {
  var customData = {
    name: req.query.name,
    cssPath: req.query.cssPath,
    text: req.query.text,
    url: req.query.url,
    following: app._id.toString()
  };

  var customeEvent = new CustomEvent(customData);
  customeEvent.save();
  res.sendStatus(200);
}

/**
 * 获取来自搜索引擎的关键词
 * @param url url地址
 * @returns {Function} 调用request函数
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
 * @param url url地址
 * @param paras 某个参数的 key
 * @returns {String} 某个参数的 value
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
 * @param ua 用户代理字段
 * @returns {String} 系统类型
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
 * @returns ua 用户代理字段
 * @return {String} 浏览器类型
 */
function getBrowserType(ua) {
  if (ua == null) return "ie";
  else if (ua.indexOf('chrome') != -1) return "chrome";
  else if (ua.indexOf('opera') != -1) return "opera";
  else if (ua.indexOf('msie') != -1) return "ie";
  else if (ua.indexOf('safari') != -1) return "safari";
  else if (ua.indexOf('firefox') != -1) return "firefox";
  else if (ua.indexOf('gecko') != -1) return "firefox";
  else return "ie";
}
