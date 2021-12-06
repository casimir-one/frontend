import { CreateElement, VNode } from 'vue';
import { Component, Mixins } from 'vue-property-decorator';
import TestComponentLargeMixins from './TestComponentLargeMixins';

@Component
export default class TestComponentLarge extends Mixins(TestComponentLargeMixins) {
  name = 'TestComponentLarge';

  handleClick(): void {
    this.showConsoleLog();
  }

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        staticClass: 'test-component-large',
        on: {
          click: this.handleClick,
        },
      },
      this.name,
    );
  }
}
