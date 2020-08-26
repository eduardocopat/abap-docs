import Renderer from 'src/renderer';

export default class Parser {
  $: any;

  renderer: Renderer;

  constructor($: any, renderer: Renderer) {
    this.$ = $;
    this.renderer = renderer;
  }

  parse(): string {
    this.parseTitle();
    return this.renderer.getContents();
  }

  private parseTitle(): void {
    const titleNode = this.$('.h1')[0];
    this.renderer.renderTitle(this.$(titleNode).text().trim());
  }
}
