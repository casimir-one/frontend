import './VeStack.scss';

import { defineComponent } from '@deip/platform-util';
import { convertToUnit } from '@deip/toolbox';
import { genBreakpointCssVarsStyles, genBreakpointProps } from '../../util/breakpoint';

const VeStack = defineComponent({
  name: 'VeStack',

  props: {
    ...genBreakpointProps('gap', [Number, String]),
    ...genBreakpointProps(
      'flow',
      [Number, String],
      (val) => ['column', 'row', ''].includes(val),
    ),
    ...genBreakpointProps('templateColumns', [String])
  },

  computed: {
    styles() {
      const transformer = (val) => convertToUnit(val);
      return {
        ...genBreakpointCssVarsStyles.call(this, 'gap', transformer),
        ...genBreakpointCssVarsStyles.call(this, 'flow'),
        ...genBreakpointCssVarsStyles.call(this, 'templateColumns')
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
