<script>
  import { VSheet } from 'vuetify/lib/components/VSheet';

  export default {
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
      },
    }
  };
</script>
