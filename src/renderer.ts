// import Highlighter from './highlighter';

const os = require('os');

export default class Renderer {
  renderSyntaxBlock(elements: string[]) {
    const block: string[] = [];
    block.push('<pre><code class="hljs abap abap-docs-syntax-block">');

    // index starts at 1 so we skip header
    for (let index = 1; index < elements.length; index++) {
      block.push(elements[index]);
    }

    block.push('</code></pre>');

    this.contents.push(block.join(''));
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
