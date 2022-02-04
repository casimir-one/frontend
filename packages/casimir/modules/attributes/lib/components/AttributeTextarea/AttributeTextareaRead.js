import { VexMarkdown } from '@deip/vuetify-extended';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeTextareaRead = defineComponent({
  name: 'AttributeTextareaRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VexMarkdown source={this.internalValue}/>
      );
    }
  }
});
