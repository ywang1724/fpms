'use strict';

/**
 * 获取用户信息
 */
exports.getUserInformation = function (ua, platform, ip) {
    var browser,
        version,
        mobile,
        os,
        osversion,
        bit;
    if (/MSIE/.test(ua)) {
        browser = 'Internet Explorer';
        if (/IEMobile/.test(ua)) {
            mobile = 1;
        }
        version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
    } else if (/Chrome/.test(ua)) {
        // Platform override for Chromebooks
        if (/CrOS/.test(ua)) {
            platform = 'CrOS';
        }
        browser = 'Chrome';
        version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
    } else if (/Opera/.test(ua)) {
        browser = 'Opera';
        if (/mini/.test(ua) || /Mobile/.test(ua)) {
            mobile = 1;
        }
    } else if (/Android/.test(ua)) {
        browser = 'Android Webkit Browser';
        mobile = 1;
        os = /Android\s[\.\d]+/.exec(ua)[0];
    } else if (/Firefox/.test(ua)) {
        browser = 'Firefox';
        if (/Fennec/.test(ua)) {
            mobile = 1;
        }
        version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
    } else if (/Safari/.test(ua)) {
        browser = 'Safari';
        if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))) {
            os = 'iOS';
            mobile = 1;
        }
    }
    if (!version) {
        version = /Version\/[\.\d]+/.exec(ua);
        if (version) {
            version = version[0].split('/')[1];
        } else {
            version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
        }
    }
    if (platform === 'MacIntel' || platform === 'MacPPC') {
        os = 'Mac OS X';
        osversion = /10[\.\_\d]+/.exec(ua)[0];
        if (/[\_]/.test(osversion)) {
            osversion = osversion.split('_').join('.');
        }
    } else if (platform === 'CrOS') {
        os = 'ChromeOS';
    } else if (platform === 'Win32' || platform === 'Win64') {
        os = 'Windows';
        bit = platform.replace(/[^0-9]+/, '');
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp.$1 === 'NT') {
                switch (RegExp.$2) {
                    case '5.0':
                        osversion = '2000';
                        break;
                    case '5.1':
                        osversion = 'XP';
                        break;
                    case '6.0':
                        osversion = 'Vista';
                        break;
                    case '6.1':
                        osversion = '7';
                        break;
                    case '6.2':
                        osversion = '8';
                        break;
                    default:
                        osversion = 'NT';
                        break;
                }
            } else if (RegExp.$1 === '9x') {
                osversion = 'ME';
            } else {
                osversion = RegExp.$1;
            }
        }
    } else if (!os && /Android/.test(ua)) {
        os = 'Android';
        if (/Android (\d+\.\d+)/.test(ua)) {
            osversion = parseFloat(RegExp.$1);
        }
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return {
        browser: browser,
        version: version,
        mobile: mobile,
        os: os,
        osversion: osversion,
        bit: bit,
        ip: ip
    };
};
