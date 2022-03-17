import { VeLineClamp } from '@deip/vue-elements';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only text attribute
 */
export const AttributeTextRead = defineComponent({
  name: 'AttributeTextRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate text attribute for read only
     */
    genAttribute() {
      return (
        <VeLineClamp { ...{ props: this.proxyProps.VeLineClamp || {} }}>
          {this.internalValue}
        </VeLineClamp>
      );
    }
  }
});
