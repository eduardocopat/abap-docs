/* eslint-disable no-continue */
import Renderer from './renderer';

const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

interface Header {
  title: string;
  render: (renderer: Renderer) => void;
}

export default class Parser {
  $: CheerioStatic;

  renderer: Renderer;

  constructor($: CheerioStatic, renderer: Renderer) {
    this.$ = $;
    this.renderer = renderer;
  }

  parse(): string {
    const root: CheerioElement = this.$('.all')[0];

    if (root === undefined) {
      // If there isn't a .all root, it's probably a old page. Just parse everythning as is
      this.parseText(this.$('body').html()!);
    } else {
      for (let index = 0; index < root.children.length; index++) {
        if (this.isBlock(root.children[index])) {
          this.parseBlock(root.children[index]);
          break;
        }
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
    const headerElement: Cheerio = this.$(blockElements[0]);

    const header = this.determineHeader(headerElement);

    switch (header.title) {
      case 'Syntax':
        header.render(this.renderer);
        this.parseSyntaxBlock(blockElements);

        break;
      case 'Note':
      case 'Notes':
        this.parseAdmonition('note', header.title, blockElements);
        break;
      case 'Example':
        this.parseAdmonition('example', header.title, blockElements);
        break;
      case 'Catchable Exceptions':
      case 'Non-Catchable Exceptions':
        this.parseAdmonition('tip', header.title, blockElements);
        break;
      default:
        header.render(this.renderer);
        this.regularParseBlockElements(blockElements);
        break;
    }
  }

  parseAdmonition(type: string, title: string, contents: CheerioElement[]) {
    // This break line before an admonition is necessary, otherwise they get
    // wrongly merged by mkdocs. display: block is to reduce its size
    this.parseText('<br style="display: block">');
    this.parseText(`<div markdown="span" class="admonition ${type}">`);
    this.parseText(`<p class="admonition-title">${title}</p>`);
    this.regularParseBlockElements(contents);
    this.parseText('</div>');
  }

  parseSyntaxBlock(blockElements: CheerioElement[]) {
    const parsedElements: string[] = [];
    for (let index = 0; index < blockElements.length; index++) {
      const element = blockElements[index];
      let HTML = this.$(element).html() || '';
      // Skip empty first line

      HTML = this.replaceJavascriptLinks(HTML);

      HTML = HTML.replace(/<br><br>/gm, '');
      if (index === 0 && HTML === '') { continue; }
      if (index === blockElements.length - 1 && HTML === '') { continue; }

      parsedElements.push(HTML);
    }
    this.renderer.renderSyntaxBlock(parsedElements);
  }

  private regularParseBlockElements(blockElements: CheerioElement[]) {
    for (let index = 1; index < blockElements.length; index++) {
      const element = blockElements[index];
      if (this.$(element).is('ul')) {
        this.parseList(element);
      } else if (this.$(element).is('table')) {
        this.parseTable(element);
      } else if (this.$(element).hasClass('qtextml1')) {
        this.parseCodeExample(element);
      } else if (this.$(element).is('a')) {
        // parse outer HTML
        const outerHTML: string = this.$.html(this.$(element))!;
        this.parseText(outerHTML);
      } else if (this.$(element).is('br')) {
        this.parseText('\n');
      } else {
        this.parseText(this.$(element).html()!);
      }
    }
  }

  parseTable(element: CheerioElement) {
    const tableBody = this.$(element).find('tbody');
    let tableHeaderParsed = false;

    let markdownRow;
    let tableRow;
    let tableCell;
    let tableWidth;
    for (let i = 0; i < tableBody.children().length; i++) {
      tableRow = this.$(tableBody.children()[i]);
      tableWidth = tableRow.children().length;

      markdownRow = '';

      for (let j = 0; j < tableWidth; j++) {
        tableCell = this.$(tableRow.children()[j]);

        markdownRow += '|';
        // Don't use HTML in the header, so that we have pure text (e.g. sy-subrc is in a span)
        let cellContent = tableHeaderParsed ? this.$(tableCell).html()! : this.$(tableCell).text()!;
        cellContent = cellContent || '';

        // Remove new lines so that markdown tables do not break
        cellContent = cellContent.replace(/(\r\n|\n|\r)/gm, '');
        markdownRow += cellContent;
      }
      // Closes row
      markdownRow += '|';
      this.parseText(markdownRow);

      if (!tableHeaderParsed) {
        markdownRow = '';
        for (let j = 0; j < tableWidth; j++) {
          markdownRow += '|';
          markdownRow += '----';
        }
        markdownRow += '|';
        tableHeaderParsed = true;
        this.parseText(markdownRow);
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
      html = html.replace(/<br>\n<br>/gm, '\n');
      html = html.replace(/<br><br><\/li>/gm, '</li>');
    }
    this.parseText(html);
    this.parseText('</ul>');
  }

  private parseText(text: string) {
    if (!text) { return; }
    let parsedText = text;

    // https://regex101.com/r/1mionM/3
    // Show inline code
    parsedText = parsedText.replace(/<span class="qtext">.*?<\/span>/gm, (matched) => `<code style="display: inline;">${matched}</code>`);
    // Remove extra line break
    parsedText = parsedText.replace(/<br><br>/gm, ' \n ');

    parsedText = this.replaceJavascriptLinks(parsedText);

    this.renderer.renderText(parsedText);
  }

  private determineHeader(element: Cheerio): Header {
    const header: Header = {
      title: '',
      // eslint-disable-next-line no-unused-vars
      render(renderer: Renderer) { },
    };

    let headerElement = element.find('.h1');
    let headerTitle = this.$(headerElement).text().trim();
    if (headerTitle !== '') {
      header.title = headerTitle;
      // eslint-disable-next-line func-names
      header.render = function (renderer: Renderer) { renderer.renderTitle(headerTitle); };
      return header;
    }

    headerElement = element.find('.h2');
    const headerLink = this.$(headerElement).find('a');
    const headerLinkHTML = this.$.html(headerLink);
    headerTitle = this.$(headerElement).text().trim().replace(':', '');
    if (headerTitle !== '') {
      header.title = headerTitle;
      // eslint-disable-next-line func-names
      header.render = function (renderer: Renderer) {
        renderer.renderText(headerLinkHTML);
        renderer.renderH2(headerTitle);
      };
      return header;
    }

    headerElement = element.find('.h3');
    headerTitle = this.$(headerElement).text().trim().replace(':', '');
    if (headerTitle !== '') {
      header.title = headerTitle;
      // eslint-disable-next-line func-names
      header.render = function (renderer: Renderer) { renderer.renderH3(headerTitle); };
      return header;
    }

    headerElement = element.find('.h4');
    headerTitle = this.$(headerElement).text().trim().replace(':', '');
    if (headerTitle !== '') {
      header.title = headerTitle;
      // eslint-disable-next-line func-names
      header.render = function (renderer: Renderer) { renderer.renderH3(headerTitle); };
      return header;
    }

    if (element.hasClass('h4')) {
      headerTitle = this.$(element).text().trim().replace(':', '');
      if (headerTitle !== '') {
        header.title = headerTitle;
        // eslint-disable-next-line func-names
        header.render = function (renderer: Renderer) { renderer.renderH3(headerTitle); };
        return header;
      }
    }

    headerElement = element.find('.bold');
    headerTitle = this.$(headerElement).text().trim().replace(':', '');
    if (headerTitle !== '') {
      header.title = headerTitle;
      // eslint-disable-next-line func-names
      header.render = function (renderer: Renderer) { renderer.renderH3(headerTitle); };
      return header;
    }

    return header;
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
    return classes.split(/\s+/).some((c) => c === 'h1' || c === 'h2' || c === 'h3' || c === 'h4' || c === 'h5' || c === 'bold');
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

  private replaceJavascriptLinks(text: string) {
    if (!text) return '';
    // https://regex101.com/r/rvTc8y/6
    // Replace bad abap docs js links with relative links
    return text.replace(/(<a href=")(javascript:call_link\((?:&apos;|'))(.*?)\.html(?:&apos;|')\)/gm, '$1../$3');
  }
}
