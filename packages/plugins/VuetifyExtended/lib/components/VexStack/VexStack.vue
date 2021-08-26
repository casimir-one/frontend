<script>
  /* eslint-disable */
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  import { VSheet } from 'vuetify/lib/components';
  /* eslint-enable */
  import { defineComponent } from '@deip/platform-util';
  import { isNil } from '@deip/toolbox/lodash';

  export default defineComponent({
    name: 'VexStack',
    mixins: [VSheet],

    props: {
      gutter: {
        type: [Number, String],
        default: 24
      },

      horizontal: {
        type: Boolean,
        default: false
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
          'vex-stack': true,
          [`vex-stack--${this.horizontal ? 'horizontal' : 'vertical'}`]: true
        };
      },

      styles() {
        return {
          ...this.measurableStyles,
          '--vex-stack-gutter': convertToUnit(!isNil(this.gutter) ? this.gutter : 24)
        };
      }
    }
  });
</script>

<style lang="scss">
  .vex-stack {
    display: grid;
    grid-gap: var(--vex-stack-gutter);

    &--horizontal {
      grid-auto-flow: column;
      grid-auto-columns: max-content;
    }

    &--vertical {
      grid-auto-flow: row;
      //justify-items: left;
    }
  }
</style>
