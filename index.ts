import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Parser from './src/parser';
import SapDocsFileLoader from './src/sapDocsFilesLoader';
import Renderer from './src/renderer';
import SapDocFile from './src/sapDocFile';
import Navigation from './src/navigation';

const args = process.argv.slice(2);
let DEBUG = false;

if (args[0] === '--debug') { DEBUG = true; }
// For debugging purposes, jsut change this to true
try {
  files.forEach((file) => {
    if (DEBUG) {
      if (file.name !== 'test'
      /*
        file.name !== 'abapread_table_key'
        && file.name !== 'abapmethods_general'
        && file.name !== 'abapappend'
        && file.name !== 'abapdata_options'
        && file.name !== 'abapread_table'
        */
      ) {
        return;
      }
    }

    process.stdout.write(`processing ${chalk.blue(file.path)} \n`);
    const parser = new Parser(file.cheerio, new Renderer());
    const contents = parser.parse();
    // parser.parseNavigation(root731);

    fse.outputFile(path.join(__dirname, `./docs/7.31/${file.name}.md`), contents, (err: any) => {
      if (!err) return;
      process.stderr.write(chalk.red(err));
      process.exitCode = 1;
    });
  });

  fse.copySync('base-mkdocs.yml', 'mkdocs.yml');
  process.stdout.write(chalk.green('Copied mkdocs.yml\n'));

  process.stdout.write(chalk.green('Success\n'));
} catch (err) {
  process.stderr.write(chalk.red(err));
}
