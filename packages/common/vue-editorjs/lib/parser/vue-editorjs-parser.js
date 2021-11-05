import './vue-editorjs-parser.scss';

// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
import { TemplateStringParser } from '@deip/toolbox';
import EditorjsParser from './editorjs-parser';

const parser = new EditorjsParser();

export default Vue.extend({
  name: 'VueEditorjsParser',

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
    this.$watch('parsedTemplate', {
      handler(newVal) {
        this.$emit('template-parsed', newVal);
      },
      immediate: true
    });
  },

  render() {
    return <div
      class="editorjs-parser"
      domPropsInnerHTML={this.parsedTemplate}
    />;
  }
});
