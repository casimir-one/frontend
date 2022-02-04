import { VexVideoEmbed } from '@deip/vuetify-extended';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeVideoUrlRead = defineComponent({
  name: 'AttributeVideoUrlRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VexVideoEmbed src={this.internalValue} />
      );
    }
  }
});
