import { VexMarkdown } from '@deip/vuetify-extended';
import { AttributeReadMixin } from '../../mixins';

export const AttributeTextareaRead = {
  name: 'AttributeTextareaRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VexMarkdown source={this.internalValue}/>
      );
    }
  }
};
