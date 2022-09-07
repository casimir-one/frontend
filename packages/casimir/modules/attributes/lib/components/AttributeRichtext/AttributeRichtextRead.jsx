import { VueEditorjsParser } from '@casimir.one/vue-editorjs';
import { defineComponent } from '@casimir.one/platform-util';
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
