import {
  VImg
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeImageRead = defineComponent({
  name: 'AttributeImageRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      const src = this.schemaData.getAttributeFileSrc(this.attributeId);

      return (
        <VImg max-width="100%" src={src} />
      );
    }
  }
});
