import './vue-editorjs-parser.scss';

// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
import { TemplateStringParser } from '@casimir.one/toolbox';
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
      /** @type {TemplateStringParser | null} */
      stringTemplateParser: null
    };
  },

  computed: {
    /**
     * @returns {string}
     */
    parsedHtml() {
      return parser.parse(this.value);
    },

    /**
     * @returns {string}
     */
    parsedTemplate() {
      if (!this.schemaData || !this.stringTemplateParser) {
        return this.parsedHtml;
      }

      return this.stringTemplateParser.parse(this.parsedHtml);
    }

  },

  watch: {
    parsedTemplate: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.emitTemplateParsed(newVal);
        }
      },
      immediate: true
    },

    schemaData: {
      handler(newVal) {
        this.stringTemplateParser.setCtx(newVal);
      },
      deep: true
    }

  },

  created() {
    this.stringTemplateParser = new TemplateStringParser(this.schemaData,
      { isTemplateShown: true });
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
