import './VeLineClamp.scss';

import { defineComponent } from '@casimir.one/platform-util';

/**
 * Truncates text at a specific number of lines
 */
export default defineComponent({
  name: 'VeLineClamp',

  props: {
    /**
     * Lines number
     */
    lines: {
      type: [Number, String],
      default: null
    },
    /**
     * Element tag name
     */
    tag: {
      type: String,
      default: 'div'
    }
  },

  computed: {
    hasLineClamp() {
      return !!this.lines;
    },

    styles() {
      return this.hasLineClamp ? { '-webkit-line-clamp': this.lines } : {};
    },

    classes() {
      return {
        've-line-clamp': this.hasLineClamp
      };
    }
  },

  render() {
    const Component = this.tag;

    return (
      <Component
        class={this.classes}
        style={this.styles}
      >
        {this.$slots.default}
      </Component>
    );
  }
});
