import './ve-auto-grid.scss';

import { defineComponent } from '@deip/platform-util';
import { convertToUnit } from '@deip/toolbox';
import { genBreakpointCssVarsStyles, genBreakpointProps } from '../../util/breakpoint';

const VeAutoGrid = defineComponent({
  name: 'VeAutoGrid',

  props: {
    ...genBreakpointProps('gap', [Number, String]),
    ...genBreakpointProps('itemWidth', [Number, String])
  },

  computed: {
    styles() {
      const transformer = (val) => convertToUnit(val);
      return {
        ...genBreakpointCssVarsStyles.call(this, 'gap', transformer),
        ...genBreakpointCssVarsStyles.call(this, 'itemWidth', transformer)
      };
    }
  },

  render() {
    return (
      <div
        class='ve-auto-grid'
        style={this.styles}
      >
        {this.$slots.default}
      </div>
    );
  }
});

export default VeAutoGrid;
