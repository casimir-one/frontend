import { defineComponent } from '@casimir.one/platform-util';
import { AttributeReadMixin } from '@casimir.one/attributes-module';

/**
 * Component for read asset attribute
 */
export default defineComponent({
  name: 'AttributeAssetRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate attribute for read only
     */
    genAttribute() {
      return (
        <span>{ this.value.amount } { this.value.symbol }</span>
      );
    }
  }
});
