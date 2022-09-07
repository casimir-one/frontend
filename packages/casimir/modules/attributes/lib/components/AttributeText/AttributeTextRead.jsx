import { VeLineClamp } from '@casimir.one/vue-elements';
import { defineComponent } from '@casimir.one/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only text attribute
 */
export default defineComponent({
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
