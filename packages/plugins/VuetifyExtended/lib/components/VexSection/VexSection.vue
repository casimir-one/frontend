  <script>
  import { defineComponent } from '@deip/platform-fns';
  /* eslint-disable */
  import { VSheet } from 'vuetify/lib/components/VSheet';
  /* eslint-enable */

  export default defineComponent({
    name: 'VexSection',
    mixins: [VSheet],
    props: {
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
