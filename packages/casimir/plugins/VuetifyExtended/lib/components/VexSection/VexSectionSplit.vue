<script>
  import { defineComponent } from '@casimir/platform-util';
  /* eslint-disable */
  import { VSheet } from 'vuetify/lib/components/VSheet';
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  /* eslint-enable */
  /**
   * Component is the baseline for numerous components and pages
   * Is a content container built with a grid
   */
  export default defineComponent({
    name: 'VexSectionSplit',
    mixins: [VSheet],
    props: {
      /**
       * Sets the number of columns "columns" in the grid
       * and can determine the width of each of them
       */
      template: {
        type: String,
        default: '1 1'
      },
      /**
       * Width of the gutter separating the grid lines
       */
      gutter: {
        type: [Number, String],
        default: 48
      },
      /**
       * Component backround color
       * Accepts custom @See [Material Design Color](https://vuetifyjs.com/en/styles/colors/) values
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
          'vex-section__split': true
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
  });
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
