"use strict";
exports.__esModule = true;
var sha3_1 = require("sha3");
exports.distance = function (x, y) { return Math.abs(x - y); };
exports.hashOf = function (x) { return new sha3_1.Keccak(256).update(x).digest('hex'); };
exports.min = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Math.min.apply(Math, args);
};
exports.max = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Math.max.apply(Math, args);
};
