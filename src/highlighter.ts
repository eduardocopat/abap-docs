const hljs = require('highlight.js');
const hljsabap = require('highlightjs-sap-abap');

hljs.registerLanguage('abap', hljsabap);

hljs.configure({
  useBR: true,
});

export default class Highlighter {
  static highlight(code: string): string {
    return hljs.highlight('abap', code).value;
  }
}
