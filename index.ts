import Parser from './src/parser';
import SapDocsFileLoader from './src/sapDocsFilesLoader';
import Renderer from './src/renderer';
import SapDocFile from './src/sapDocFile';

const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const loader = new SapDocsFileLoader(__dirname);
const files: Array<SapDocFile> = loader.loadFiles('7.4');

files.forEach((file) => {
  process.stdout.write(`processing ${chalk.blue(file.path)} \n`);
  const parser = new Parser(file.cheerio, new Renderer());
  const contents = parser.parse();

  fse.outputFile(path.join(__dirname, `./docs/7.4/${file.name}.md`), contents, (err: any) => {
    if (!err) return;
    process.stderr.write(chalk.red(err));
    process.exitCode = 1;
  });
});

/*
fse.readdirSync(__dirname).forEach((file: string) => {
  console.log(file);
});

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

sapDocsFile = new SapDocsFile(__dirname);
cheerio$ = sapDocsFile.load('7.4', 'abapmove.html');
parser = new Parser(cheerio$, new Renderer());
contents = parser.parse();

fse.outputFile(path.join(__dirname, './docs/7.4/abapmove.md'), contents, (err: any) => {
  if (!err) return;
  process.stderr.write(chalk.red(err));
  process.exitCode = 1;
});

*/

process.stdout.write(chalk.green('Success\n'));
