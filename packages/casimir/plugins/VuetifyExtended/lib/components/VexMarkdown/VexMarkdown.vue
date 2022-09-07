<script>
  import { defineComponent } from '@casimir.one/platform-util';
  import marked from 'marked';
  import DOMPurify from 'dompurify';

  /** Component displays parsed markdown   */
  export default defineComponent({
    name: 'VexMarkdown',

    props: {
      /** Source text */
      source: {
        type: String,
        default: ''
      },
      /**
       * Options
       * @see See [options](https://marked.js.org/using_advanced#options)
       */
      options: {
        type: Object,
        default: () => ({})
      }
    },

    computed: {
      config() {
        return {
          renderer: marked.Renderer(),
          baseUrl: null,
          gfm: true,
          breaks: true,
          pedantic: false,
          smartLists: true,
          smartypants: false,
          headerIds: true,
          headerPrefix: '',
          highlight: null,
          langPrefix: 'language-',
          mangle: true,
          silent: false,
          tokenizer: null,
          walkTokens: null,
          xhtml: false,
          ...this.options
        };
      }
    },

    render() {
      return (<div domPropsInnerHTML={
        DOMPurify.sanitize(marked(this.source, this.config))
      }></div>);
    }
  });
</script>
