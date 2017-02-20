#!/usr/bin/env node
var program = require('commander');
var pkg = require('../package.json');
var convertToJSONs = require('../dist/csv2i18njson.js').convertToJSONs;
var chalk = require('chalk');
var path = require('path');

program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[options] <input csv file>')
    .parse(process.argv);


if (program.args.length) {
    var inFile = path.join(process.cwd(), program.args[0]);
    convertToJSONs(inFile, process.cwd()).then(() => {
        console.log(chalk.green('Finished'));
    }, e => {
        console.log(chalk.red(e));
    });
} else {
    program.help();
}