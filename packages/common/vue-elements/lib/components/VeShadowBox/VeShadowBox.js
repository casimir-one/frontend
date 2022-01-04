import { defineComponent } from '@deip/platform-util';

import { convertToUnit } from '@deip/toolbox';

export default defineComponent({
  name: 'VeShadowBox',
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
});
