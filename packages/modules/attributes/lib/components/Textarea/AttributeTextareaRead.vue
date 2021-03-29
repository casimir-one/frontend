<script>
  import VClamp from 'vue-clamp'
  import { stripHtml } from '@deip/toolbox';
  import { attributeRead } from '../../mixins/base';

  export default {
    name: 'AttributeTextareaRead',
    components: { VClamp },
    mixins: [attributeRead],
    props: {
      clamped: {
        type: [Number, String],
        default: null
      }
    },
    methods: {
      genContent(h) {
        if (this.clamped) {
          return h('v-clamp', {
            props: {
              autoresize: true,
              // eslint-disable-next-line radix
              maxLines: parseInt(this.clamped)
            },
          }, stripHtml(this.attribute.value));
        }

        return h('pre', {
          domProps: {
            innerHTML: stripHtml(this.attribute.value)
          },
          staticClass: 'pre'
        });
      }
    }
  };
</script>

<style lang="scss">
  .pre {
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>