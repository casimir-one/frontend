import { VueEditorjsParser } from '@casimir/vue-editorjs';
import { defineComponent } from '@casimir/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only richtext attribute
 */
export default defineComponent({
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
