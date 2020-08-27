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
}
