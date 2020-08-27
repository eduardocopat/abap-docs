import Renderer from './renderer';

const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

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
    const span: Cheerio = this.$(element).find('.qtext');
    const code = '';

    const first = this.$(span).children();

    const a = this.$(span).text()!; // Or .html, doesn't really matter with the input you showed
    let text = this.$(span).html()!; // Or .html, doesn't really matter with the input you showed
    // text = text.replace(/<br><br>/g, '<br>');

    text = entities.decode(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '');
    text = text.replace(/<br>/g, '\r');

    /*
    const code = this.$(span).text();
    const bar = this.$(span).html();
    const foo = this.$(span).clone();
    foo.css('white-space', 'nowrap');
    const text = foo.text();
    */
    this.renderer.renderCodeBlock(text);
  }
}
