import { defineComponent } from '@deip/platform-util';

import { AttributeRootComponentMixinFactory } from '../mixins';

const AttributeRead = defineComponent({
  name: 'AttributeRead',

  mixins: [
    AttributeRootComponentMixinFactory('read')
  ],

  methods: {
    genFallback() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});

export default AttributeRead;
export { AttributeRead };
