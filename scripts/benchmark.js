"use strict";
exports.__esModule = true;
var perf_hooks_1 = require("perf_hooks");
expect.extend({
    toTakeLessThan: function (fn, time) {
        var now = perf_hooks_1.performance.now();
        fn();
        var then = perf_hooks_1.performance.now();
        var timeTaken = then - now;
        var pass = timeTaken <= time;
        var message = function () {
            if (pass)
                return [
                    "Function " + fn.name + " took less than " + time + " milliseconds.",
                    "It took " + timeTaken + " milliseconds."
                ].join(" \n");
            return [
                "Function " + fn.name + " took longer than " + time + " milliseconds.",
                "It took " + timeTaken + " milliseconds."
            ].join(" \n");
        };
        return {
            pass: pass,
            message: message
        };
    }
});
function doNothing() { }
exports.doNothing = doNothing;
