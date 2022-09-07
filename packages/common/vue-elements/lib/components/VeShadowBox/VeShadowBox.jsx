import { defineComponent } from '@casimir.one/platform-util';

import { convertToUnit } from '@casimir.one/toolbox';

/**
 * Container with shadow
 */
export default defineComponent({
  name: 'VeShadowBox',
  props: {
    /**
     * Blur value
     */
    blur: {
      type: [String, Number],
      default: 16
    },
    /**
     * Scale value
     */
    scale: {
      type: [String, Number],
      default: 0.86
    },
    /**
     * Opacity value
     */
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
});
