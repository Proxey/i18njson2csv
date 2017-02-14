"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertToCSV = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

/**
 * @method convertToCSV
 * @param directory {String}
 * @param outputFile {String}
 */
var convertToCSV = exports.convertToCSV = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(directory, outputFile) {
        var files, allKeys, jsonMap, i, json, items, _i, key, item, x, file, csv;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.t0 = _underscore2.default;
                        _context.next = 3;
                        return fs.readdirAsync(directory);

                    case 3:
                        _context.t1 = _context.sent;

                        _context.t2 = function (file) {
                            return file.substr(-5) === '.json';
                        };

                        files = _context.t0.filter.call(_context.t0, _context.t1, _context.t2);

                        if (files) {
                            _context.next = 8;
                            break;
                        }

                        throw 'no json files found';

                    case 8:
                        allKeys = [];

                        console.log(_chalk2.default.green("Processing the following files: " + files.join(', ')));

                        //a map containing all jsons (Key is filename, value is json)
                        jsonMap = {};

                        //now we iterate over all files and get all available keys

                        i = 0;

                    case 12:
                        if (!(i < files.length)) {
                            _context.next = 21;
                            break;
                        }

                        _context.next = 15;
                        return fs.readJsonAsync(_path2.default.join(directory, files[i]));

                    case 15:
                        json = _context.sent;

                        jsonMap[files[i]] = json;
                        allKeys = allKeys.concat(getKeysRecursive(json));

                    case 18:
                        i++;
                        _context.next = 12;
                        break;

                    case 21:
                        allKeys = _underscore2.default.uniq(allKeys);

                        console.log("Got a total of " + allKeys.length + " unique entries");

                        items = [];

                        for (_i = 0; _i < allKeys.length; _i++) {
                            key = allKeys[_i];
                            item = { key: allKeys[_i], translations: [] };

                            for (x = 0; x < files.length; x++) {
                                file = files[x];

                                item.translations.push(getValueByPath(jsonMap[file], key.split('.')) || '');
                            }
                            items.push(item);
                        }

                        items.sort(function (a, b) {
                            if (a.key > b.key) return 1;
                            if (a.key < b.key) return -1;
                            return 0;
                        });

                        csv = "key;" + files.map(function (file) {
                            return "\"" + file + "\"";
                        }).join(';');

                        _underscore2.default.each(items, function (item) {
                            csv += "\r\n" + item.key + ";" + item.translations.map(function (translation) {
                                return "\"" + translation + "\"";
                            }).join(';');
                        });

                        _context.next = 30;
                        return fs.writeFileAsync(outputFile, csv);

                    case 30:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function convertToCSV(_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = _bluebird2.default.promisifyAll(_fsExtra2.default);

/**
 * @param obj {Object}
 * @param [base] {String}
 * @returns {Array<String>}
 */
var getKeysRecursive = function getKeysRecursive(obj) {
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var keys = [];
    for (var key in obj) {
        if (typeof obj[key] === 'string') {
            keys.push("" + base + key);
        } else if ((0, _typeof3.default)(obj[key]) === 'object') {
            keys = keys.concat(getKeysRecursive(obj[key], "" + base + key + "."));
        } else {
            console.log(_chalk2.default.orange('unable to get keys for element ' + obj[key]));
        }
    }
    return keys;
};

/**
 * @param obj {Object}
 * @param path {Array}
 */
var getValueByPath = function getValueByPath(obj, path) {
    if (path.length > 0 && (typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj)) === 'object') {
        var currentKey = path[0];
        if (path.length === 1 && typeof obj[currentKey] === 'string') {
            return obj[path[0]];
        } else if (path.length > 1 && (0, _typeof3.default)(obj[currentKey]) === 'object') {
            path.shift();
            return getValueByPath(obj[currentKey], path);
        } else {
            return null;
        }
    } else {
        return null;
    }
};
//# sourceMappingURL=i18njson2csv.js.map
