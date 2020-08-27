import Renderer from './src/renderer';
import Parser from './src/parser';
import SapDocsFile from './src/sapDocsFile';

const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const sapDocsFile = new SapDocsFile(__dirname);

/*
fse.outputFile(path.join('mkdocs.yml'), 'site_name: MkLorum', (err: any) => {
  if (err) throw err;
});
*/

// sapdocs/help.sap.com/doc/abapdocu_740_index_htm/7.40/en-US/abaploop_at_itab.html
const $: CheerioStatic = sapDocsFile.load('7.4', 'abapread_table_key.html');
const parser = new Parser($, new Renderer());
const contents = parser.parse();

fse.outputFile(path.join(__dirname, './docs/7.4/abapread_table_key.md'), contents, (err: any) => {
  if (!err) return;
  process.stderr.write(chalk.red(err));
  process.exitCode = 1;
});

process.stdout.write(chalk.green('Success\n'));
