import './vue-editorjs-renderer.scss';

// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
import EditorjsParser from '@deip/editorjs-parser';
import { TemplateStringParser } from '@deip/toolbox';

const parser = new EditorjsParser();

export default Vue.extend({
  name: 'VueEditorjsRenderer',

  props: {
    value: {
      type: Object,
      default: () => {}
    },
    schemaData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      stringParser: null
    };
  },

  computed: {
    parsedHtml() {
      return parser.parse(this.value);
    },

    parsedTemplate() {
      if (!this.schemaData) {
        return this.parsedHtml;
      }

      this.stringParser.setCtx(this.schemaData);
      return this.stringParser.parse(this.parsedHtml);
    }
  },

  created() {
    this.stringParser = new TemplateStringParser(this.schemaData, { isTemplateShown: true });
  },

  render() {
    return <div
      class="blocks-renderer"
      domPropsInnerHTML={this.parsedTemplate}
    />;
  }
});
