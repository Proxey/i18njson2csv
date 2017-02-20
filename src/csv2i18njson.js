import Promise from "bluebird";
import _fs from "fs-extra";
import _ from "underscore";
import path from "path";
import _parse from "csv-parse";

const fs = Promise.promisifyAll(_fs);
const parse = Promise.promisify(_parse);
/**
 * @param base {Object}
 * @param path {Array<String> }
 * @param value {String}
 */
let setPath = (base, path, value) => {
    let current = path[0];
    if (path.length === 1) {
        if (typeof base[current] !== 'undefined') {
            throw 'trying to set value ' + value + ' to field ' + current + ' but it\'s not undefined';
        } else {
            base[current] = value;
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

/**
 * @method convertToJSONs
 * @param inputFile {String}
 * @param outputDir {String}
 */
export async function convertToJSONs(inputFile, outputDir) {
    let buff = await fs.readFileAsync(inputFile);
    let content = buff.toString();
    let rows = await parse(content, {
        delimiter: ';'
    });

    if (rows.length < 1) {
        throw 'the file must contain at least 1 row';
    }

    let files = [];


    let firstRowCols = JSON.parse(JSON.stringify(rows[0]));
    if (firstRowCols.length < 2) {
        throw 'the file must contain at least 2 columns';
    }
    for (let i = 1; i < firstRowCols.length; i++) {
        let currentCol = firstRowCols[i].trim();
        if (currentCol.length === 0) {
            if (i === 1) {
                throw 'the file must contain at least 2 columns';
            }
            break;
        } else {
            files.push(currentCol);
        }
    }


    let outputMap = {};

    for (let i = 0; i < files.length; i++) {
        outputMap[files[i]] = {};
    }

    //right here we remove the first line since it's the headline
    rows.shift();
    _.each(rows, row => {
        for (let x = 0; x < files.length; x++) {
            let base = outputMap[files[x]];
            setPath(base, row[0].split('.'), row[x + 1]);
        }
    });


    for (let key in outputMap) {
        console.log(`writing to ` + path.join(outputDir, `out_${key}`));
        await fs.writeFileAsync(path.join(outputDir, `out_${key}`), JSON.stringify(outputMap[key], null, 3));
    }
}