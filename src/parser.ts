import Renderer from 'src/renderer';

export default class Parser {
  $: CheerioStatic;

  renderer: Renderer;

  constructor($: CheerioStatic, renderer: Renderer) {
    this.$ = $;
    this.renderer = renderer;
  }

  parse(): string {
    const root: CheerioElement = this.$('.all')[0];
    this.parseChildren(root);
    return this.renderer.getContents();
  }

  private parseElement(element: CheerioElement) {
    if (this.$(element).hasClass('h1')) {
      this.parseTitle(element);
    } else if (this.$(element).hasClass('qtextml1')) {
      this.parseCodeExample(element);
    } else {
      this.parseChildren(element);
    }
  }

  private parseChildren(element: CheerioElement) {
    this.$(element).children().each((_index: number, child: CheerioElement) => {
      this.parseElement(child);
    });
  }

  private parseTitle(element: CheerioElement) {
    this.renderer.renderTitle(this.$(element).text().trim());
  }

  private parseCodeExample(element: CheerioElement) {
    const span: Cheerio = this.$(element).first();
    const code = this.$(span).text();
    this.renderer.renderCodeBlock(code);
  }
}
