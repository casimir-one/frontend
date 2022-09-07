import { VexVideoEmbed } from '@casimir.one/vuetify-extended';
import { defineComponent } from '@casimir.one/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only video url attribute
 */
export default defineComponent({
  name: 'AttributeVideoUrlRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate read only video url attribute
     */
    genAttribute() {
      return (
        <VexVideoEmbed src={this.internalValue} />
      );
    }
  }
});
