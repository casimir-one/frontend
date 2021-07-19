<script>
  // eslint-disable-next-line import/extensions,import/no-unresolved
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'VexColorShadow',
    props: {
      blur: {
        type: [String, Number],
        default: 16
      },
      scale: {
        type: [String, Number],
        default: 0.86
      },
      opacity: {
        type: [String, Number],
        default: 1
      }
    },
    computed: {
      styles() {
        return {
          '--color-shadow-blur': convertToUnit(this.blur),
          '--color-shadow-scale': this.scale,
          '--color-shadow-opacity': this.opacity
        };
      }
    },
    render(h) {
      const main = h('div', {
        class: {
          'color-shadow__primary': true
        }
      }, this.$slots.default);

      const shadow = h('div', {
        class: {
          'color-shadow__secondary': true,
          'transition-swing': true
        }
      }, this.$slots.default);

      return h('div', {
        class: {
          'color-shadow': true
        },
        style: this.styles
      }, [main, shadow]);
    }
  };
</script>

<style lang="scss">
  .color-shadow {
    position: relative;
    z-index: 1;

    &__primary {
      position: relative;
      z-index: 1;
    };

    &__secondary {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      transform-origin: bottom;
      filter: blur(var(--color-shadow-blur));
      transform: scale(var(--color-shadow-scale));
      opacity: var(--color-shadow-opacity);
    }
  }
</style>
