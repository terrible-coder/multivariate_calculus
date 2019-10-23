/**
 * MIT License
 * 
 * Copyright (c) 2019 Ayanava De
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Checks whether a given `Token` is an `Evaluable`. */
function isEvaluable(e) { return e.type !== "operator"; }
exports.isEvaluable = isEvaluable;
/** Checks whether a given `Evaluable` is a variable. */
function isVariable(e) { return e.type === "variable"; }
exports.isVariable = isVariable;
/** Checks whether a given `Evaluable` is a constant. */
function isConstant(e) { return e.type === "constant"; }
exports.isConstant = isConstant;
/** Checks whether a given `Evaluable` is an expression. */
function isExpression(e) { return e.type === "expression"; }
exports.isExpression = isExpression;

},{}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The error thrown when attempt is made to divide by zero.
 */
var DivisionByZero = /** @class */ (function (_super) {
    __extends(DivisionByZero, _super);
    /**
     * Creates a [[DivisionByZero]] error.
     * @param message The message to display.
     */
    function DivisionByZero(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "Division by zero";
        return _this;
    }
    return DivisionByZero;
}(Error));
exports.DivisionByZero = DivisionByZero;
/**
 * The error thrown when some sort of [indeterminate form](https://en.wikipedia.org/wiki/Indeterminate_form) is produced during
 * calculations.
 */
var IndeterminateForm = /** @class */ (function (_super) {
    __extends(IndeterminateForm, _super);
    /**
     * Creates an [[IndeterminateForm]] error.
     * @param message The message to display.
     */
    function IndeterminateForm(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "Indeterminate form";
        return _this;
    }
    return IndeterminateForm;
}(Error));
exports.IndeterminateForm = IndeterminateForm;
/**
 * The error thrown when some sort of illegal overwrite is attempted. It is
 * usually in the case of trying to define a constant with the same name
 * as another previously defined constant.
 */
var Overwrite = /** @class */ (function (_super) {
    __extends(Overwrite, _super);
    /**
     * Creates a [[Overwrite]] error.
     * @param name The name of the constant which is being overwritten.
     */
    function Overwrite(name) {
        var _this = _super.call(this, "A constant with name " + name + " has already been declared.") || this;
        _this.name = "Overwrite";
        return _this;
    }
    return Overwrite;
}(Error));
exports.Overwrite = Overwrite;
/**
 * The error thrown when some invalid index of some quantity is being accessed.
 * An invalid index would be any index which does not exist on a particular quantity.
 */
var InvalidIndex = /** @class */ (function (_super) {
    __extends(InvalidIndex, _super);
    /**
     * Creates an [[InvalidIndex]] error.
     * @param passed The index value being accessed.
     * @param start The value from which indexing starts.
     */
    function InvalidIndex(passed, start) {
        var _this = _super.call(this, "Index " + passed + " does not exist. Indexing starts from " + start + ".") || this;
        _this.name = "Invalid index";
        return _this;
    }
    return InvalidIndex;
}(Error));
exports.InvalidIndex = InvalidIndex;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var definitions_1 = require("./definitions");
var binary_1 = require("./operators/binary");
var unary_1 = require("./operators/unary");
var math_1 = require("./math/math");
/**
 * Contains helper functions needed by any class that is an [[Expression]].
 */
var ExpressionBuilder;
(function (ExpressionBuilder) {
    /**
     * Given any one or two [[Evaluable]] quantities, contructs a `Set` of
     * unknowns it/they depend on.
     * @param a First [[Evaluable]]
     * @param b Second [[Evaluable]]
     */
    function createArgList(a, b) {
        var list = new Set();
        if (definitions_1.isExpression(a))
            a.arg_list.forEach(function (v) { return list.add(v); });
        else if (definitions_1.isVariable(a))
            list.add(a);
        if (b !== undefined) {
            if (definitions_1.isExpression(b))
                b.arg_list.forEach(function (v) { return list.add(v); });
            else if (definitions_1.isVariable(b))
                list.add(b);
        }
        return list;
    }
    ExpressionBuilder.createArgList = createArgList;
    function simplify(e, values) {
        if (definitions_1.isExpression(e)) {
            var depends_1 = false;
            e.arg_list.forEach(function (v) { return depends_1 = depends_1 || values.has(v); });
            if (depends_1)
                return evaluateAt(e, values);
        }
        return values.get(e) || e;
    }
    /**
     * Given an [[Expression]] and a `Map` of variables to constants, evaluates
     * the value of the given expression at the given values of variables.
     * It is like evaluating the expression by substituting the specified
     * variables by respective constant values.
     * @param exp The [[Expression]] to evaluate
     * @param values The map of [[Variable]]s to [[Constant]]s.
     */
    function evaluateAt(exp, values) {
        if (binary_1.isBinaryOperator(exp.op))
            return simplify(exp.lhs, values)[exp.op](simplify(exp.rhs, values));
        if (unary_1.isUnaryOperator(exp.op))
            return math_1.math[exp.op](simplify(exp.arg, values));
    }
    ExpressionBuilder.evaluateAt = evaluateAt;
})(ExpressionBuilder = exports.ExpressionBuilder || (exports.ExpressionBuilder = {}));

},{"./definitions":1,"./math/math":7,"./operators/binary":8,"./operators/unary":9}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Interval = /** @class */ (function () {
    function Interval(a, b) {
        this.left = a;
        this.right = b;
    }
    /**
     * Creates and returns a closed interval onject.
     * @param a The left side limit of the interval.
     * @param b The right side limit of the interval.
     */
    Interval.closed = function (a, b) {
        return new Interval({
            value: a,
            inclusive: true
        }, {
            value: b,
            inclusive: true
        });
    };
    /**
     * Creates and returns a closed interval onject.
     * @param a The left side limit of the interval.
     * @param b The right side limit of the interval.
     */
    Interval.open = function (a, b) {
        return new Interval({
            value: a,
            inclusive: false
        }, {
            value: b,
            inclusive: false
        });
    };
    /**
     * Creates and returns a left-open right-closed interval onject.
     * @param a The left side limit of the interval.
     * @param b The right side limit of the interval.
     */
    Interval.open_closed = function (a, b) {
        return new Interval({
            value: a,
            inclusive: false
        }, {
            value: b,
            inclusive: true
        });
    };
    /**
     * Creates and returns a left-closed and right-open interval onject.
     * @param a The left side limit of the interval.
     * @param b The right side limit of the interval.
     */
    Interval.closed_open = function (a, b) {
        return new Interval({
            value: a,
            inclusive: true
        }, {
            value: b,
            inclusive: false
        });
    };
    /**
     * Checks whether the left side of the interval is open.
     */
    Interval.prototype.isLeftOpen = function () {
        return !this.left.inclusive;
    };
    /**
     * Checks whether the left side of the interval is closed.
     */
    Interval.prototype.isLeftClosed = function () {
        return this.left.inclusive;
    };
    /**
     * Checks whether the right side of the interval is open.
     */
    Interval.prototype.isRightOpen = function () {
        return !this.right.inclusive;
    };
    /**
     * Checks whether the right side of the interval is closed.
     */
    Interval.prototype.isRightClosed = function () {
        return this.right.inclusive;
    };
    /**
     * Checks whether both sides of `this` interval are open.
     */
    Interval.prototype.isOpen = function () {
        return this.isLeftOpen() && this.isRightOpen();
    };
    /**
     * Checks whether both sides of `this` interval are closed.
     */
    Interval.prototype.isClosed = function () {
        return this.isLeftClosed() && this.isRightClosed();
    };
    /**
     * Checks whether a given number falls within the range specified by `this`
     * interval or not.
     * @param x The number to check for.
     */
    Interval.prototype.contains = function (x) {
        if (this.isOpen())
            return this.left.value < x && x < this.right.value;
        if (this.isClosed())
            return this.left.value <= x && x <= this.right.value;
        if (this.isLeftClosed())
            return this.left.value <= x && x < this.right.value;
        if (this.isRightClosed())
            return this.left.value < x && x <= this.right.value;
    };
    return Interval;
}());
exports.Interval = Interval;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
/**
 * Specifies a *rounding behaviour* for numerical operations on [[BigNum]]
 * which are capable of discarding some precision. This is based on the JAVA
 * implementation of rounding behaviour. Read more [here](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html).
 */
var RoundingMode;
(function (RoundingMode) {
    /** Rounds the number away from 0. */
    RoundingMode[RoundingMode["UP"] = 0] = "UP";
    /** Rounds the number down towards 0. */
    RoundingMode[RoundingMode["DOWN"] = 1] = "DOWN";
    /** Rounds the number up towards positive infinity. */
    RoundingMode[RoundingMode["CEIL"] = 2] = "CEIL";
    /** Rounds the number down towards negative infinity. */
    RoundingMode[RoundingMode["FLOOR"] = 3] = "FLOOR";
    /** Rounds towards nearest neighbour. In case it is equidistant it is rounded up. */
    RoundingMode[RoundingMode["HALF_UP"] = 4] = "HALF_UP";
    /** Rounds towards nearest neighbour. In case it is equidistant it is rounded down. */
    RoundingMode[RoundingMode["HALF_DOWN"] = 5] = "HALF_DOWN";
    /** Rounds towards nearest neighbour. In case it is equidistant it is rounded to nearest even number. */
    RoundingMode[RoundingMode["HALF_EVEN"] = 6] = "HALF_EVEN";
    /** Rounding mode to assert that no rounding is necessary as an exact representation is possible. */
    RoundingMode[RoundingMode["UNNECESSARY"] = 7] = "UNNECESSARY";
})(RoundingMode = exports.RoundingMode || (exports.RoundingMode = {}));
var MathContext;
(function (MathContext) {
    /**
     * The default [[MathContext]] used when an exact representation cannot be
     * achieved for some operation.
     */
    MathContext.DEFAULT_CONTEXT = {
        precision: 17,
        rounding: RoundingMode.UP
    };
    /**
     * The [[MathContext]] used for high precision calculation. Stores up to
     * 50 places after the decimal point with [[RoundingMode.UP]] rounding algorithm.
     */
    MathContext.HIGH_PRECISION = {
        precision: 50,
        rounding: RoundingMode.UP
    };
    /**
     * The [[MathContext]] which defines how numbers are dealt with in science.
     * It has slightly higher precision value than the default context with
     * [[RoundingMode.HALF_EVEN]] rounding algorithm.
     */
    MathContext.SCIENTIFIC = {
        precision: 20,
        rounding: RoundingMode.HALF_EVEN
    };
    /**
     * The [[MathContext]] which defines how to deal with high precision
     * numbers in science. It has the same precision value as the high precision one
     * and [[RoundingMode.HALF_EVEN]] rounding algorithm.
     */
    MathContext.HIGH_PREC_SCIENTIFIC = {
        precision: 50,
        rounding: RoundingMode.HALF_EVEN
    };
})(MathContext = exports.MathContext || (exports.MathContext = {}));
/**
 * Immutable, arbitrary precision decimal numbers. A BigNum consists of an
 * integer part and a decimal part stored as string objects. The precision of
 * the number is completely controlled by the user. A [[MathContext]] object
 * helps to specify the number of decimal places (not significant figures) the
 * user wants and what rounding algorithm should be used. Every operation is
 * carried out by an intermediate result which is then rounded to the preferred
 * number of decimal places using the preferred rounding algorithm.
 */
var BigNum = /** @class */ (function () {
    function BigNum(a, b) {
        var _a;
        var num;
        if (b === undefined)
            if (typeof a === "number")
                num = a.toString();
            else
                num = a;
        else if (typeof a === "string" && typeof b === "string")
            num = a + "." + b;
        else
            throw new TypeError("Illegal argument type.");
        _a = BigNum.parseNum(num), this.integer = _a[0], this.decimal = _a[1];
    }
    Object.defineProperty(BigNum.prototype, "asString", {
        /**
         * Returns this number as a single string, with no decimal point.
         * @ignore
         */
        get: function () {
            return this.integer + this.decimal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BigNum.prototype, "asBigInt", {
        /**
         * Returns this number as an unscaled BigInt instance.
         * @ignore
         */
        get: function () {
            return BigInt(this.asString);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BigNum.prototype, "precision", {
        /**
         * The number of digits after the decimal point stored by this number.
         * @ignore
         */
        get: function () {
            return this.decimal.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BigNum.prototype, "sign", {
        /**
         * The sign of this number.
         */
        get: function () {
            if (this.integer === "" && this.decimal === "")
                return 0;
            if (this.integer.charAt(0) === '-')
                return -1;
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Given a string, adds padding to the rear or front. This is an implementation
     * to only aid with numerical operations where the numbers are stored as
     * strings. Do not use for general use.
     * @param s The string which is to be padded.
     * @param n Number of times padding string must be used.
     * @param char The padding string. It must be a single character string.
     * @param front Flag value to indicate whether to pad at front or at rear.
     * @ignore
     */
    BigNum.pad = function (s, n, char, front) {
        if (front === void 0) { front = false; }
        if (char.length > 1)
            throw new Error("Padding string must have only one character.");
        return front ? "".padEnd(n, char) + s : s + "".padEnd(n, char);
    };
    /**
     * Aligns the decimal point in the given numbers by adding padding 0's
     * at the end of the smaller number string.
     * @param a
     * @param b
     * @returns The strings aligned according to position of decimal point.
     * @ignore
     */
    BigNum.align = function (a, b) {
        var pa = a.precision, pb = b.precision;
        var d = pa - pb;
        var aa = a.asString, ba = b.asString;
        if (d > 0)
            ba = BigNum.pad(ba, d, "0");
        else if (d < 0)
            aa = BigNum.pad(aa, -d, "0");
        return [aa, ba];
    };
    /**
     * Inserts a decimal point in the string at a given index. The `index`
     * value is calculated from the rear of the string starting from 1.
     * @param a The number as a string.
     * @param index The index from the rear.
     * @ignore
     */
    BigNum.decimate = function (a, index) {
        if (index < 0)
            throw new Error("Cannot put decimal point at negative index.");
        var s = a, sgn = "";
        if (s.charAt(0) === '-') {
            s = s.substring(1);
            sgn = "-";
        }
        if (index > s.length)
            s = "0." + BigNum.pad(s, index - s.length, "0", true);
        else
            s = s.substring(0, s.length - index) + "." + s.substring(s.length - index);
        return sgn + s;
    };
    /**
     * Takes a string and parses into the format expected by the [[BigNum]] class.
     * @param s String representation of the number.
     * @returns An array where the first element is the integer part and the second is the decimal part.
     */
    BigNum.parseNum = function (s) {
        if (!isValid(s))
            throw new TypeError("Illegal number format.");
        var a = [];
        if (s.indexOf('e') > -1) {
            // The number is in scientific mode
            // Me-E
            // M is the mantissa and E is the exponent with base 10
            var i = s.indexOf('e');
            var mantissa = s.substring(0, i), exponent = Number(s.substring(i + 1));
            var index = mantissa.indexOf('.');
            var precision = index == -1 ? 0 : mantissa.substring(index + 1).length;
            var num = mantissa.split('.').join("");
            if (exponent > precision) {
                num = BigNum.pad(mantissa, exponent - precision, "0");
            }
            else
                num = BigNum.decimate(num, precision - exponent);
            a = num.split(".");
        }
        else
            a = s.split(".");
        return a.length === 1 ? [trimZeroes(a[0], "start"), ""] :
            [trimZeroes(a[0], "start"), trimZeroes(a[1], "end")];
    };
    /**
     * Evaluates the absolute value of this number.
     * @param x The number whose absolute value is to be found.
     * @returns The absolute value of the argument.
     */
    BigNum.abs = function (x) {
        return x.integer.charAt(0) === '-' ? new BigNum(x.integer.substring(1) + "." + x.decimal) : x;
    };
    /**
     * Rounds off a given number according to some [[MathContext]]. The different
     * rounding algorithms implemented are identical to the ones defined by the
     * [RoundingMode](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html)
     * class of JAVA.
     * @param x The number to round off.
     * @param context The [[MathContext]] which defines how the number is to be rounded.
     * @returns The number representing the rounded value of the argument according to the given context.
     */
    BigNum.round = function (x, context) {
        if (x.precision > context.precision) {
            var num = x.asBigInt;
            var diff = x.precision - context.precision;
            var divider = BigInt(BigNum.pad("1", diff, "0"));
            var rounded = num / divider, last = num % divider;
            var one = BigInt("1"), ten = BigInt("10");
            var FIVE = BigInt(BigNum.pad("5", diff - 1, "0")), ONE = BigInt(BigNum.pad("1", diff - 1, "0"));
            switch (context.rounding) {
                case RoundingMode.UP:
                    if (last >= ONE)
                        rounded += one;
                    else if (last <= -ONE)
                        rounded -= one;
                    break;
                case RoundingMode.DOWN:
                    break;
                case RoundingMode.CEIL:
                    if (last >= ONE)
                        rounded += one;
                    break;
                case RoundingMode.FLOOR:
                    if (last <= -ONE)
                        rounded -= one;
                    break;
                case RoundingMode.HALF_DOWN:
                    if (last > FIVE)
                        rounded += one;
                    else if (last < -FIVE)
                        rounded -= one;
                    break;
                case RoundingMode.HALF_UP:
                    if (last >= FIVE)
                        rounded += one;
                    else if (last <= -FIVE)
                        rounded -= one;
                    break;
                case RoundingMode.HALF_EVEN:
                    if (last > FIVE)
                        rounded += one;
                    else if (last < -FIVE)
                        rounded -= one;
                    else if (Math.abs(Number(rounded % ten)) % 2 !== 0) {
                        if (last === FIVE)
                            rounded += one;
                        else if (last === -FIVE)
                            rounded -= one;
                    }
                    break;
                case RoundingMode.UNNECESSARY:
                    if (last > 0 || last < 0)
                        throw Error("Rounding necessary. Exact representation not known.");
                    break;
            }
            var r = rounded.toString();
            return new BigNum(BigNum.decimate(r, context.precision));
        }
        else
            return x;
    };
    /**
     * The comparator function. This compares `this` to `that` and returns
     * * 0 if they are equal
     * * 1 if `this` > `that`
     * * -1 if `this` < `that`
     * @param that Number to compare with.
     */
    BigNum.prototype.compareTo = function (that) {
        var _a = BigNum.align(this, that), a = _a[0], b = _a[1];
        var x = BigInt(a) - BigInt(b);
        return x > 0 ? 1 : x < 0 ? -1 : 0;
    };
    /**
     * Determines whether `this` is less than `that`.
     * @param that Number to compare with.
     */
    BigNum.prototype.lessThan = function (that) {
        return this.compareTo(that) === -1;
    };
    /**
     * Determines whether `this` is more than `that`.
     * @param that Number to compare with.
     */
    BigNum.prototype.moreThan = function (that) {
        return this.compareTo(that) === 1;
    };
    BigNum.prototype.equals = function (that, context) {
        if (context === void 0) { context = BigNum.MODE; }
        var A = BigNum.round(this, context);
        var B = BigNum.round(that, context);
        return A.integer === B.integer && A.decimal === B.decimal;
    };
    /**
     * Determines whether `this` is less than or equal to `that`.
     * @param that Number to compare with.
     */
    BigNum.prototype.lessEquals = function (that) {
        return this.lessThan(that) || this.equals(that);
    };
    /**
     * Determines whether `this` is more than or equal to `that`.
     * @param that Number to compare with.
     */
    BigNum.prototype.moreEquals = function (that) {
        return this.moreThan(that) || this.equals(that);
    };
    Object.defineProperty(BigNum.prototype, "neg", {
        /**
         * The negative value of `this`.
         */
        get: function () {
            if (this.integer.charAt(0) === '-')
                return new BigNum(this.integer.substring(1) + "." + this.decimal);
            return new BigNum("-" + this.toString());
        },
        enumerable: true,
        configurable: true
    });
    BigNum.prototype.add = function (that, context) {
        context = context || BigNum.MODE;
        var _a = BigNum.align(this, that), a = _a[0], b = _a[1];
        var sum = (BigInt(a) + BigInt(b)).toString();
        var precision = Math.max(this.precision, that.precision);
        var res = new BigNum(BigNum.decimate(sum, precision));
        return BigNum.round(res, context);
    };
    BigNum.prototype.sub = function (that, context) {
        context = context || BigNum.MODE;
        var _a = BigNum.align(this, that), a = _a[0], b = _a[1];
        var sum = (BigInt(a) - BigInt(b)).toString();
        var precision = Math.max(this.precision, that.precision);
        var res = new BigNum(BigNum.decimate(sum, precision));
        return BigNum.round(res, context);
    };
    BigNum.prototype.mul = function (that, context) {
        context = context || BigNum.MODE;
        var prod = (this.asBigInt * that.asBigInt).toString();
        var precision = this.precision + that.precision;
        var res = new BigNum(BigNum.decimate(prod, precision));
        return BigNum.round(res, context);
    };
    BigNum.prototype.div = function (that, context) {
        context = context || BigNum.MODE;
        if (that.sign === 0) {
            if (this.sign === 0)
                throw new errors_1.IndeterminateForm("Cannot determine 0/0.");
            throw new errors_1.DivisionByZero("Cannot divide by zero.");
        }
        var precision = context.precision;
        var p1 = this.precision, p2 = that.precision, p = precision - p1 + p2;
        var a = p < 0 ? this.asBigInt : BigInt(BigNum.pad(this.asString, p, "0")); //this.asBigInt * BigInt(Math.pow(10, precision - p1 + p2));
        var b = that.asBigInt;
        var quo = (a / b).toString();
        var res = new BigNum(BigNum.decimate(quo, (p < 0) ? p1 : precision));
        return BigNum.round(res, context);
    };
    /**
     * Raises a [[BigNum]] to an integer power. This function may be made
     * private in future versions. It is adviced not to use this function
     * except for development purposes.
     * @param base The base number.
     * @param index The index / exponent to which the base is to be raised.
     * @param context The context settings to use.
     */
    BigNum.intpow = function (base, index, context) {
        if (context === void 0) { context = BigNum.MODE; }
        if (index !== (index | 0))
            throw "Only defined for integer values of the power.";
        var p = BigNum.ONE;
        for (var i = 0; i < index; i++)
            p = p.mul(base, context);
        return p;
    };
    BigNum.prototype.pow = function (ex, context) {
        if (context === void 0) { context = BigNum.MODE; }
        if (ex.decimal === "" || ex.decimal === "0")
            return BigNum.intpow(this, parseInt(ex.integer), context);
        var ctx = {
            precision: 2 * context.precision,
            rounding: context.rounding
        };
        var y = ex.mul(BigNum.ln(this, ctx), ctx);
        return BigNum.round(BigNum.exp(y, ctx), context);
    };
    BigNum.sin = function (x, context) {
        if (context === void 0) { context = BigNum.MODE; }
        /*
            sin x = sum((-1)^n * x^(2n+1) / (2n+1)!, 0, infty)
            t_n = ((-1)^n / (2n+1)!) * x^(2n+1)
            t_n1 = ((-1)^n+1 / (2n+3)!) * x^(2n+3)
            t_n1 = - (t_n/(2n+3)(2n+2)) * x^2
        */
        var ctx = {
            precision: 2 * context.precision,
            rounding: context.rounding
        };
        var x_sq = x.mul(x, ctx);
        var sum = BigNum.ZERO;
        var term = x;
        var n = BigNum.ZERO;
        while (true) {
            sum = sum.add(term, ctx);
            var a = BigNum.TWO.mul(n).add(BigNum.THREE);
            var b = BigNum.TWO.mul(n).add(BigNum.TWO);
            var f = a.mul(b).neg;
            var term1 = term.mul(x_sq, ctx).div(f, ctx);
            if (BigNum.abs(term1).equals(BigNum.ZERO, ctx))
                return BigNum.round(sum, context);
            term = term1;
            n = n.add(BigNum.ONE);
        }
    };
    BigNum.cos = function (x, context) {
        if (context === void 0) { context = BigNum.MODE; }
        /*
            cos x = sum((-1)^n * x^(2n) / (2n)!, 0, infty)
            t_n = (-1)^n * x^(2n) / (2n)!
            t_n1 = (-1)^n+1 * x^(2n+2) / (2n + 2)!
            t_n1 = - (t_n / (2n + 1)(2n + 2)) * x^2
        */
        var ctx = {
            precision: 2 * context.precision,
            rounding: context.rounding
        };
        var x_sq = x.mul(x, ctx);
        var sum = BigNum.ZERO;
        var term = BigNum.ONE;
        var n = BigNum.ZERO;
        while (true) {
            sum = sum.add(term, ctx);
            var a = BigNum.TWO.mul(n).add(BigNum.ONE);
            var b = BigNum.TWO.mul(n).add(BigNum.TWO);
            var f = a.mul(b).neg;
            var term1 = term.mul(x_sq, ctx).div(f, ctx);
            if (BigNum.abs(term1).equals(BigNum.ZERO, ctx))
                return BigNum.round(sum, context);
            term = term1;
            n = n.add(BigNum.ONE);
        }
    };
    BigNum.exp = function (x, context) {
        if (context === void 0) { context = BigNum.MODE; }
        var ctx = {
            precision: 2 * context.precision,
            rounding: context.rounding
        };
        var sum = BigNum.ZERO;
        var term = BigNum.ONE;
        var n = BigNum.ZERO;
        while (true) {
            sum = sum.add(term, ctx);
            var term1 = term.mul(x, ctx).div(n.add(BigNum.ONE), ctx);
            if (BigNum.abs(term1).equals(BigNum.ZERO, ctx))
                return BigNum.round(sum, context);
            term = term1;
            n = n.add(BigNum.ONE);
        }
    };
    /**
     * Evaluates the natural logarithm of a given number `x` (`|x| < 1`).
     * @param x A number.
     * @param context The context settings to use.
     * @ignore
     */
    BigNum.ln_less = function (x, context) {
        if (context === void 0) { context = BigNum.MODE; }
        var ctx = {
            precision: 2 * context.precision,
            rounding: context.rounding
        };
        var sum = BigNum.ZERO;
        var term = x;
        var n = BigNum.ONE;
        while (true) {
            sum = sum.add(term.div(n, ctx), ctx);
            var term1 = term.mul(x, ctx).neg;
            var term2 = term1.div(n.add(BigNum.ONE, ctx), ctx);
            if (BigNum.abs(term2).equals(BigNum.ZERO, ctx))
                return BigNum.round(sum, context);
            term = term1;
            n = n.add(BigNum.ONE);
        }
    };
    BigNum.ln = function (x, context) {
        if (context === void 0) { context = BigNum.MODE; }
        var ctx = {
            precision: 2 * context.precision,
            rounding: context.rounding
        };
        if (x.lessEquals(BigNum.ZERO))
            throw "Undefined";
        if (x.lessThan(BigNum.TWO))
            return BigNum.round(BigNum.ln_less(x.sub(BigNum.ONE, ctx), ctx), context);
        return BigNum.round(newton_raphson(function (y) { return BigNum.exp(y, ctx).sub(x, ctx); }, function (y) { return BigNum.exp(y, ctx); }, BigNum.ONE, ctx), context);
    };
    BigNum.log = function (x, context) {
        if (context === void 0) { context = BigNum.MODE; }
        var ctx = {
            precision: 2 * context.precision,
            rounding: context.rounding
        };
        var y = BigNum.ln(x, ctx).div(BigNum.ln10, ctx);
        return BigNum.round(y, context);
    };
    /**
     * The canonical representation of the number as a string.
     * @returns The string representation of `this`.
     */
    BigNum.prototype.toString = function () {
        var s = "";
        if (this.integer === "-" && this.decimal === "")
            s = "0.0";
        else if (this.integer === "-")
            s = "-0." + this.decimal;
        else
            s = (this.integer || "0") + "." + (this.decimal || "0");
        return s;
    };
    /**
     * The circle constant PI correct upto 100 decimal places.
     *
     * Source: http://paulbourke.net/miscellaneous/numbers/
     */
    BigNum.PI = new BigNum("3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679");
    /**
     * The constant Euler's number correct upto 100 decimal places.
     *
     * Source: http://paulbourke.net/miscellaneous/numbers/
     */
    BigNum.E = new BigNum("2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274");
    /**
     * The natural logarithm of 10 correct upto 100 decimal places. This comes
     * in vary handy for natural base to common base logarithm.
     *
     * Source: http://paulbourke.net/miscellaneous/numbers/
     */
    BigNum.ln10 = new BigNum("2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983");
    /**
     * The constant zero.
     */
    BigNum.ZERO = new BigNum("0");
    /**
     * The constant one.
     */
    BigNum.ONE = new BigNum("1");
    /**
     * The constant two.
     */
    BigNum.TWO = new BigNum("2");
    /**
     * The constant three.
     */
    BigNum.THREE = new BigNum("3");
    /**
     * The constant four.
     */
    BigNum.FOUR = new BigNum("4");
    /**
     * The constant five.
     */
    BigNum.FIVE = new BigNum("5");
    /**
     * The constant six.
     */
    BigNum.SIX = new BigNum("6");
    /**
     * The constant seven.
     */
    BigNum.SEVEN = new BigNum("7");
    /**
     * The constant eight.
     */
    BigNum.EIGHT = new BigNum("8");
    /**
     * The constant nine.
     */
    BigNum.NINE = new BigNum("9");
    /**
     * The default [[MathContext]] used for numerical operations related to [[BigNum]]
     * when a context has not been mentioned separately. Reassign this value
     * if you want to have all subsequent operations in some [[MathContext]]
     * other than [[MathContext.DEFAULT_CONTEXT]].
     */
    BigNum.MODE = MathContext.DEFAULT_CONTEXT;
    return BigNum;
}());
exports.BigNum = BigNum;
/**
 * Uses the Newton-Raphson algorithm to find the root of a given equation.
 * The exact derivative (found analytically) is assumed to be known.
 * @param f Function whose root is to be found
 * @param f_ The derivative of `f`.
 * @param x The initial trial solution.
 * @returns The root of the given function `f` correct upto the number of decimal
 * 			places specified by the default [[MathContext]].
 * @ignore
 */
function newton_raphson(f, f_, x, context) {
    if (context === void 0) { context = BigNum.MODE; }
    var ctx = {
        precision: 2 * context.precision,
        rounding: context.rounding
    };
    var X = x;
    var Y;
    while (true) {
        if (f(X).equals(BigNum.ZERO, ctx))
            return BigNum.round(X, context);
        Y = new BigNum(X.toString());
        X = X.sub(f(X).div(f_(X), ctx), ctx);
        if (X.equals(Y, ctx))
            return BigNum.round(X, context);
    }
}
function trimZeroes(s, pos) {
    var i;
    if (pos === "end") {
        for (i = s.length - 1; i >= 0; i--)
            if (s.charAt(i) !== '0')
                break;
        return s.substring(0, i + 1);
    }
    for (i = 0; i < s.length; i++)
        if (s.charAt(i) !== '0')
            break;
    return s.substring(i);
}
function isInteger(s, positive) {
    if (positive === void 0) { positive = false; }
    var valids = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var ch = s.charAt(0);
    var st = positive ? (ch === '+' ? s.substring(1) : s) : ((ch === '+' || ch === '-') ? s.substring(1) : s);
    for (var _i = 0, st_1 = st; _i < st_1.length; _i++) {
        var x = st_1[_i];
        if (!(x in valids))
            return false;
    }
    return true;
}
function isDecimal(s) {
    var parts = s.split('.');
    if (parts.length > 2)
        return false;
    return parts.length === 1 ? isInteger(parts[0]) : isInteger(parts[0]) && isInteger(parts[1], true);
}
function isValid(s) {
    if (s.indexOf('e') > -1) {
        // The number is in scientific mode
        // Me-E
        // M is the mantissa and E is the exponent with base 10
        var i = s.indexOf('e');
        var mantissa = s.substring(0, i), exponent = s.substring(i + 1);
        return isDecimal(mantissa) && isInteger(exponent);
    }
    return isDecimal(s);
}

},{"../errors":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var math_1 = require("./math");
/** The negative value of its argument. */
exports.neg = math_1.math.neg;
/** The trigonometric sine function. */
exports.sin = math_1.math.sin;
/** The trigonometric cosine function. */
exports.cos = math_1.math.cos;
/** The trigonometric tangent function. */
exports.tan = math_1.math.tan;
/** The inverse trigonometric sine function. */
exports.asin = math_1.math.asin;
/** The inverse trigonometric cosine function. */
exports.acos = math_1.math.acos;
/** The inverse trigonometric tangent function. */
exports.atan = math_1.math.atan;
/** The hyperbolic sine function. */
exports.sinh = math_1.math.sinh;
/** The hyperbolic cosine function. */
exports.cosh = math_1.math.cosh;
/** The hyperbolic tangent function. */
exports.tanh = math_1.math.tanh;
/** The inverse hyperbolic sine function. */
exports.asinh = math_1.math.asinh;
/** The inverse hyperbolic cosine function. */
exports.acosh = math_1.math.acosh;
/** The inverse hyperbolic tangent function. */
exports.atanh = math_1.math.atanh;
/** The common logarithm function (to the base 10). */
exports.log = math_1.math.log;
/** The natural logarithm function (to the base `e`). */
exports.ln = math_1.math.ln;
/** The exponentiation function. */
exports.exp = math_1.math.exp;
/** The square root function. */
exports.sqrt = math_1.math.sqrt;
/** The absolute value function. */
exports.abs = math_1.math.abs;
/** The greatest integer function. */
exports.floor = math_1.math.floor;
/** The smallest integer function. */
exports.ceil = math_1.math.ceil;

},{"./math":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scalar_1 = require("../../scalar");
var unary_1 = require("../operators/unary");
/**
 * @ignore
 */
var math = /** @class */ (function () {
    function math() {
    }
    math.neg = function (x) {
        if (typeof x === "number")
            return -x;
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(-x.value);
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.NEG, x);
    };
    math.sin = function (x) {
        if (typeof x === "number")
            return Math.sin(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.sin(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.SIN, x);
    };
    math.cos = function (x) {
        if (typeof x === "number")
            return Math.cos(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.cos(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.COS, x);
    };
    math.tan = function (x) {
        if (typeof x === "number")
            return Math.tan(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.tan(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.TAN, x);
    };
    math.asin = function (x) {
        if (typeof x === "number")
            return Math.asin(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.asin(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.ASIN, x);
    };
    math.acos = function (x) {
        if (typeof x === "number")
            return Math.acos(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.acos(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.ACOS, x);
    };
    math.atan = function (x) {
        if (typeof x === "number")
            return Math.atan(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.atan(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.ATAN, x);
    };
    math.sinh = function (x) {
        if (typeof x === "number")
            return Math.sinh(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.sinh(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.SINH, x);
    };
    math.cosh = function (x) {
        if (typeof x === "number")
            return Math.cosh(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.cosh(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.COSH, x);
    };
    math.tanh = function (x) {
        if (typeof x === "number")
            return Math.tanh(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.tanh(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.TANH, x);
    };
    math.asinh = function (x) {
        if (typeof x === "number")
            return Math.asinh(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.asinh(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.ASINH, x);
    };
    math.acosh = function (x) {
        if (typeof x === "number")
            return Math.acosh(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.acosh(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.ACOSH, x);
    };
    math.atanh = function (x) {
        if (typeof x === "number")
            return Math.atanh(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.atanh(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.ATANH, x);
    };
    math.log = function (x) {
        if (typeof x === "number")
            return Math.log10(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.log10(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.LOG, x);
    };
    math.ln = function (x) {
        if (typeof x === "number")
            return Math.log(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.log(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.LN, x);
    };
    math.exp = function (x) {
        if (typeof x === "number")
            return Math.exp(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.exp(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.EXP, x);
    };
    math.sqrt = function (x) {
        if (typeof x === "number")
            return Math.sqrt(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.sqrt(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.SQRT, x);
    };
    math.abs = function (x) {
        if (typeof x === "number")
            return Math.abs(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.abs(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.ABS, x);
    };
    math.floor = function (x) {
        if (typeof x === "number")
            return Math.floor(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.floor(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.FLOOR, x);
    };
    math.ceil = function (x) {
        if (typeof x === "number")
            return Math.ceil(x);
        if (x instanceof scalar_1.Scalar.Constant)
            return scalar_1.Scalar.constant(Math.ceil(x.value));
        if (x instanceof scalar_1.Scalar.Variable || x instanceof scalar_1.Scalar.Expression)
            return new scalar_1.Scalar.Expression(unary_1.UnaryOperator.CEIL, x);
    };
    return math;
}());
exports.math = math;

},{"../../scalar":12,"../operators/unary":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents any kind of operator that has a left hand operand and a right hand operand.
 */
var BinaryOperator;
(function (BinaryOperator) {
    /** The operator for adding two values. */
    BinaryOperator["ADD"] = "add";
    /** The operator for subtracting one value from another. */
    BinaryOperator["SUB"] = "sub";
    /** The operator for multiplying two values. */
    BinaryOperator["MUL"] = "mul";
    /** The operator for dividing one value by another. */
    BinaryOperator["DIV"] = "div";
    /** The operator for raising a base to an exponent. */
    BinaryOperator["POW"] = "pow";
    /** The operator for evaluating dot (scalar) product of two vectors. */
    BinaryOperator["DOT"] = "dot";
    /** The operator for evaluating cross (vector) product of two vectors. */
    BinaryOperator["CROSS"] = "cross";
    /** The operator to evaluate magnitude of a vector. */
    BinaryOperator["MAG"] = "mag";
    /** The operator to scale a vector. */
    BinaryOperator["SCALE"] = "scale";
    /** The operator to evaluate the unit vector along a given vector. */
    BinaryOperator["UNIT"] = "unit";
})(BinaryOperator = exports.BinaryOperator || (exports.BinaryOperator = {}));
/**
 * Checks whether the passed string has been defined as a BinaryOperator.
 */
function isBinaryOperator(s) {
    for (var k in BinaryOperator)
        if (BinaryOperator[k] === s)
            return true;
    return false;
}
exports.isBinaryOperator = isBinaryOperator;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents any kind of operator that only takes one operand to operate on.
 */
var UnaryOperator;
(function (UnaryOperator) {
    /** Represents the negative of a scalar. */
    UnaryOperator["NEG"] = "neg";
    /** Represents the trigonometric sine function. */
    UnaryOperator["SIN"] = "sin";
    /** Represents the trigonometric cosine function. */
    UnaryOperator["COS"] = "cos";
    /** Represents the trigonometric tangent function. */
    UnaryOperator["TAN"] = "tan";
    /** Represents the inverse trigonometric sine function. */
    UnaryOperator["ASIN"] = "asin";
    /** Represents the inverse trigonometric cosine function. */
    UnaryOperator["ACOS"] = "acos";
    /** Represents the inverse trigonometric tangent function. */
    UnaryOperator["ATAN"] = "atan";
    /** Represents the hyperbolic sine function. */
    UnaryOperator["SINH"] = "sinh";
    /** Represents the hyperbolic cosine function. */
    UnaryOperator["COSH"] = "cosh";
    /** Represents the hyperbolic tangent function. */
    UnaryOperator["TANH"] = "tanh";
    /** Represents the inverse hyperbolic sine function. */
    UnaryOperator["ASINH"] = "asinh";
    /** Represents the inverse hyperbolic cosine function. */
    UnaryOperator["ACOSH"] = "acosh";
    /** Represents the inverse hyperbolic tangent function. */
    UnaryOperator["ATANH"] = "atanh";
    /** Represents the common logarithm function (to the base 10). */
    UnaryOperator["LOG"] = "log";
    /** Represents the natural logarithm function (to the base `e`). */
    UnaryOperator["LN"] = "ln";
    /** Represents the exponentiation function. */
    UnaryOperator["EXP"] = "exp";
    /** Represents the square root function. */
    UnaryOperator["SQRT"] = "sqrt";
    /** Represents the absolute value function. */
    UnaryOperator["ABS"] = "abs";
    /** Represents the greatest integer function. */
    UnaryOperator["FLOOR"] = "floor";
    /** Represents the least integer function. */
    UnaryOperator["CEIL"] = "ceil";
})(UnaryOperator = exports.UnaryOperator || (exports.UnaryOperator = {}));
/**
 * Checks whether the passed string has been defined as a UnaryOperator.
 */
function isUnaryOperator(s) {
    for (var k in UnaryOperator)
        if (UnaryOperator[k] === s)
            return true;
    return false;
}
exports.isUnaryOperator = isUnaryOperator;

},{}],10:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./matrix"));
__export(require("./vector"));
__export(require("./scalar"));
__export(require("./core/definitions"));
__export(require("./core/expression"));
__export(require("./core/operators/binary"));
__export(require("./core/operators/unary"));
__export(require("./core/math/functions"));
__export(require("./core/math/bignum"));
__export(require("./core/errors"));
__export(require("./core/interval"));

},{"./core/definitions":1,"./core/errors":2,"./core/expression":3,"./core/interval":4,"./core/math/bignum":5,"./core/math/functions":6,"./core/operators/binary":8,"./core/operators/unary":9,"./matrix":11,"./scalar":12,"./vector":13}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidMatrix(matrix2x2) {
    var row = matrix2x2.length;
    var col = matrix2x2[0].length;
    for (var i = 0; i < row; i++) {
        if (matrix2x2[i].length !== col)
            return false;
        if (!matrix2x2[i].every(function (x) { return typeof x === "number"; }))
            return false;
        matrix2x2[i] = matrix2x2[i].map(function (x) { return Object.is(x, -0) ? 0 : x; });
    }
    return true;
}
/**
 * @classdesc Works with any n x m dimensional array.
 */
var Matrix = /** @class */ (function () {
    function Matrix(a, b, c) {
        if (typeof a === "number" && typeof b === "number") {
            this.row = a;
            this.col = b;
            this.elements = new Array(a).fill(0).map(function (_) { return new Array(b).fill(c ? c : 0); });
        }
        else if (a instanceof Array) {
            if (!isValidMatrix(a))
                throw "Illegal values in matrix.";
            this.elements = a.map(function (r) { return r.slice(); });
            this.row = this.elements.length;
            this.col = this.elements[0].length;
        }
        else
            throw "Illegal initialisation of matrix.";
    }
    /**
     * @return An exact copy of this matrix object.
     */
    Matrix.prototype.copy = function () {
        return new Matrix(this.elements);
    };
    Object.defineProperty(Matrix.prototype, "data", {
        get: function () {
            var self = this;
            function dataAt(i, j) { return j !== undefined ? self.elements[i][j] : self.elements[i]; }
            return dataAt;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds two matrices algebraically.
     * @param that Matrix to add to this matrix.
     * @return The matrix sum of the two matrices.
     * @throws If the orders of the matrices do not match.
     */
    Matrix.prototype.add = function (that) {
        return Matrix.add(this, that);
    };
    /**
     * Subtracts one matrix from another algebraically.
     * @param that Matrix to subtract from this matrix.
     * @return The matrix difference of the two matrices.
     * @throws If the orders of the matrices do not match.
     */
    Matrix.prototype.sub = function (that) {
        return Matrix.sub(this, that);
    };
    /**
     * Multiplies two matrices. The number of columns of `this` matrix must be
     * equal to the number of rows of `that` matrix. The resulting matrix has
     * the same number of rows as `this` matrix and the same number of columns as `that` matrix.
     * @param that Matrix with which to multiply.
     * @return The matrix product of the two matrices.
     */
    Matrix.prototype.mul = function (that) {
        return Matrix.mul(this, that);
    };
    /**
     * Scales this matrix by a given scale factor. Scaling implies
     * multiplying each element of this matrix by some scale factor `k`
     * @param k The scale factor.
     */
    Matrix.prototype.scale = function (k) {
        var _this = this;
        return new Matrix(new Array(this.row).fill(0).map(function (_, i) { return new Array(_this.col).fill(0).map(function (_, j) { return _this.elements[i][j] * k; }); }));
    };
    /**
     * Creates a new matrix of rank one less than `this` matrix's rank.
     * Creates the new matrix by eliminating the elements in row `i` and column `j`.
     * @param i Row index of element.
     * @param j Column element of element.
     */
    Matrix.prototype.minor_matrix = function (i, j) {
        var cf = new Matrix(this.row - 1, this.col - 1);
        for (var y = 0, Y = 0; y < this.row; y++)
            for (var x = 0, X = 0; x < this.col; x++) {
                if (!(x === j || y === i))
                    cf.elements[Y][X++] = this.elements[y][x];
                if (X >= cf.col) {
                    X = 0;
                    Y++;
                }
            }
        return cf;
    };
    /**
     * Calculates the minor of an element in the matrix given by its row and column.
     * @param i Row index of element.
     * @param j Column index of element,
     */
    Matrix.prototype.minor = function (i, j) { return Matrix.det(this.minor_matrix(i, j)); };
    /**
     * Calculates the cofactor of an element in the matrix given by its row and column.
     * @param i Row index of element.
     * @param j Column index of element,
     */
    Matrix.prototype.cofactor = function (i, j) { return Math.pow(-1, i + j) * this.minor(i, j); };
    /**
     * Calculates the inverse of the given matrix.
     * @throws If `Matrix.det(this) == 0`
     */
    Matrix.prototype.inv = function () {
        var det = Matrix.det(this);
        if (det === 0)
            throw "Inverse not defined for singular matrix.";
        return Matrix.adjoint(this).scale(1 / det);
    };
    /**
     * Creates and returns a unit matrix with `dim` rows and columns.
     * @param dim Dimension of the desired matrix
     */
    Matrix.unit = function (dim) {
        return new Matrix(new Array(dim).fill(0).map(function (_, i) { return new Array(dim).fill(0).map(function (_, j) { return (i === j) ? 1 : 0; }); }));
    };
    /**
     * Calculates the cofactors of each element in some matrix `A` and stores them
     * in their corresponding indices in the form of another matrix.
     * @param A
     */
    Matrix.comatrix = function (A) {
        return new Matrix(A.elements.map(function (row, i) { return row.map(function (_, j) { return A.cofactor(i, j); }); }));
    };
    /**
     * Calculates the adjoint of some matrix `A`.
     * @param A
     */
    Matrix.adjoint = function (A) { return Matrix.transpose(Matrix.comatrix(A)); };
    /**
     * Computes the transpose of some matrix `A`.
     * @param A
     */
    Matrix.transpose = function (A) {
        var T = new Matrix(A.col, A.row);
        for (var i = 0; i < T.row; i++)
            for (var j = 0; j < T.col; j++)
                T.elements[i][j] = A.elements[j][i];
        return T;
    };
    /**
     * Computes the determinant value of some matrix `A`.
     * @param A
     */
    Matrix.det = function (A) {
        if (A.row !== A.col)
            throw "Determinant defined only for square matrices.";
        var dim = A.row;
        if (dim === 1)
            return A.elements[0][0];
        var s = 0;
        for (var i = 0; i < dim; i++)
            s += A.elements[0][i] * A.cofactor(0, i);
        return s;
    };
    /**
     * Performs matrix addition on given matrices `A` and `B`.
     * @param A
     * @param B
     */
    Matrix.add = function (A, B) {
        if (A.row !== B.row || A.col !== B.col)
            throw "Addition defined only for matrices of same order.";
        return new Matrix(new Array(A.row).fill(0).map(function (_, i) { return new Array(B.col).fill(0).map(function (_, j) { return A.elements[i][j] + B.elements[i][j]; }); }));
    };
    /**
     * Performs matrix subtraction on given matrices `A` and `B`.
     * @param A
     * @param B
     */
    Matrix.sub = function (A, B) {
        if (A.row !== B.row || A.col !== B.col)
            throw "Subtraction defined only for matrices of same order.";
        return new Matrix(new Array(A.row).fill(0).map(function (_, i) { return new Array(B.col).fill(0).map(function (_, j) { return A.elements[i][j] - B.elements[i][j]; }); }));
    };
    /**
     * Performs matrix multiplication on given matrices `A` and `B`.
     * @param A
     * @param B
     * @throws If `A.col != B.row`
     */
    Matrix.mul = function (A, B) {
        if (A.col !== B.row)
            throw "Multiplication not defined.";
        var r = A.row;
        var c = B.col;
        var p = A.col;
        var C = new Array(r).fill(0).map(function (_, i) { return new Array(c).fill(0).map(function (_, j) {
            var sum = 0;
            for (var k = 0; k < p; k++)
                sum += A.elements[i][k] * B.elements[k][j];
            return sum;
        }); });
        return new Matrix(C);
    };
    return Matrix;
}());
exports.Matrix = Matrix;

},{}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var definitions_1 = require("./core/definitions");
var binary_1 = require("./core/operators/binary");
var expression_1 = require("./core/expression");
var vector_1 = require("./vector");
var errors_1 = require("./core/errors");
/**
 * Base class to works with scalar quantities.
 * @abstract
 */
var Scalar = /** @class */ (function () {
    function Scalar() {
        this.quantity = "scalar";
    }
    return Scalar;
}());
exports.Scalar = Scalar;
/**
 * @namespace
 */
(function (Scalar) {
    /**
     * A mapping from name of scalar variables to [[Scalar.Variable]] objects.
     * @ignore
     */
    var VARIABLES = new Map();
    /**
     * A mapping from numerical constants to [[Scalar.Constant]] objects.
     * @ignore
     */
    var CONSTANTS = new Map();
    /**
     * A mapping from named scalar constants to [[Scalar.Constant]] objects.
     * @ignore
     */
    var NAMED_CONSTANTS = new Map();
    /**
     * Represents a constant scalar quantity with a fixed value.
     * @extends [[Scalar]]
     */
    var Constant = /** @class */ (function (_super) {
        __extends(Constant, _super);
        /**
         * Creates a [[Scalar.Constant]] object from number.
         * One may optionally pass in a string by which `this` object
         * may be identified by.
         *
         * Using the contructor directly for creating vector objects is
         * not recommended.
         *
         * @see [[Scalar.constant]]
         * @param value The fixed value `this` should represent.
         * @param name The name by which `this` is identified.
         */
        function Constant(value, name) {
            if (name === void 0) { name = ""; }
            var _this = _super.call(this) || this;
            _this.value = value;
            _this.name = name;
            _this.type = "constant";
            return _this;
        }
        Constant.prototype.equals = function (that, tolerance) {
            return Math.abs(this.value - that.value) < (tolerance || 1e-14);
        };
        Constant.prototype.add = function (that) {
            if (that instanceof Scalar.Constant)
                return Scalar.constant(this.value + that.value);
            return new Scalar.Expression(binary_1.BinaryOperator.ADD, this, that);
        };
        Constant.prototype.sub = function (that) {
            if (that instanceof Scalar.Constant)
                return Scalar.constant(this.value - that.value);
            return new Scalar.Expression(binary_1.BinaryOperator.SUB, this, that);
        };
        Constant.prototype.mul = function (that) {
            var _this = this;
            if (that instanceof Scalar) {
                if (that instanceof Scalar.Constant)
                    return Scalar.constant(this.value * that.value);
                return new Scalar.Expression(binary_1.BinaryOperator.MUL, this, that);
            }
            if (that instanceof vector_1.Vector.Constant)
                return new vector_1.Vector.Constant(that.value.map(function (x) { return _this.value * x.value; }));
            return new vector_1.Vector.Expression(binary_1.BinaryOperator.MUL, this, that, function (i) { return _this.mul(that.X(i)); });
        };
        Constant.prototype.div = function (that) {
            if (that instanceof Scalar.Constant) {
                if (that.equals(Scalar.ZERO))
                    throw new Error("Division by zero error");
                return Scalar.constant(this.value / that.value);
            }
            return new Scalar.Expression(binary_1.BinaryOperator.DIV, this, that);
        };
        Constant.prototype.pow = function (that) {
            if (that instanceof Scalar.Constant) {
                if (this.equals(Scalar.ZERO) && that.equals(Scalar.ZERO))
                    throw new errors_1.IndeterminateForm("0 raised to the power 0");
                return Scalar.constant(Math.pow(this.value, that.value));
            }
            return new Scalar.Expression(binary_1.BinaryOperator.POW, this, that);
        };
        return Constant;
    }(Scalar));
    Scalar.Constant = Constant;
    /**
     * Represents a variable scalar quantity with no fixed value.
     * @extends [[Scalar]]
     */
    var Variable = /** @class */ (function (_super) {
        __extends(Variable, _super);
        /**
         * Creates a [[Scalar.Variable]] object.
         *
         * Using the contructor directly for creating vector objects is
         * not recommended.
         *
         * @see [[Scalar.variable]]
         * @param name The name with which the [[Scalar.Variable]] is going to be identified.
         */
        function Variable(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.type = "variable";
            return _this;
        }
        /**
         * Creates and returns a [[Scalar.Expression]] for the addition of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * adding a variable scalar to another scalar always results in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for sum of `this` and `that`.
         */
        Variable.prototype.add = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.ADD, this, that);
        };
        /**
         * Creates and returns a [[Scalar.Expression]] for the subtraction of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * subtracting a variable scalar from another scalar always results in an expresion.
         * @param that The [[Scalar]] to add to `this`.
         * @return Expression for subtracting `that` from `this`.
         */
        Variable.prototype.sub = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.SUB, this, that);
        };
        Variable.prototype.mul = function (that) {
            var _this = this;
            if (that instanceof Scalar)
                return new Scalar.Expression(binary_1.BinaryOperator.MUL, this, that);
            return new vector_1.Vector.Expression(binary_1.BinaryOperator.MUL, this, that, function (i) { return _this.mul(that.X(i)); });
        };
        /**
         * Creates and returns a [[Scalar.Expression]] for the division of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * dividing a variable scalar by another scalar always results in an expresion.
         * @param that The [[Scalar]] to divide `this` by `this`.
         * @return Expression for dividing `this` by `that`.
         */
        Variable.prototype.div = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.DIV, this, that);
        };
        /**
         * Creates and returns a [[Scalar.Expression]] for exponentiation of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * exponentiating a scalar by a variable scalar always results in an expresion.
         * @param that The [[Scalar]] power to raise `this` to.
         * @return Expression for exponentiating `this` by `that`.
         */
        Variable.prototype.pow = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.POW, this, that);
        };
        return Variable;
    }(Scalar));
    Scalar.Variable = Variable;
    /**
     * @extends [[Scalar]]
     */
    var Expression = /** @class */ (function (_super) {
        __extends(Expression, _super);
        function Expression(op, a, b) {
            var _this = _super.call(this) || this;
            _this.op = op;
            _this.type = "expression";
            /** Array of `Evaluable` quantity/quantities `this.op` operates on. */
            _this.operands = [];
            _this.arg_list = expression_1.ExpressionBuilder.createArgList(a, b);
            _this.operands.push(a);
            if (b !== undefined)
                _this.operands.push(b);
            return _this;
        }
        Object.defineProperty(Expression.prototype, "lhs", {
            /**
             * The left hand side operand for `this.op`.
             * @throws If `this.op` is a `UnaryOperator`.
             */
            get: function () {
                if (this.operands.length === 2)
                    return this.operands[0];
                throw new Error("Unary operators have no left hand argument.");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Expression.prototype, "rhs", {
            /**
             * The right hand side operand for `this.op`.
             * @throws If `this.op` is a `UnaryOperator`.
             */
            get: function () {
                if (this.operands.length === 2)
                    return this.operands[1];
                throw new Error("Unary operators have no right hand argument.");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Expression.prototype, "arg", {
            /**
             * The argument for `this.op`.
             * @throws If `this.op` is a `BinaryOperator`.
             */
            get: function () {
                if (this.operands.length === 1)
                    return this.operands[0];
                throw new Error("Binary operators have two arguments.");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates and returns a [[Scalar.Expression]] for the addition of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * adding a unknown scalar/scalar expression to another scalar always results in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for sum of `this` and `that`.
         */
        Expression.prototype.add = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.ADD, this, that);
        };
        /**
         * Creates and returns a [[Scalar.Expression]] for the subtraction of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * subtracting a unknown scalar/scalar expression from another scalar always results in an expresion.
         * @param that The [[Scalar]] to add to `this`.
         * @return Expression for subtracting `that` from `this`.
         */
        Expression.prototype.sub = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.SUB, this, that);
        };
        Expression.prototype.mul = function (that) {
            var _this = this;
            if (that instanceof Scalar)
                return new Scalar.Expression(binary_1.BinaryOperator.MUL, this, that);
            return new vector_1.Vector.Expression(binary_1.BinaryOperator.MUL, this, that, function (i) { return _this.mul(that.X(i)); });
        };
        /**
         * Creates and returns a [[Scalar.Expression]] for the division of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * dividing a unknown scalar/scalar expression by another scalar always results in an expresion.
         * @param that The [[Scalar]] to divide `this` by `this`.
         * @return Expression for dividing `this` by `that`.
         */
        Expression.prototype.div = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.DIV, this, that);
        };
        /**
         * Creates and returns a [[Scalar.Expression]] for exponentiation of
         * two [[Scalar]] objects. The [[type]] of `this` does not matter because
         * exponentiating a scalar by a unknown scalar/scalar expression always results in an expresion.
         * @param that The [[Scalar]] power to raise `this` to.
         * @return Expression for exponentiating `this` by `that`.
         */
        Expression.prototype.pow = function (that) {
            return new Scalar.Expression(binary_1.BinaryOperator.POW, this, that);
        };
        /**
         * Checks whether `this` [[Scalar.Expression]] depends on a given
         * [[Variable]].
         * @param v The [[Variable]] to check against.
         */
        Expression.prototype.isFunctionOf = function (v) {
            return this.arg_list.has(v);
        };
        /**
         * Evaluates this [[Scalar.Expression]] at the given values for the
         * [[Variable]] objects `this` depends on. In case `this` is not a
         * function of any of the variables in the mapping then `this` is returned
         * as is.
         * @param values A map from the [[Variable]] quantities to [[Constant]] quantities.
         * @return The result after evaluating `this` at the given values.
         */
        Expression.prototype.at = function (values) {
            var res = expression_1.ExpressionBuilder.evaluateAt(this, values);
            if (definitions_1.isConstant(res))
                return res;
            if (definitions_1.isVariable(res))
                return res;
            return res;
        };
        return Expression;
    }(Scalar));
    Scalar.Expression = Expression;
    function constant(a, b) {
        var c;
        if (typeof a === "number") {
            if (b === undefined) {
                c = CONSTANTS.get(a);
                if (c === undefined) {
                    c = new Scalar.Constant(a);
                    CONSTANTS.set(a, c);
                }
            }
            else {
                c = NAMED_CONSTANTS.get(b);
                if (c !== undefined)
                    throw new errors_1.Overwrite(b);
                c = new Scalar.Constant(a, b);
                NAMED_CONSTANTS.set(b, c);
            }
        }
        else {
            c = NAMED_CONSTANTS.get(a);
            if (c === undefined)
                throw new Error("No such constant defined.");
        }
        return c;
    }
    Scalar.constant = constant;
    /**
     * Creates a new [[Scalar.Variable]] object if it has not been created before.
     * Otherwise just returns the previously created object.
     * @param value
     */
    function variable(name) {
        var v = VARIABLES.get(name);
        if (v === undefined) {
            v = new Scalar.Variable(name);
            VARIABLES.set(name, v);
        }
        return v;
    }
    Scalar.variable = variable;
    Scalar.ZERO = Scalar.constant(0);
})(Scalar = exports.Scalar || (exports.Scalar = {}));
exports.Scalar = Scalar;
/**
 * Represents the idea of infinity.
 */
exports.oo = Scalar.constant(Infinity);
/**
 * The irrational Euler's number. The derivative of the exponential function to
 * the base of this number gives the same exponential function.
 */
exports.e = Scalar.constant(Math.E);
/**
 * The circle constant pi. It is defined as the ratio of the circumference
 * of a circle to its diameter.
 */
exports.pi = Scalar.constant(Math.PI);
/**
 * The circle constant tau. It is defined as the ratio of the circumference
 * of a circle to its radius. It is twice the value of pi.
 */
exports.tau = Scalar.constant(2 * Math.PI);

},{"./core/definitions":1,"./core/errors":2,"./core/expression":3,"./core/operators/binary":8,"./vector":13}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var definitions_1 = require("./core/definitions");
var binary_1 = require("./core/operators/binary");
var unary_1 = require("./core/operators/unary");
var expression_1 = require("./core/expression");
var scalar_1 = require("./scalar");
var errors_1 = require("./core/errors");
/**
 * The double underscore.
 *
 * Represents any unknown value. When passed in along with other known values
 * this gets interpreted as an unknown or a [[Variable]].
 * @see [[Vector.variable]] for a use case example.
 */
exports.__ = undefined;
/**
 * Base class to work with vector quantities.
 * @abstract
 */
var Vector = /** @class */ (function () {
    function Vector() {
        this.quantity = "vector";
    }
    Vector.mag = function (A) {
        if (A instanceof Vector.Constant) {
            var m = 0;
            for (var i = 1; i <= A.value.length; i++)
                m += Math.pow(A.X(i).value, 2);
            return scalar_1.Scalar.constant(Math.sqrt(m));
        }
        return new scalar_1.Scalar.Expression(binary_1.BinaryOperator.MAG, Vector, A);
    };
    Vector.unit = function (A) {
        if (A instanceof Vector.Constant)
            return A.scale(scalar_1.Scalar.constant(1).div(Vector.mag(A)));
        var m = Vector.mag(A);
        return new Vector.Expression(binary_1.BinaryOperator.UNIT, Vector, A, function (i) { return A.X(i).div(m); });
    };
    return Vector;
}());
exports.Vector = Vector;
(function (Vector) {
    /**
     * A mapping from stringified vector constants to [[Vector.Constant]] objects.
     * @ignore
     */
    var CONSTANTS = new Map();
    /**
     * A mapping from named vector constants to [[Vector.Constant]] objects.
     * @ignore
     */
    var NAMED_CONSTANTS = new Map();
    /**
     * A mapping from name of vector variables to [[Vector.Variable]] objects.
     * @ignore
     */
    var VARIABLES = new Map();
    /**
     * @extends [[Vector]]
     */
    var Constant = /** @class */ (function (_super) {
        __extends(Constant, _super);
        function Constant(value, name) {
            if (name === void 0) { name = ""; }
            var _this = _super.call(this) || this;
            _this.type = "constant";
            _this.value = [];
            _this.name = name;
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var x = value_1[_i];
                if (x instanceof scalar_1.Scalar.Constant)
                    _this.value.push(x);
                else
                    _this.value.push(scalar_1.Scalar.constant(x));
            }
            _this.dimension = _this.value.length;
            return _this;
        }
        Object.defineProperty(Constant.prototype, "X", {
            /**
             * Returns the components of `this` vector. The index values start
             * from `1` instead of the commonly used starting index `0`.
             * @param i The index of the desired component.
             * @return The [[Scalar]] element at given index.
             */
            get: function () {
                var value = this.value;
                return function (i) {
                    if (i <= 0)
                        throw new errors_1.InvalidIndex(i, 0);
                    return (i <= value.length) ? value[i - 1] : scalar_1.Scalar.constant(0);
                };
            },
            enumerable: true,
            configurable: true
        });
        Constant.prototype.equals = function (that, tolerance) {
            if (tolerance === void 0) { tolerance = 1e-14; }
            var m = Math.max(this.value.length, that.value.length);
            for (var i = 1; i <= m; i++)
                if (Math.abs(this.X(i).value - that.X(i).value) >= tolerance)
                    return false;
            return true;
        };
        Constant.prototype.add = function (that) {
            var _this = this;
            if (that instanceof Vector.Constant) {
                var m = Math.max(this.value.length, that.value.length);
                var vec = [];
                for (var i = 1; i <= m; i++)
                    vec.push(this.X(i).value + that.X(i).value);
                return Vector.constant(vec);
            }
            return new Vector.Expression(binary_1.BinaryOperator.ADD, this, that, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).add(that.X(i));
            });
        };
        Constant.prototype.sub = function (that) {
            var _this = this;
            if (that instanceof Vector.Constant) {
                var m = Math.max(this.value.length, that.value.length);
                var vec = [];
                for (var i = 1; i <= m; i++)
                    vec.push(this.X(i).value - that.X(i).value);
                return Vector.constant(vec);
            }
            return new Vector.Expression(binary_1.BinaryOperator.SUB, this, that, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).sub(that.X(i));
            });
        };
        Constant.prototype.dot = function (that) {
            if (that instanceof Vector.Constant) {
                var parallel = 0;
                var m = Math.max(this.value.length, that.value.length);
                for (var i = 1; i <= m; i++)
                    parallel += this.X(i).value * that.X(i).value;
                return scalar_1.Scalar.constant(parallel);
            }
            return new scalar_1.Scalar.Expression(binary_1.BinaryOperator.DOT, this, that);
        };
        Constant.prototype.cross = function (that) {
            var _this = this;
            if (this.dimension > 3)
                throw new Error("Cross product defined only in 3 dimensions.");
            if (that instanceof Vector.Constant) {
                if (that.dimension > 3)
                    throw new Error("Cross product defined only in 3 dimensions.");
                var a1 = this.X(1).value, a2 = this.X(2).value, a3 = this.X(3).value;
                var b1 = that.X(1).value, b2 = that.X(2).value, b3 = that.X(3).value;
                return Vector.constant([
                    a2 * b3 - a3 * b2,
                    a3 * b1 - a1 * b3,
                    a1 * b2 - a2 * b1
                ]);
            }
            return new Vector.Expression(binary_1.BinaryOperator.CROSS, this, that, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                if (_this.value.length > 3)
                    throw new Error("Cross product defined only in 3 dimensions.");
                var a1 = _this.X(1), a2 = _this.X(2), a3 = _this.X(3);
                var b1 = that.X(1), b2 = that.X(2), b3 = that.X(3);
                return (i === 1) ? a2.mul(b3).sub(a3.mul(b2)) :
                    (i === 2) ? a3.mul(b1).sub(a1.mul(b3)) :
                        a1.mul(b2).sub(a2.mul(b1));
            });
        };
        Constant.prototype.scale = function (k) {
            var _this = this;
            if (k instanceof scalar_1.Scalar.Constant)
                return Vector.constant(this.value.map(function (x) { return k.mul(x).value; }));
            return new Vector.Expression(binary_1.BinaryOperator.SCALE, this, k, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).mul(k);
            });
        };
        return Constant;
    }(Vector));
    Vector.Constant = Constant;
    /**
     * @extends [[Vector]]
     */
    var Variable = /** @class */ (function (_super) {
        __extends(Variable, _super);
        function Variable(a, b) {
            var _this = _super.call(this) || this;
            _this.type = "variable";
            _this.value = [];
            _this.name = a;
            if (b !== undefined)
                _this.value = b;
            return _this;
        }
        Object.defineProperty(Variable.prototype, "X", {
            /**
             * Returns the components of `this` vector. The index values start
             * from `1` instead of the commonly used starting index `0`.
             * @param i The index of the desired component.
             * @return The [[Scalar]] element at given index.
             */
            get: function () {
                var self = this;
                return function (i) {
                    if (i <= 0)
                        throw new errors_1.InvalidIndex(i, 0);
                    if (self.value.length === 0)
                        return scalar_1.Scalar.variable(self.name + "_" + i);
                    return (i <= self.value.length) ? self.value[i - 1] : scalar_1.Scalar.constant(0);
                };
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates and returns a [[Vector.Expression]] for the addition of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * adding a variable vector to another vector always results in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for sum of `this` and `that`.
         */
        Variable.prototype.add = function (that) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.ADD, this, that, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).add(that.X(i));
            });
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the subtraction of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * subtracting a variable vector from another vector always results in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for subtracting `that` from `this`.
         */
        Variable.prototype.sub = function (that) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.SUB, this, that, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).sub(that.X(i));
            });
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the dot product of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * dot multiplying a variable vector with another vector always results
         * in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for inner product of `this` and `that`.
         */
        Variable.prototype.dot = function (that) {
            return new scalar_1.Scalar.Expression(binary_1.BinaryOperator.DOT, this, that);
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the cross product of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * cross multiplying a variable vector to another vector always results
         * in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for vector product of `this` and `that`.
         */
        Variable.prototype.cross = function (that) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.CROSS, this, that, function (i) {
                if (i <= 0)
                    throw new Error("Indexing starts from `1`.");
                if (_this.value.length > 3)
                    throw new Error("Cross product defined only in 3 dimensions.");
                var a1 = _this.X(1), a2 = _this.X(2), a3 = _this.X(3);
                var b1 = that.X(1), b2 = that.X(2), b3 = that.X(3);
                return (i === 1) ? a2.mul(b3).sub(a3.mul(b2)) :
                    (i === 2) ? a3.mul(b1).sub(a1.mul(b3)) :
                        a1.mul(b2).sub(a2.mul(b1));
            });
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the scaling of
         * `this` [[Vector]] object. The [[type]] of `that` does not matter because
         * scaling a variable vector always results in an expresion.
         * @param k The scale factor.
         * @return Expression for scaling `this`.
         */
        Variable.prototype.scale = function (k) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.SCALE, this, k, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).mul(k);
            });
        };
        return Variable;
    }(Vector));
    Vector.Variable = Variable;
    /**
     * @extends [[Vector]]
     */
    var Expression = /** @class */ (function (_super) {
        __extends(Expression, _super);
        function Expression(op, a, b, c) {
            var _this = _super.call(this) || this;
            _this.op = op;
            _this.type = "expression";
            _this.operands = [];
            if (b instanceof Function && c === undefined) {
                _this.X = b;
                _this.arg_list = expression_1.ExpressionBuilder.createArgList(a);
                _this.operands.push(a);
            }
            else if (!(b instanceof Function) && c instanceof Function) {
                _this.X = c;
                _this.arg_list = expression_1.ExpressionBuilder.createArgList(a, b);
                _this.operands.push(a, b);
            }
            else
                throw new Error("Illegal argument.");
            return _this;
        }
        Object.defineProperty(Expression.prototype, "lhs", {
            /**
             * The left hand side operand for `this.op`.
             * @throws If `this.op` is a `UnaryOperator`.
             */
            get: function () {
                if (binary_1.isBinaryOperator(this.op))
                    return this.operands[0];
                throw new Error("Unary operators have no left hand argument.");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Expression.prototype, "rhs", {
            /**
             * The right hand side operand for `this.op`.
             * @throws If `this.op` is a `UnaryOperator`.
             */
            get: function () {
                if (binary_1.isBinaryOperator(this.op))
                    return this.operands[1];
                throw new Error("Unary operators have no right hand argument.");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Expression.prototype, "arg", {
            /**
             * The argument for `this.op`.
             * @throws If `this.op` is a `BinaryOperator`.
             */
            get: function () {
                if (unary_1.isUnaryOperator(this.op))
                    return this.operands[0];
                throw new Error("Binary operators have two arguments.");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates and returns a [[Vector.Expression]] for the addition of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * adding an unknown vector/vector expression to another vector always
         * results in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for sum of `this` and `that`.
         */
        Expression.prototype.add = function (that) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.ADD, this, that, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).add(that.X(i));
            });
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the subtraction of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * subtracting an unknown vector/vector expression from another vector
         * always results in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for subtracting `that` from `this`.
         */
        Expression.prototype.sub = function (that) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.SUB, this, that, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).sub(that.X(i));
            });
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the dot product of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * dot multiplying an unknown vector/vector expression with another vector
         * always results
         * in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for inner product of `this` and `that`.
         */
        Expression.prototype.dot = function (that) {
            return new scalar_1.Scalar.Expression(binary_1.BinaryOperator.DOT, this, that);
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the cross product of
         * two [[Vector]] objects. The [[type]] of `that` does not matter because
         * cross multiplying an unknown vector/vector expression to another vector
         * always results
         * in an expresion.
         * @param that The [[Vector]] to add to `this`.
         * @return Expression for vector product of `this` and `that`.
         */
        Expression.prototype.cross = function (that) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.CROSS, this, that, function (i) {
                if (i <= 0)
                    throw new Error("Indexing starts from `1`.");
                // if(this.value.length > 3)
                // 	throw new Error("Cross product defined only in 3 dimensions.");
                var a1 = _this.X(1), a2 = _this.X(2), a3 = _this.X(3);
                var b1 = that.X(1), b2 = that.X(2), b3 = that.X(3);
                return (i === 1) ? a2.mul(b3).sub(a3.mul(b2)) :
                    (i === 2) ? a3.mul(b1).sub(a1.mul(b3)) :
                        a1.mul(b2).sub(a2.mul(b1));
            });
        };
        /**
         * Creates and returns a [[Vector.Expression]] for the scaling of
         * `this` [[Vector]] object. The [[type]] of `that` does not matter because
         * scaling an unknown vector/vector expression always results in an expresion.
         * @param k The scale factor.
         * @return Expression for scaling `this`.
         */
        Expression.prototype.scale = function (k) {
            var _this = this;
            return new Vector.Expression(binary_1.BinaryOperator.SCALE, this, k, function (i) {
                if (i <= 0)
                    throw new errors_1.InvalidIndex(i, 0);
                return _this.X(i).mul(k);
            });
        };
        /**
         * Checks whether `this` [[Vector.Expression]] depends on a given
         * [[Variable]].
         * @param v The [[Variable]] to check against.
         */
        Expression.prototype.isFunctionOf = function (v) {
            return this.arg_list.has(v);
        };
        /**
         * Evaluates this [[Vector.Expression]] at the given values for the
         * [[Variable]] objects `this` depends on. In case `this` is not a
         * function of any of the variables in the mapping then `this` is returned
         * as is.
         * @param values A map from the [[Variable]] quantities to [[Constant]] quantities.
         * @return The result after evaluating `this` at the given values.
         */
        Expression.prototype.at = function (values) {
            var res = expression_1.ExpressionBuilder.evaluateAt(this, values);
            if (definitions_1.isConstant(res))
                return res;
            if (definitions_1.isVariable(res))
                return res;
            return res;
        };
        return Expression;
    }(Vector));
    Vector.Expression = Expression;
    function constant(a, b) {
        var c;
        if (Array.isArray(a)) {
            var values = [];
            if (typeof a[0] === "number")
                for (var i_1 = 0; i_1 < a.length; i_1++)
                    values.push(a[i_1]);
            else if (a[0] instanceof scalar_1.Scalar.Constant)
                for (var i_2 = 0; i_2 < a.length; i_2++)
                    values.push(a[i_2].value);
            var i = values.length - 1;
            for (; i >= 0; i--)
                if (values[i] !== 0)
                    break;
            var key = values.slice(0, i + 1).join();
            if (b === undefined) {
                c = CONSTANTS.get(key);
                if (c === undefined) {
                    c = new Vector.Constant(values);
                    CONSTANTS.set(key, c);
                }
            }
            else {
                c = NAMED_CONSTANTS.get(b);
                if (c !== undefined)
                    throw new Error("Attempt to redefine a constant: A constant with the same name already exists.");
                c = new Vector.Constant(values, b);
                NAMED_CONSTANTS.set(b, c);
            }
        }
        else {
            c = NAMED_CONSTANTS.get(a);
            if (c === undefined)
                throw new Error("No such constant defined.");
        }
        return c;
    }
    Vector.constant = constant;
    function variable(name, value) {
        var v = VARIABLES.get(name);
        if (v === undefined) {
            if (value === undefined)
                v = new Vector.Variable(name);
            else {
                var arr = [];
                if (value !== undefined) {
                    var i = value.length - 1;
                    for (; i >= 0; i--)
                        if (value[i] !== scalar_1.Scalar.constant(0) || value[i] !== 0)
                            break;
                    for (var j = 0; j <= i; j++) {
                        var x = value[j];
                        if (x === undefined)
                            arr.push(scalar_1.Scalar.variable(name + "_" + (j + 1)));
                        else if (x instanceof scalar_1.Scalar.Constant)
                            arr.push(x);
                        else
                            arr.push(scalar_1.Scalar.constant(x));
                    }
                }
                v = new Vector.Variable(name, arr);
            }
            VARIABLES.set(name, v);
        }
        return v;
    }
    Vector.variable = variable;
})(Vector = exports.Vector || (exports.Vector = {}));
exports.Vector = Vector;

},{"./core/definitions":1,"./core/errors":2,"./core/expression":3,"./core/operators/binary":8,"./core/operators/unary":9,"./scalar":12}],14:[function(require,module,exports){
const mcalc = require("../build/index");

const keys = Object.keys(mcalc);
for(let i = 0; i < keys.length; i++)
	window[keys[i]] = mcalc[keys[i]];
},{"../build/index":10}]},{},[14]);
