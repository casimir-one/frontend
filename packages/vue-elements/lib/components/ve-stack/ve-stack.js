import './ve-stack.scss';

import { defineComponent } from '@deip/platform-util';
import { convertToUnit } from '@deip/toolbox';
import { genBreakpointCssVarsStyles, genBreakpointProps } from '../../util/breakpoint';

const VeStack = defineComponent({
  name: 'VeAutoGrid',

  props: {
    ...genBreakpointProps('gap', [Number, String]),
    ...genBreakpointProps(
      'flow',
      [Number, String],
      (val) => ['column', 'row'].includes(val)
    )
  },

  computed: {
    styles() {
      const transformer = (val) => convertToUnit(val);
      return {
        ...genBreakpointCssVarsStyles.call(this, 'gap', transformer),
        ...genBreakpointCssVarsStyles.call(this, 'flow')
      };
    }
  },

  render() {
    return (
      <div
        class='ve-stack'
        style={this.styles}
      >
        {this.$slots.default}
      </div>
    );
  }
});

export default VeStack;
