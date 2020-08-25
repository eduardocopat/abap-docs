export default class Renderer {
    contents: Array<String>;

    constructor() {
      this.contents = [];
    }

    renderTitle(title: string) {
      this.contents.push(`# ${title}`);
    }
}
