import Parser from './src/parser';
import SapDocsFile from './src/sapDocsFile';
import Renderer from './src/renderer';

const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

let sapDocsFile = new SapDocsFile(__dirname);

let cheerio$: CheerioStatic = sapDocsFile.load('7.4', 'abapread_table_key.html');
let parser = new Parser(cheerio$, new Renderer());
let contents = parser.parse();

fse.outputFile(path.join(__dirname, './docs/7.4/abapread_table_key.md'), contents, (err: any) => {
  if (!err) return;
  process.stderr.write(chalk.red(err));
  process.exitCode = 1;
});

sapDocsFile = new SapDocsFile(__dirname);
cheerio$ = sapDocsFile.load('7.4', 'abapdelete_dbtab.html');
parser = new Parser(cheerio$, new Renderer());
contents = parser.parse();

fse.outputFile(path.join(__dirname, './docs/7.4/abapdelete_dbtab.md'), contents, (err: any) => {
  if (!err) return;
  process.stderr.write(chalk.red(err));
  process.exitCode = 1;
});

/*
cheerio$ = sapDocsFile.load('7.4', 'abaploop_at_itab.html');
parser = new Parser(cheerio$, new Renderer());
contents = parser.parse();

fse.outputFile(path.join(__dirname, './docs/7.4/abapread_table_key.md'), contents, (err: any) => {
  if (!err) return;
  process.stderr.write(chalk.red(err));
  process.exitCode = 1;
});
*/

process.stdout.write(chalk.green('Success\n'));
