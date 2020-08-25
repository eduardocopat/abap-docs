import Renderer from 'src/renderer';

export default class Parser {
    $: any;

    renderer: Renderer;

    constructor($: any, renderer: Renderer) {
      this.$ = $;
      this.renderer = renderer;
    }

    parse(): void {
      // console.log('Function displays Engine is');
    }

    private parseTitle(): void {
      const title = this.$('.h1')[0];
      this.renderer.renderTitle(title);
    }
}
