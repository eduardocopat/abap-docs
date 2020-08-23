const cheerio = require('cheerio');
const fs = require('fs');
const pathLib = require('path');

export default class SapDocsFile {
  path: string;

  constructor(path: string) {
    this.path = pathLib.join(path, 'sapdocs');

    // the process exit gracefully.
    if (fs.existsSync(this.path)) {
      process.stdout.write('sapdocs folder not found');
      process.exitCode = 1;
    }
  }

  load(version: string, filename: string) {
    // 'C:\git\abap-docs\sapdocs\help.sap.com\doc\abapdocu_740_index_htm\7.40\en-US
    // C:\git\abap-docs\sapdocs\help.sap.com\doc\docabapdocu_740_index_htm\7.40\en-US\
    let versionPath;
    this.path = pathLib.join(this.path, '/help.sap.com/doc');

    switch (version) {
      case '7.4': {
        versionPath = '/abapdocu_740_index_htm/7.40';
        break;
      }
      default: {
        break;
      }
    }
    this.path = pathLib.join(this.path, versionPath, 'en-US', filename);

    return cheerio.load(fs.readFileSync(this.path));
  }
}
