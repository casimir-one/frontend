import { defineComponent } from '@casimir/platform-util';

import { AttributeRootComponentMixinFactory } from '../mixins';

/**
 * Component for read only attribute
 */
const AttributeRead = defineComponent({
  name: 'AttributeRead',

  mixins: [
    AttributeRootComponentMixinFactory('read')
  ],

  methods: {
  /**
   * Generate read only attribute
   */
    genFallback() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});

export default AttributeRead;
export { AttributeRead };
