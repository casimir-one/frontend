import { VeStack } from '@casimir.one/vue-elements';
import {
  VIcon
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';
import { defineComponent } from '@casimir.one/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only url attribute
 */
export default defineComponent({
  name: 'AttributeTextRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate read only single url attribute
     */
    genSingleAttribute(value = this.internalValue) {
      const { url, label } = value;
      return (
        <div className="d-flex">
          <VIcon size={20} class="mr-2">
            mdi-earth
          </VIcon>
          <a class='link' href={url}>{label || url}</a>
        </div>
      );
    },
    /**
     * Generate read only multiple url attribute
     */
    genMultipleAttribute() {
      const items = this.internalValue
        .map((value) => this.genSingleAttribute(value));

      return (
        <VeStack gap={8}>
          {items}
        </VeStack>
      );
    },
    /**
     * Generate read only url attribute depending on values count
     */
    genAttribute() {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute()
        : this.genSingleAttribute();
    }
  }
});
