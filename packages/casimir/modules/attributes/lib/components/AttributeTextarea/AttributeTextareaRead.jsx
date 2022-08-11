import { VexMarkdown } from '@casimir/vuetify-extended';
import { defineComponent } from '@casimir/platform-util';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only textarea attribute
 */
export default defineComponent({
  name: 'AttributeTextareaRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate textarea attribute for read only
     */
    genAttribute() {
      return (
        <VexMarkdown source={this.internalValue}/>
      );
    }
  }
});
