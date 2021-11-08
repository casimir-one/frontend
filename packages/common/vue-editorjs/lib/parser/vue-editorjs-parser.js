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
      if (!this.schemaData || !this.stringParser) {
        return this.parsedHtml;
      }

      return this.stringParser.parse(this.parsedHtml);
    }
  },

  watch: {
    parsedTemplate(newVal) {
      this.emitTemplateParsed(newVal);
    },

    schemaData(newVal) {
      this.stringParser.setCtx(newVal);
    }
  },

  created() {
    this.stringParser = new TemplateStringParser(this.schemaData, { isTemplateShown: true });
  },

  methods: {
    emitTemplateParsed(value) {
      this.$emit('template-parsed', value);
    }
  },

  render() {
    return <div
      class="editorjs-parser"
      domPropsInnerHTML={this.parsedTemplate}
    />;
  }
});
