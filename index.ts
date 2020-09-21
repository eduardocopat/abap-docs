import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Parser from './src/parser';
import SapDocsFileLoader from './src/sapDocsFilesLoader';
import Renderer from './src/renderer';
import SapDocFile from './src/sapDocFile';

const args = process.argv.slice(2);
let DEBUG = false;
if (args[0] === '--debug') { DEBUG = true; }

const loader = new SapDocsFileLoader(__dirname);

const files: Array<SapDocFile> = [...loader.loadFiles('7.54'), ...loader.loadFiles('7.40'), ...loader.loadFiles('7.31')];

const parseFiles = function parseFiles(version: string) {
  // For debugging purposes, jsut change this to true
  try {
    files.forEach((file: SapDocFile) => {
      if (DEBUG) {
        if (file.name !== 'abapread_table_key'
          && file.name !== 'abapmethods_general'
          && file.name !== 'abapappend'
          && file.name !== 'abapdata_options'
          && file.name !== 'abapread_table'
        ) {
          return;
        }
      }
      if (file.version !== version) { return; }

      process.stdout.write(`processing ${chalk.blue(file.path)} \n`);
      const parser = new Parser(file, new Renderer(), files);
      const contents = parser.parse();

      fse.outputFile(path.join(__dirname, `./docs/${version}/${file.name}.md`), contents, (err: any) => {
        if (!err) return;
        process.stderr.write(chalk.red(err));
        process.exitCode = 1;
      });
    });
  } catch (err) {
    process.stderr.write(chalk.red(err));
  }
};

fse.emptyDirSync(path.join(__dirname, './docs/7.31'));
parseFiles('7.31');

fse.emptyDirSync(path.join(__dirname, './docs/7.40'));
parseFiles('7.40');

fse.emptyDirSync(path.join(__dirname, './docs/7.54'));
parseFiles('7.54');

try {
  fse.copySync('base-mkdocs.yml', 'mkdocs.yml');
  process.stdout.write(chalk.green('Copied mkdocs.yml\n'));

  fse.copySync('base-pages.yml', './docs/7.31/.pages');
  fse.copySync('base-pages.yml', './docs/7.40/.pages');
  fse.copySync('base-pages.yml', './docs/7.54/.pages');
  process.stdout.write(chalk.green('Copied .pages\n'));

  process.stdout.write(chalk.green('Success\n'));
} catch (err) {
  process.stderr.write(chalk.red(err));
}
