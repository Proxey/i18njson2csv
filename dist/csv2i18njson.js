"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertToJSONs = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * @method convertToJSONs
 * @param inputFile {String}
 * @param outputDir {String}
 */
var convertToJSONs = exports.convertToJSONs = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFile, outputDir) {
        var buff, content, rows, files, firstRowCols, i, currentCol, outputMap, _i, key;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fs.readFileAsync(inputFile);

                    case 2:
                        buff = _context.sent;
                        content = buff.toString();
                        rows = void 0;

                        if (content.indexOf('\r\n') > -1) {
                            rows = content.split('\r\n');
                        } else if (content.indexOf('\r') > -1) {
                            rows = content.split('\r');
                        } else {
                            rows = content.split('\n');
                        }

                        if (!(rows.length < 1)) {
                            _context.next = 8;
                            break;
                        }

                        throw 'the file must contain at least 1 row';

                    case 8:
                        files = [];
                        firstRowCols = rows[0].split(';');

                        if (!(firstRowCols.length < 2)) {
                            _context.next = 12;
                            break;
                        }

                        throw 'the file must contain at least 2 columns';

                    case 12:
                        i = 1;

                    case 13:
                        if (!(i < firstRowCols.length)) {
                            _context.next = 26;
                            break;
                        }

                        currentCol = firstRowCols[i].trim();

                        currentCol = currentCol.substring(1, currentCol.length - 1);

                        if (!(currentCol.length === 0)) {
                            _context.next = 22;
                            break;
                        }

                        if (!(i === 1)) {
                            _context.next = 19;
                            break;
                        }

                        throw 'the file must contain at least 2 columns';

                    case 19:
                        return _context.abrupt("break", 26);

                    case 22:
                        files.push(currentCol);

                    case 23:
                        i++;
                        _context.next = 13;
                        break;

                    case 26:
                        outputMap = {};


                        for (_i = 0; _i < files.length; _i++) {
                            outputMap[files[_i]] = {};
                        }

                        //right here we remove the first line since it's the headline
                        rows.shift();
                        _underscore2.default.each(rows, function (row) {
                            for (var x = 0; x < files.length; x++) {
                                var base = outputMap[files[x]];
                                var rowParts = row.split(';');
                                setPath(base, rowParts[0].split('.'), rowParts[x + 1]);
                            }
                        });

                        _context.t0 = _regenerator2.default.keys(outputMap);

                    case 31:
                        if ((_context.t1 = _context.t0()).done) {
                            _context.next = 38;
                            break;
                        }

                        key = _context.t1.value;

                        console.log("writing to " + _path2.default.join(outputDir, "out_" + key));
                        _context.next = 36;
                        return fs.writeFileAsync(_path2.default.join(outputDir, "out_" + key), JSON.stringify(outputMap[key], null, 3));

                    case 36:
                        _context.next = 31;
                        break;

                    case 38:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function convertToJSONs(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = _bluebird2.default.promisifyAll(_fsExtra2.default);
/**
 * @param base {Object}
 * @param path {Array<String> }
 * @param value {String}
 */
var setPath = function setPath(base, path, value) {
    var current = path[0];
    if (path.length === 1) {
        if (typeof base[current] !== 'undefined') {
            throw 'trying to set value ' + value + ' to field ' + current + ' but it\'s not undefined';
        } else {
            base[current] = value.substring(1, value.length - 1);
        }
    } else if (path.length > 1) {
        if (typeof base[current] === 'undefined') {
            base[current] = {};
        } else if (typeof base[current] === 'string') {
            throw 'trying to create new object in field ' + current + ' but it\'s already a string';
        }
        path.shift();
        return setPath(base[current], path, value);
    } else {
        throw 'path must be longer than 0';
    }
};
//# sourceMappingURL=csv2i18njson.js.map
