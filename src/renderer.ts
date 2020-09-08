// import Highlighter from './highlighter';

const os = require('os');

export default class Renderer {
  renderSyntaxBlock(elements: string[]) {
    this.contents.push('<pre><code class="abap hljs abap-docs-syntax-block">');

    // index starts at 1 so we skip header
    for (let index = 1; index < elements.length; index++) {
      this.contents.push(elements[index]);
    }
    this.contents.push('</code></pre>');
  }

  renderH3(text: string) {
    this.contents.push(`### ${text}`);
  }

  renderH2(text: string) {
    this.contents.push(`## ${text}`);
  }

  renderH4(text: string) {
    this.contents.push(`#### ${text}`);
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
    this.contents.push(`\`\`\`abap\n${code}\n\`\`\``);
  }

  renderText(text: string) {
    this.contents.push(text);
  }
}
