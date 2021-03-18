<script>
  import { VSheet } from 'vuetify/lib/components/VSheet';
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'DLayoutSectionSplit',
    mixins: [VSheet],
    props: {
      template: {
        type: String,
        default: '1 1'
      },

      gutter: {
        type: [Number, String],
        default: 48
      },

      color: {
        type: String,
        default: 'transparent'
      }
    },
    computed: {
      classes() {
        return {
          ...VSheet.options.computed.classes.call(this),
          'vex-section__split': true,
        };
      },

      styles() {
        return {
          ...this.measurableStyles,
          '--vex-section-split-gap': convertToUnit(this.gutter),
          '--vex-section-split-template': this.template.split(' ').map((i) => `${i}fr`).join(' ')
        };
      }
    }
  };
</script>

<style lang="scss">
  .vex-section__split {
    display: grid;
    grid-gap: var(--vex-section-split-gap);
    grid-template-columns: var(--vex-section-split-template);

    .align-bottom > & {
      align-items: end;
    }
  }
</style>
