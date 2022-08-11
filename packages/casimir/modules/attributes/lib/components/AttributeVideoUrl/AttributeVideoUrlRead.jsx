import { VexVideoEmbed } from '@casimir/vuetify-extended';
import { defineComponent } from '@casimir/platform-util';
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
