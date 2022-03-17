import { VexVideoEmbed } from '@deip/vuetify-extended';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only video url attribute
 */
export const AttributeVideoUrlRead = defineComponent({
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
