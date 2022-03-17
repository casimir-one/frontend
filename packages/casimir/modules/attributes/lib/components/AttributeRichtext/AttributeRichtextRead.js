import { VueEditorjsParser } from '@deip/vue-editorjs';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only richtext attribute
 */
export const AttributeRichtextRead = defineComponent({
  name: 'AttributeRichtextRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate richtext attribute for read only
     */
    genAttribute() {
      return (
        <VueEditorjsParser value={this.internalValue}/>
      );
    }
  }
});
