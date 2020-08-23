import SapDocsFile from './src/sapDocsFile';

const sapDocsFile = new SapDocsFile(__dirname);

const a = sapDocsFile.load('7.4', 'abapread_table_key.html');

console.log(a.html());
console.log('rodei');
