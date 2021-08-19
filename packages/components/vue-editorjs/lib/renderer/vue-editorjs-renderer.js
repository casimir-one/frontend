import './vue-editorjs-renderer.scss';

// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
import EditorjsParser from '@deip/editorjs-parser';

const parser = new EditorjsParser();

export default Vue.extend({
  name: 'VueEditorjsRenderer',

  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    parsedHtml() {
      return parser.parse(this.value);
    }
  },

  render() {
    return <div
      class="blocks-renderer"
      domPropsInnerHTML={this.parsedHtml}
    />;
  }
});
