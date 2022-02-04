import { VueEditorjsParser } from '@deip/vue-editorjs';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

export const AttributeRichtextRead = defineComponent({
  name: 'AttributeRichtextRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VueEditorjsParser value={this.internalValue}/>
      );
    }
  }
});
