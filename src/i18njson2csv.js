import Promise from "bluebird";
import _fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import _ from "underscore";

const fs = Promise.promisifyAll(_fs);

/**
 * @param obj {Object}
 * @param [base] {String}
 * @returns {Array<String>}
 */
let getKeysRecursive = (obj, base = '') => {
    let keys = [];
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            keys.push(`${base}${key}`);
        } else if (typeof obj[key] === 'object') {
            keys = keys.concat(getKeysRecursive(obj[key], `${base}${key}.`));
        } else {
            console.log(chalk.orange('unable to get keys for element ' + obj[key]));
        }
    }
    return keys;
};

/**
 * @param obj {Object}
 * @param path {Array}
 */
let getValueByPath = (obj, path) => {
    if (path.length > 0 && typeof obj === 'object') {
        let currentKey = path[0];
        if (path.length === 1 && typeof obj[currentKey] === 'string') {
            return obj[path[0]];
        } else if (path.length > 1 && typeof obj[currentKey] === 'object') {
            path.shift();
            return getValueByPath(obj[currentKey], path);
        } else {
            return null;
        }
    } else {
        return null;
    }
};


/**
 * @method convertToCSV
 * @param directory {String}
 * @param outputFile {String}
 */
export async function convertToCSV(directory, outputFile) {
    let files = _.filter(await fs.readdirAsync(directory), file => {
        return file.substr(-5) === '.json';
    });
    if (!files) {
        throw 'no json files found';
    }
    let allKeys = [];
    console.log(`Processing the following files: ${files.join(', ')}`);

    //a map containing all jsons (Key is filename, value is json)
    let jsonMap = {};

    //now we iterate over all files and get all available keys
    for (let i = 0; i < files.length; i++) {
        let json = await fs.readJsonAsync(path.join(directory, files[i]));
        jsonMap[files[i]] = json;
        allKeys = allKeys.concat(getKeysRecursive(json));
    }
    allKeys = _.uniq(allKeys);

    console.log(`Got a total of ${allKeys.length} unique entries`);

    let items = [];
    for (let i = 0; i < allKeys.length; i++) {
        let key = allKeys[i];
        let item = {key: allKeys[i], translations: []};
        for (let x = 0; x < files.length; x++) {
            let file = files[x];
            item.translations.push(getValueByPath(jsonMap[file], key.split('.')) || '');
        }
        items.push(item);
    }

    items.sort((a, b) => {
        if (a.key > b.key) return 1;
        if (a.key < b.key) return -1;
        return 0;
    });

    let csv = `key;${files.map(file => `"${file}"`).join(';')}`;
    _.each(items, item => {
        csv += `\r\n${item.key};${item.translations.map(translation => `"${translation}"`).join(';')}`;
    });

    await fs.writeFileAsync(outputFile, csv);

}