import SapDocsFile from './src/sapDocsFile';

const fse = require('fs-extra');
const path = require('path');

const sapDocsFile = new SapDocsFile(__dirname);

fse.outputFile(path.join('mkdocs.yml'), 'site_name: MkLorum', (err: any) => {
  if (err) throw err;
});

const $ = sapDocsFile.load('7.4', 'abapread_table_key.html');

const title = $('.h1')[0];

const theTitle = $(title).text(); // @TODO: remove newlines

fse.outputFile(path.join(__dirname, './docs/7.4/abapread_table_key.md'), `# ${theTitle}`, (err: any) => {
  if (err) return console.log(err);
  console.log('Hello World > helloworld.txt');
  return '';
});

console.log($.html());

console.log('executed');
