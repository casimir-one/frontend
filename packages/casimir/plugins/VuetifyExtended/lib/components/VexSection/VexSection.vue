  <script>
  import { defineComponent } from '@casimir.one/platform-util';
  /* eslint-disable */
  import { VSheet } from 'vuetify/lib/components/VSheet';
  /* eslint-enable */

  /**
   * Component is the baseline for numerous components and pages
   * Is a content container
   */
  export default defineComponent({
    name: 'VexSection',
    mixins: [VSheet],
    props: {
      /**
       * Component backround color
       * Accepts custom @link [Material Design Color](https://vuetifyjs.com/en/styles/colors/) values
       * as well as rgb, rgba, and hexadecimal values
       * @example 'amber darken-3' or '#FFE082', 'rgba(255, 224, 130, 1)'
       */
      color: {
        type: String,
        default: 'transparent'
      }
    },
    computed: {
      classes() {
        return {
          ...VSheet.options.computed.classes.call(this),
          'vex-section': true,
          'pa-6': true,
          'pa-md-12': true
        };
      }
    }
  });
</script>
