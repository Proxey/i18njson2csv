#!/usr/bin/env node
var program = require('commander');
var pkg = require('../package.json');
var convertToCSV = require('../dist/i18njson2csv.js').convertToCSV;
var chalk = require('chalk');
var path = require('path');

program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[options] <output csv file>')
    .parse(process.argv);


if (program.args.length) {
    var outFile = path.join(process.cwd(), program.args[0]);
    console.log(chalk.green('Output will be written to ' + outFile));
    convertToCSV(process.cwd(), outFile).then(() => {
        console.log(chalk.green('Finished'));
    }, e => {
        console.log(chalk.red(e));
    });
} else {
    program.help();
}