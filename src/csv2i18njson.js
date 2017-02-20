import Promise from "bluebird";
import _fs from "fs-extra";
import _ from "underscore";
import path from "path";

const fs = Promise.promisifyAll(_fs);
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

/**
 * @method convertToJSONs
 * @param inputFile {String}
 * @param outputDir {String}
 */
export async function convertToJSONs(inputFile, outputDir) {
    let buff = await fs.readFileAsync(inputFile);
    let content = buff.toString();
    let rows;
    if (content.indexOf('\r\n') > -1) {
        rows = content.split('\r\n');
    } else if (content.indexOf('\r') > -1) {
        rows = content.split('\r');
    } else {
        rows = content.split('\n');
    }

    if (rows.length < 1) {
        throw 'the file must contain at least 1 row';
    }

    let files = [];


    let firstRowCols = rows[0].split(';');
    if (firstRowCols.length < 2) {
        throw 'the file must contain at least 2 columns';
    }
    for (let i = 1; i < firstRowCols.length; i++) {
        let currentCol = firstRowCols[i].trim();
        currentCol = currentCol.substring(1, currentCol.length - 1);
        if (currentCol.length === 0) {
            if (i === 1) {
                throw 'the file must contain at least 2 columns';
            }
            break;
        } else {
            files.push(currentCol);
        }
    }

    let outputMap = {

    };

    for(let i = 0; i < files.length; i++) {
        outputMap[files[i]] = {};
    }


    //right here we remove the first line since it's the headline
    rows.shift();
    _.each(rows, row => {
        for(let x = 0; x < files.length; x++) {
            let base = outputMap[files[x]];
            let rowParts = row.split(';');
            setPath(base, rowParts[0].split('.'), rowParts[x+1]);
        }
    });



    for(let key in outputMap) {
        console.log(`writing to ` + path.join(outputDir, `out_${key}`));
        await fs.writeFileAsync(path.join(outputDir, `out_${key}`), JSON.stringify(outputMap[key], null, 3));
    }
}