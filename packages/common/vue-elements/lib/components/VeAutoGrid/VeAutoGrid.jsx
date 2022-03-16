import './VeAutoGrid.scss';

import { defineComponent } from '@deip/platform-util';
import { convertToUnit } from '@deip/toolbox';
import { genBreakpointCssVarsStyles, genBreakpointProps } from '../../util/breakpoint';

const gapProps = genBreakpointProps('gap', [Number, String]);
const itemWidthProps = genBreakpointProps('itemWidth', [Number, String]);
const colsProps = genBreakpointProps('cols', [Number, String]);

function hasPropsVal(props) {
  return Boolean(
    Object.keys(props)
      .map((prop) => Boolean(this[prop]))
      .filter((val) => val)
      .length
  );
}

/**
 * Grid component
 */
export default defineComponent({
  name: 'VeAutoGrid',

  props: {
    ...gapProps,
    ...itemWidthProps,
    ...colsProps
  },

  computed: {
    /**
     * Styles
     * @returns {Object}
     */
    styles() {
      const unitTransformer = (val) => convertToUnit(val);
      return {
        ...genBreakpointCssVarsStyles.call(this, 'gap', unitTransformer),
        ...genBreakpointCssVarsStyles.call(this, 'itemWidth', unitTransformer),
        ...genBreakpointCssVarsStyles.call(this, 'cols')
      };
    },
    /**
     * Classes
     * @returns {Object} result
     * @returns {string} result['ve-auto-grid']
     * @returns {string} result['ve-auto-grid--auto-fill']
     */
    classes() {
      return {
        've-auto-grid': true,
        've-auto-grid--auto-fill': this.hasItemWidthProps
      };
    },
    /**
     * Is itemWidth prop presented
     * @returns {boolean}
     */
    hasItemWidthProps() {
      return hasPropsVal.call(this, itemWidthProps);
    },
    /**
     * Is cols prop presented
     * @returns {boolean}
     */
    hasColsProps() {
      return hasPropsVal.call(this, colsProps);
    }
  },

  created() {
    if (this.hasItemWidthProps && this.hasColsProps) {
      console.warn('[VeAutoGrid]: Not recommend using "cols" and "item-width" props at same time');
    }
  },

  render() {
    return (
      <div
        class={this.classes}
        style={this.styles}
      >
        {this.$slots.default}
      </div>
    );
  }
});
