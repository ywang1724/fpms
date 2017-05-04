var testindex = 0;
var loadInProgress = false;//当页面还在加载时，设为true

/********* 配置信息 *******************/
var webPage = require('webpage');
var page = webPage.create();
var system = require('system');
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = true;//是否加载图片
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;

console.log(system.args[1]);
var config = JSON.parse(system.args[1]);

/******** 执行步骤 *********************/
steps = [
    function () {
        console.log('第1步：打开登陆页面...');
        page.open(config.url, function (status) {
        });
    },
    function () {
        console.log('第2步：提交表单，登陆...');
        var script = 'function(){document.querySelector("' + config.usernameSelector + '").value = "' + config.username+'";' +
            'document.querySelector("' + config.passwordSelector + '").value = "' + config.password+'";' +
            (config.useCaptcha ? ('document.querySelector("' + config.captchaSelector + '").value = "' + config.captcha + '";') : "" )+
            'document.querySelector("' + config.loginFormSelector + '").submit();}';
        console.log(script);
        page.evaluateJavaScript(script);
    },
    function () {
        console.log("存储登陆cookie...");
        var fs = require('fs');
        fs.write(config.cookie, JSON.stringify(phantom.cookies), "w");
        phantom.exit(0);
    }
];

//依次执行
interval = setInterval(executeRequestsStepByStep, 50);


function executeRequestsStepByStep() {
    if (loadInProgress == false && typeof steps[testindex] == "function") {
        steps[testindex]();
        testindex++;
    }
}

/******** 设置事件监听 *********************/
page.onLoadStarted = function () {
    loadInProgress = true;
    console.log('页面加载开始...');
};
page.onLoadFinished = function () {
    loadInProgress = false;
    console.log('页面加载完成...');
};
