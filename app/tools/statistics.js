'use strict';

/**
 * 求和
 */
var sum = function (arr) {
    var value = 0;
    for (var i = 0; i < arr.length; i++) {
        value += arr[i];
    }
    return value;
};

/**
 * 获取分位数（已排序）
 */
var quantileSorted = function (arr, p) {
    var idx = (arr.length) * p;
    if (p < 0 || p > 1) {
        return null;
    } else if (p === 1) {
        return arr[arr.length - 1];
    } else if (p === 0) {
        return arr[0];
    } else if (idx % 1 !== 0) {
        return arr[Math.ceil(idx) - 1];
    } else if (arr.length % 2 === 0) {
        return (arr[idx - 1] + arr[idx]) / 2;
    } else {
        return arr[idx];
    }
};

/**
 * 获取平均值
 */
exports.mean = function (arr) {
    if (arr.length === 0) return null;
    return sum(arr) / arr.length;
};

/**
 * 获取中位数
 */
exports.median = function (arr) {
    if (arr.length === 0) return null;
    var sorted = arr.slice().sort(function (a, b) { return a - b; });
    if (sorted.length % 2 === 1) {
        return sorted[(sorted.length - 1) / 2];
    } else {
        var a = sorted[(sorted.length / 2) - 1];
        var b = sorted[(sorted.length / 2)];
        return (a + b) / 2;
    }
};

/**
 * 获取分位数（未排序）
 */
exports.quantile = function (arr, p) {
    if (arr.length === 0) return null;
    var sorted = arr.slice().sort(function (a, b) { return a - b; });
    if (p.length) {
        var results = [];
        for (var i = 0; i < p.length; i++) {
            results[i] = quantileSorted(sorted, p[i]);
        }
        return results;
    } else {
        return quantileSorted(sorted, p);
    }
};
