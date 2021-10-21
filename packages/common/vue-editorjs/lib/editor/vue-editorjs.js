import './vue-editorjs.scss';

// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';

import EditorJS from '@editorjs/editorjs';

import Header from '@editorjs/header';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Underline from '@editorjs/underline';
import NestedList from '@editorjs/nested-list';
import Marker from '@editorjs/marker';

// import { mdiAccount } from '@mdi/js';

import { isEqual, debounce } from '@deip/toolbox/lodash';

// const genIcon = (path) => `
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg">
//     <path d="${path}"></path>
//   </svg>
// `;

export default Vue.extend({
  name: 'VueEditorjs',

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    editorId: {
      type: String,
      default: null
    },

    readonly: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: String,
      default: 'Start typing here...'
    },

    minHeight: {
      type: [String, Number],
      default: 100
    },

    tools: {
      type: Object,
      default: () => ({})
    }
  },
  data(vm) {
    return {
      editor: null,
      lazyValue: vm.value
    };
  },

  computed: {
    internalEditorId() {
      return this.editorId || `${this.$options.name}-${this._uid}`;
    }
  },

  mounted() {
    this.initEditor();

    const editorElement = document.getElementById(this.internalEditorId);
    if (editorElement) {
      editorElement.addEventListener('focusin', this.focus);
      editorElement.addEventListener('focusout', this.blur);
    }
  },

  beforeDestroy() {
    const editorElement = document.getElementById(this.internalEditorId);
    if (editorElement) {
      editorElement.removeEventListener('focusin', this.focus);
      editorElement.removeEventListener('focusout', this.blur);
    }
  },

  methods: {
    initEditor() {
      this.destroyEditor();

      const {
        placeholder,
        readonly: readOnly,
        tools,
        minHeight
      } = this;

      this.editor = new EditorJS({
        holder: this.internalEditorId,
        data: this.lazyValue,

        minHeight,
        placeholder,
        readOnly,

        tools: {
          header: {
            class: Header,
            // toolbox: {
            //   icon: genIcon(mdiAccount),
            // },
            inlineToolbar: ['marker', 'link'],
            config: {
              placeholder: 'Enter a header',
              levels: [3, 4, 5],
              defaultLevel: 3
            }
          },
          list: {
            class: NestedList,
            inlineToolbar: true
          },
          table: {
            class: Table,
            inlineToolbar: true
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author'
            }
          },

          underline: Underline,
          delimiter: Delimiter,
          marker: Marker,

          ...tools
        },

        onReady: this.onReady,
        onChange: debounce(this.onChange, 50),
        logLevel: 'ERROR'
      });
    },

    destroyEditor() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
    },

    onReady() {
      this.$emit('ready', this.editor);
    },

    onChange() {
      this.editor.save()
        .then((data) => {
          if (!isEqual(this.lazyValue, data)) {
            this.lazyValue = data;
            this.$emit('change', data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    focus() {
      this.$emit('focus');
    },

    blur() {
      this.$emit('blur');
    }
  },
  render() {
    return (
      <div
        id={this.internalEditorId}
        class='vue-editorjs'
      />
    );
  }
});
