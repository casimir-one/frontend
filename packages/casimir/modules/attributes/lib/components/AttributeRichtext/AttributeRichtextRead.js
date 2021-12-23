import { VueEditorjsParser } from '@deip/vue-editorjs';
import { AttributeReadMixin } from '../../mixins';

export const AttributeRichtextRead = {
  name: 'AttributeRichtextRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VueEditorjsParser value={this.internalValue}/>
      );
    }
  }
};
