import { VexAvatar } from '@deip/vuetify-extended';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeAvatarRead = defineComponent({
  name: 'AttributeAvatarRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VexAvatar
          src={this.schemaData.getAttributeFileSrc(this.attributeId)}
          { ...{ props: this.proxyProps.VexAvatar || {} }}
        />
      );
    }
  },

  render() {
    return this.genAttribute();
  }
});
