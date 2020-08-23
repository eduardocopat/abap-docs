import SapDocsFile from './src/sapDocsFile';



const sapDocsFile = new SapDocsFile(__dirname);

const a = sapDocsFile.load('7.4', 'abapread_table_key.html');

console.log(a.html());
/*

cheerio.load(fs.readFileSync('path/to/file.html'));

const $ = cheerio.load('./sapdocs/help.sap.com/doc/abapdocu_740_index_htm/7.40/en-US/abapread_table_key.html');

console.log($.html());
*/

console.log('rodei');
