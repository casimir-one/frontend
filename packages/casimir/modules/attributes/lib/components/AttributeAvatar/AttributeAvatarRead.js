import { VexAvatar } from '@deip/vuetify-extended';
import { AttributeReadMixin } from '../../mixins';

export const AttributeAvatarRead = {
  name: 'AttributeAvatarRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VexAvatar
          src={this.schemaData.getAttributeFileSrc(this.attributeId)}
          size={this.proxyProps.VexAvatar.size}
        />
      );
    }
  },

  render() {
    return this.genAttribute();
  }
};
