// import Highlighter from './highlighter';

const os = require('os');

export default class Renderer {
  renderH2(text: string) {
    this.contents.push(`## ${text}`);
  }

  contents: Array<string>;

  constructor() {
    this.contents = [];
  }

  renderTitle(text: string) {
    this.contents.push(`# ${text}`);
    this.contents.push();
  }

  getContents(): string {
    return this.contents.join(os.EOL);
  }

  renderCodeBlock(code: string) {
    this.contents.push(`\`\`\`abap\n${code}\`\`\``);
  }

  renderText(text: string) {
    this.contents.push(text);
  }
}
