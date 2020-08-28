/* eslint-disable no-continue */
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
  }

  parseBlockElements(blockElements: CheerioElement[]) {
    const header: Cheerio = this.$(blockElements[0]);
    const headerText: string = this.renderHeader(header);

    switch (headerText) {
      case 'Syntax':
        this.renderer.renderSyntaxBlock(blockElements.map((element) => this.$(element).html()!));
        break;
      case 'Note' || 'Notes':
        this.regularParseBlockElements(blockElements);
        break;
      default:
        this.regularParseBlockElements(blockElements);
        break;
    }
  }

  private regularParseBlockElements(blockElements: CheerioElement[]) {
    for (let index = 1; index < blockElements.length; index++) {
      const element = blockElements[index];
      if (this.$(element).is('ul')) {
        this.parseList(element);
      } else {
        this.parseText(this.$(element).html()!);
      }
    }
  }

  parseList(element: CheerioElement) {
    let ulTag = '<ul>';

    // Standard abap documentation doesn't nest UL,
    // so we need to apply the same CSS style to ident
    if (this.$(element).hasClass('circlem2')) {
      ulTag = '<ul class="circlem2">';
    }

    this.parseText(ulTag);
    let html = this.$(element).html()!;
    if (html) {
      // Remove extra line break
      html = html.replace(/<br>/gm, '');
      html = html.replace(/(\r\n|\n|\r)/gm, '');
    }
    this.parseText(html);
    this.parseText('</ul>');
  }

  private parseText(text: string) {
    this.renderer.renderText(text);
  }

  private renderHeader(headerElement: Cheerio): string {
    const header = headerElement.find('.h1');
    let headerTitle = this.$(header).text().trim();
    if (headerTitle !== '') {
      this.renderer.renderTitle(headerTitle);
      return headerTitle;
    }

    headerTitle = this.$(headerElement).find('.h2').text().trim();
    if (headerTitle !== '') {
      this.renderer.renderH2(headerTitle);
      return headerTitle;
    }

    headerTitle = this.$(headerElement).find('.h3').text().trim();
    if (headerTitle !== '') {
      this.renderer.renderH3(headerTitle);
      return headerTitle;
    }

    headerTitle = this.$(headerElement).find('.h4').text().trim();
    if (headerTitle !== '') {
      this.renderer.renderH3(headerTitle);
      return headerTitle;
    }

    return headerTitle;
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

  private parseCodeExample(element: CheerioElement) {
    const span: Cheerio = this.$(element).find('.qtext');
    let code = this.$(span).html()!;

    code = entities.decode(code);
    code = code.replace(/(\r\n|\n|\r)/gm, '');
    code = code.replace(/<br>/g, '\n');

    this.renderer.renderCodeBlock(code);
  }
}
