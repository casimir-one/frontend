import { VexVideoEmbed } from '@deip/vuetify-extended';
import { AttributeReadMixin } from '../../mixins';

export const AttributeVideoUrlRead = {
  name: 'AttributeVideoUrlRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VexVideoEmbed src={this.internalValue} />
      );
    }
  }
};
