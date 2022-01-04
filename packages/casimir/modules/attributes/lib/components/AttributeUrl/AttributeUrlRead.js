import { VeStack } from '@deip/vue-elements';
import {
  VIcon
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';
import { AttributeReadMixin } from '../../mixins';

export const AttributeUrlRead = {
  name: 'AttributeTextRead',

  mixins: [AttributeReadMixin],

  methods: {
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

    genMultipleAttribute() {
      const items = this.internalValue
        .map((value) => this.genSingleAttribute(value));

      return (
        <VeStack gap={8}>
          {items}
        </VeStack>
      );
    },

    genAttribute() {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute()
        : this.genSingleAttribute();
    }
  }
};
