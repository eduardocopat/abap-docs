// import Highlighter from 'src/highlighter';

const os = require('os');

export default class Renderer {
    contents: Array<string>;

    constructor() {
      this.contents = [];
    }

    renderTitle(title: string) {
      this.contents.push(`# ${title}`);
      this.contents.push();
    }

    getContents() : string {
      return this.contents.join(os.EOL);
    }

    renderCodeBlock(code: string) {
      // this.contents.push(Highlighter.highlight(code));
    }
}
