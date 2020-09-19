import * as cheerio from 'cheerio';
import SapDocFile from './sapDocFile';

const fs = require('fs');
const fse = require('fs-extra');
const pathLib = require('path');
const chalk = require('chalk');

export default class SapDocsFilesLoader {
  path: string;

  constructor(path: string) {
    this.path = pathLib.join(path, 'sapdocs/help.sap.com/doc');

    // the process exit gracefully.
    if (!fs.existsSync(this.path)) {
      process.stderr.write(chalk.red('sapdocs folder not found'));
      process.exit(1);
    }
  }

  loadFiles(version: string): Array<SapDocFile> {
    const files: Array<SapDocFile> = [];

    let versionPath: string = '';

    switch (version) {
      case '7.54': {
        versionPath = '/abapdocu_754_index_htm/7.54/en-US';
        break;
      }
      case '7.40': {
        versionPath = '/abapdocu_740_index_htm/7.40/en-US';
        break;
      }
      case '7.31': {
        versionPath = '/abapdocu_731_index_htm/7.31/en-US';
        break;
      }
      default: {
        break;
      }
    }

    versionPath = pathLib.join(this.path, versionPath);

    fse.readdirSync(versionPath).forEach((file: string) => {
      const filename = file.split('.');
      const extension = filename.pop();
      if (extension === 'html') {
        const path: string = pathLib.join(versionPath, file);
        const name = filename.pop()!;
        files.push({
          version,
          path,
          name,
          cheerio: cheerio.load(fs.readFileSync(path)),
        });
      }
    });

    return files;
  }
}
