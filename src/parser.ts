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

    for (let index = 0; index < root.children.length; index++) {
      if (this.isBlock(root.children[index])) {
        this.parseBlock(root.children[index]);
        break;
      }
    }

    return this.renderer.getContents();
  }

  parseBlock(element: CheerioElement) {
    const blockElements: Array<CheerioElement> = [];

    // @TODO: Render block title?
    blockElements.push(element);
    let { next } = element;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      blockElements.push(next);
      next = next.next;
      if (!next) { break; }
      if (this.isBlock(next)) { break; }
    }

    this.parseBlockElements(blockElements);

    if (next) { this.parseBlock(next); }

    // Do stuff with block elements

    // parse next block
  }

  parseBlockElements(blockElements: CheerioElement[]) {
    for (let index = 0; index < blockElements.length; index++) {
      const element = blockElements[index];
      this.renderer.renderText(this.$(element).text());
      // this.renderer.renderHTML(this.$(element).html()!);
      // const children = (element) ? (element.children || []) : [];
      // if (children.length > 0) {
      //  this.parseBlockElements(children);
      // }
    }
  }

  private isBlock(element: CheerioElement): boolean {
    const { isHeader } = this;
    if (isHeader(element)) return true;

    const children = (element) ? (element.children || []) : [];
    return children.some((e) => isHeader(e));
  }

  private isHeader(element: CheerioElement): boolean {
    const elementHeader = element || {};
    const attributes = elementHeader.attribs || {};
    const classes = attributes.class || '';
    return classes.split(/\s+/).some((c) => c === 'h1' || c === 'h2' || c === 'h3' || c === 'h4' || c === 'h5');
  }

  private parseH1(element: CheerioElement) {
    this.renderer.renderTitle(this.$(element).text().trim());
  }

  parseH2(element: CheerioElement) {
    const text: Cheerio = this.$(element).find('.bold');
    this.renderer.renderH2(text.text());
    this.parseBlock(element);
  }
  /*
  private parseChildren(element: CheerioElement) {
    this.$(element).children().each((_index: number, child: CheerioElement) => {
      this.parseRootElements(child);
    });
  }
  */

  private parseCodeExample(element: CheerioElement) {
    const span: Cheerio = this.$(element).find('.qtext');
    // @TODO: rename text to code
    let text = this.$(span).html()!; // Or .html, doesn't really matter with the input you showed
    // text = text.replace(/<br><br>/g, '<br>');

    text = entities.decode(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '');
    text = text.replace(/<br>/g, '\n');

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
